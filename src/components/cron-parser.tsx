"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Clock, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Cron Parsing Logic ──────────────────────────────────────────────────────

interface ParsedField {
  raw: string;
  label: string;
  description: string;
  valid: boolean;
}

interface CronResult {
  valid: boolean;
  error?: string;
  description: string;
  fields: ParsedField[];
  nextRuns: Date[];
}

function parseRange(str: string, min: number, max: number): number[] | null {
  const values = new Set<number>();

  for (const part of str.split(",")) {
    if (part === "*") {
      for (let i = min; i <= max; i++) values.add(i);
      continue;
    }

    const stepMatch = part.match(/^(.+)\/(\d+)$/);
    if (stepMatch) {
      const [, rangePart, stepStr] = stepMatch;
      const step = parseInt(stepStr, 10);
      if (isNaN(step) || step < 1) return null;

      let rangeMin = min;
      let rangeMax = max;

      if (rangePart !== "*") {
        const dashMatch = rangePart.match(/^(\d+)-(\d+)$/);
        if (dashMatch) {
          rangeMin = parseInt(dashMatch[1], 10);
          rangeMax = parseInt(dashMatch[2], 10);
        } else if (/^\d+$/.test(rangePart)) {
          rangeMin = parseInt(rangePart, 10);
        } else {
          return null;
        }
      }

      if (rangeMin < min || rangeMax > max || rangeMin > rangeMax) return null;
      for (let i = rangeMin; i <= rangeMax; i += step) values.add(i);
      continue;
    }

    const dashMatch = part.match(/^(\d+)-(\d+)$/);
    if (dashMatch) {
      const lo = parseInt(dashMatch[1], 10);
      const hi = parseInt(dashMatch[2], 10);
      if (lo < min || hi > max || lo > hi) return null;
      for (let i = lo; i <= hi; i++) values.add(i);
      continue;
    }

    if (/^\d+$/.test(part)) {
      const v = parseInt(part, 10);
      if (v < min || v > max) return null;
      values.add(v);
      continue;
    }

    return null;
  }

  return Array.from(values).sort((a, b) => a - b);
}

function fieldDescription(
  raw: string,
  unit: string,
  min: number,
  max: number,
  names?: string[]
): string {
  if (raw === "*") return `every ${unit}`;

  const stepWild = raw.match(/^\*\/(\d+)$/);
  if (stepWild) return `every ${stepWild[1]} ${unit}s`;

  const rangeStep = raw.match(/^(\d+)-(\d+)\/(\d+)$/);
  if (rangeStep)
    return `every ${rangeStep[3]} ${unit}s from ${rangeStep[1]} to ${rangeStep[2]}`;

  const range = raw.match(/^(\d+)-(\d+)$/);
  if (range) {
    const lo = names ? names[parseInt(range[1], 10)] : range[1];
    const hi = names ? names[parseInt(range[2], 10)] : range[2];
    return `${lo} through ${hi}`;
  }

  if (raw.includes(",")) {
    const parts = raw.split(",");
    const labelled = names ? parts.map((p) => names[parseInt(p, 10)] ?? p) : parts;
    if (labelled.length === 2) return `${labelled[0]} and ${labelled[1]}`;
    return labelled.slice(0, -1).join(", ") + ", and " + labelled.at(-1);
  }

  if (/^\d+$/.test(raw)) {
    const n = parseInt(raw, 10);
    if (names) return names[n] ?? raw;
    return raw;
  }

  return raw;
}

const MONTHS = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function buildDescription(parts: string[]): string {
  const [min, hour, dom, month, dow] = parts;

  const domAny = dom === "*";
  const dowAny = dow === "*" || dow === "0-7" || dow === "*/1";
  const monthAny = month === "*";
  const hourAny = hour === "*";
  const minAny = min === "*";

  // "Every minute" shorthand
  if (minAny && hourAny && domAny && monthAny && dowAny) return "Every minute";

  // Time part
  let timePart = "";
  if (!hourAny && !minAny && !/[,\-\/\*]/.test(hour) && !/[,\-\/\*]/.test(min)) {
    const h = parseInt(hour, 10);
    const m = parseInt(min, 10);
    const hh = h % 12 === 0 ? 12 : h % 12;
    const mm = m.toString().padStart(2, "0");
    const ampm = h < 12 ? "AM" : "PM";
    timePart = `at ${hh}:${mm} ${ampm}`;
  } else if (hourAny && min !== "*") {
    timePart = `at minute ${fieldDescription(min, "minute", 0, 59)}`;
  } else {
    const minDesc = fieldDescription(min, "minute", 0, 59);
    const hourDesc = fieldDescription(hour, "hour", 0, 23);
    timePart = `${minDesc} past ${hourDesc}`;
  }

  // Day/period part
  const dowDesc = fieldDescription(dow, "day-of-week", 0, 7, DAYS);
  const domDesc = fieldDescription(dom, "day-of-month", 1, 31);
  const monthDesc = fieldDescription(month, "month", 1, 12, MONTHS);

  let when = "";
  if (!domAny && !dowAny) {
    when = `on day ${domDesc} of the month and on ${dowDesc}`;
  } else if (!domAny) {
    when = `on day ${domDesc} of the month`;
  } else if (!dowAny) {
    when = `on ${dowDesc}`;
  }

  const monthPart = monthAny ? "" : ` in ${monthDesc}`;

  const result = [timePart, when, monthPart].filter(Boolean).join(", ");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function parseCron(expr: string): CronResult {
  const trimmed = expr.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length !== 5) {
    return {
      valid: false,
      error: `Expected 5 fields, got ${parts.length}`,
      description: "",
      fields: [],
      nextRuns: [],
    };
  }

  const [min, hour, dom, month, dow] = parts;

  const fieldDefs: [string, string, number, number][] = [
    [min, "Minute", 0, 59],
    [hour, "Hour", 0, 23],
    [dom, "Day of Month", 1, 31],
    [month, "Month", 1, 12],
    [dow, "Day of Week", 0, 7],
  ];

  const fieldLabels = [
    "Minute (0–59)",
    "Hour (0–23)",
    "Day of Month (1–31)",
    "Month (1–12)",
    "Day of Week (0–7)",
  ];

  const parsedFields: ParsedField[] = [];
  const sets: number[][] = [];

  for (let i = 0; i < fieldDefs.length; i++) {
    const [raw, , fmin, fmax] = fieldDefs[i];
    // Normalize dow: 7 → 0
    const normalizedRaw = i === 4 ? raw.replace(/\b7\b/g, "0") : raw;
    const values = parseRange(normalizedRaw, fmin, fmax);

    let desc = "";
    if (i === 0) desc = fieldDescription(raw, "minute", fmin, fmax);
    else if (i === 1) desc = fieldDescription(raw, "hour", fmin, fmax);
    else if (i === 2) desc = fieldDescription(raw, "day", fmin, fmax);
    else if (i === 3) desc = fieldDescription(raw, "month", fmin, fmax, MONTHS);
    else desc = fieldDescription(normalizedRaw, "day", fmin, fmax, DAYS);

    parsedFields.push({
      raw,
      label: fieldLabels[i],
      description: desc,
      valid: values !== null,
    });

    if (values === null) {
      return {
        valid: false,
        error: `Invalid value "${raw}" for field "${fieldDefs[i][1]}"`,
        description: "",
        fields: parsedFields,
        nextRuns: [],
      };
    }

    sets.push(values);
  }

  const description = buildDescription(parts);

  // Compute next 10 runs
  const nextRuns: Date[] = [];
  const now = new Date();
  // Start from next minute
  const start = new Date(now);
  start.setSeconds(0, 0);
  start.setMinutes(start.getMinutes() + 1);

  const [minSet, hourSet, domSet, monthSet, dowSet] = sets;

  let candidate = new Date(start);
  let iterations = 0;
  const maxIterations = 366 * 24 * 60 * 2; // ~2 years of minutes

  while (nextRuns.length < 10 && iterations < maxIterations) {
    iterations++;
    const m = candidate.getMinutes();
    const h = candidate.getHours();
    const d = candidate.getDate();
    const mo = candidate.getMonth() + 1; // 1-based
    const dw = candidate.getDay(); // 0=Sunday

    if (!monthSet.includes(mo)) {
      // Skip to first of next matching month
      candidate.setDate(1);
      candidate.setHours(0);
      candidate.setMinutes(0);
      do {
        candidate.setMonth(candidate.getMonth() + 1);
      } while (!monthSet.includes(candidate.getMonth() + 1));
      continue;
    }

    if (!domSet.includes(d) || !dowSet.includes(dw)) {
      // Advance to next day
      candidate.setDate(candidate.getDate() + 1);
      candidate.setHours(0);
      candidate.setMinutes(0);
      continue;
    }

    if (!hourSet.includes(h)) {
      // Advance to next matching hour
      const nextHour = hourSet.find((hh) => hh > h);
      if (nextHour !== undefined) {
        candidate.setHours(nextHour);
        candidate.setMinutes(0);
      } else {
        // No more hours today, advance day
        candidate.setDate(candidate.getDate() + 1);
        candidate.setHours(0);
        candidate.setMinutes(0);
      }
      continue;
    }

    if (!minSet.includes(m)) {
      const nextMin = minSet.find((mm) => mm > m);
      if (nextMin !== undefined) {
        candidate.setMinutes(nextMin);
      } else {
        // No more minutes this hour
        const nextHour = hourSet.find((hh) => hh > h);
        if (nextHour !== undefined) {
          candidate.setHours(nextHour);
          candidate.setMinutes(minSet[0]);
        } else {
          candidate.setDate(candidate.getDate() + 1);
          candidate.setHours(0);
          candidate.setMinutes(0);
        }
      }
      continue;
    }

    // Valid match
    nextRuns.push(new Date(candidate));

    // Advance by 1 minute
    const nextMin = minSet.find((mm) => mm > m);
    if (nextMin !== undefined) {
      candidate.setMinutes(nextMin);
    } else {
      const nextHour = hourSet.find((hh) => hh > h);
      if (nextHour !== undefined) {
        candidate.setHours(nextHour);
        candidate.setMinutes(minSet[0]);
      } else {
        candidate.setDate(candidate.getDate() + 1);
        candidate.setHours(hourSet[0]);
        candidate.setMinutes(minSet[0]);
      }
    }
  }

  return { valid: true, description, fields: parsedFields, nextRuns };
}

// ─── Presets ─────────────────────────────────────────────────────────────────

const PRESETS = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every 5 minutes", value: "*/5 * * * *" },
  { label: "Every 15 minutes", value: "*/15 * * * *" },
  { label: "Every 30 minutes", value: "*/30 * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every 6 hours", value: "0 */6 * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every day at noon", value: "0 12 * * *" },
  { label: "Every Monday at 9 AM", value: "0 9 * * 1" },
  { label: "Weekdays at 9 AM", value: "0 9 * * 1-5" },
  { label: "Every Sunday at midnight", value: "0 0 * * 0" },
  { label: "First day of month at midnight", value: "0 0 1 * *" },
  { label: "Every month on the 15th", value: "0 0 15 * *" },
  { label: "Every quarter", value: "0 0 1 */3 *" },
  { label: "Twice a day (midnight + noon)", value: "0 0,12 * * *" },
  { label: "Every year on Jan 1", value: "0 0 1 1 *" },
];

// ─── Timezone list ────────────────────────────────────────────────────────────

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Australia/Sydney",
  "Pacific/Auckland",
];

function formatInTz(date: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

const FIELD_COLORS = [
  "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-700",
  "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-700",
  "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-700",
  "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300 border-pink-200 dark:border-pink-700",
  "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-700",
];

export function CronParser() {
  const [input, setInput] = useState("*/5 * * * *");
  const [timezone, setTimezone] = useState("UTC");
  const [copied, setCopied] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const result = parseCron(input);

  useEffect(() => {
    // Detect local timezone
    try {
      const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (local && TIMEZONES.includes(local)) setTimezone(local);
      else setTimezone("UTC");
    } catch {
      setTimezone("UTC");
    }
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(input).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  }, [input]);

  const handlePreset = useCallback((value: string) => {
    setInput(value);
    setShowPresets(false);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Input Area */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Cron Expression
        </label>

        {/* Expression Input */}
        <div className="flex gap-2 mb-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="*/5 * * * *"
            spellCheck={false}
            className={cn(
              "flex-1 font-mono text-lg px-4 py-3 rounded-xl border bg-background transition-colors focus:outline-none focus:ring-2",
              result.valid
                ? "border-border focus:ring-brand/40 focus:border-brand"
                : "border-destructive/50 focus:ring-destructive/30 focus:border-destructive text-destructive"
            )}
          />
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 shrink-0"
            onClick={handleCopy}
            aria-label="Copy expression"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Field Labels */}
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {["Min", "Hour", "Dom", "Month", "DoW"].map((label, i) => {
            const part = input.trim().split(/\s+/)[i];
            return (
              <span
                key={label}
                className={cn(
                  "px-2.5 py-1 text-xs font-mono rounded-lg border font-semibold",
                  part ? FIELD_COLORS[i] : "bg-muted text-muted-foreground border-border"
                )}
              >
                {label}: {part ?? "—"}
              </span>
            );
          })}
        </div>

        {/* Presets */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => setShowPresets((p) => !p)}
          >
            Presets
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showPresets && "rotate-180")} />
          </Button>

          <AnimatePresence>
            {showPresets && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute left-0 top-10 z-20 w-72 rounded-xl border border-border bg-card shadow-xl p-2"
              >
                {PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handlePreset(preset.value)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors text-left"
                  >
                    <span className="text-sm">{preset.label}</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {preset.value}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {result.valid ? (
          <motion.div
            key="valid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Description */}
            <div className="rounded-2xl border border-brand/30 bg-brand/5 px-6 py-5">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-brand mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-brand uppercase tracking-wider mb-1">
                    Schedule Description
                  </p>
                  <p className="text-xl font-semibold leading-snug">{result.description}</p>
                </div>
              </div>
            </div>

            {/* Field Breakdown */}
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Field Breakdown
              </h3>
              <div className="space-y-2">
                {result.fields.map((field, i) => (
                  <div
                    key={field.label}
                    className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0"
                  >
                    <span
                      className={cn(
                        "px-2.5 py-1 text-xs font-mono rounded-lg border font-bold shrink-0 w-20 text-center",
                        FIELD_COLORS[i]
                      )}
                    >
                      {field.raw}
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs text-muted-foreground block">{field.label}</span>
                      <span className="text-sm font-medium capitalize">{field.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Run Times */}
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Next 10 Run Times
                </h3>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="text-xs border border-border rounded-lg px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-brand/40"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                {result.nextRuns.length > 0 ? (
                  result.nextRuns.map((run, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/40 transition-colors"
                    >
                      <span className="w-5 h-5 rounded-full bg-brand/15 text-brand text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="font-mono text-sm">{formatInTz(run, timezone)}</span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No upcoming runs found in the next 2 years.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="invalid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-5"
          >
            <p className="text-sm font-semibold text-destructive mb-1">Invalid expression</p>
            <p className="text-sm text-muted-foreground">
              {result.error ?? "Please enter a valid 5-field cron expression."}
            </p>

            {/* Show partial field breakdown if any */}
            {result.fields.length > 0 && (
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {result.fields.map((f, i) => (
                  <span
                    key={f.label}
                    className={cn(
                      "px-2 py-0.5 text-xs font-mono rounded border",
                      f.valid ? FIELD_COLORS[i] : "bg-destructive/10 text-destructive border-destructive/30"
                    )}
                  >
                    {f.raw}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Reference */}
      <div className="rounded-2xl border border-border/60 bg-muted/20 p-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Quick Reference
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1.5 text-xs">
          {[
            ["*", "any value"],
            [",", "list (1,3,5)"],
            ["-", "range (1-5)"],
            ["/", "step (*/5)"],
          ].map(([sym, desc]) => (
            <div key={sym} className="flex items-center gap-2">
              <code className="font-mono font-bold text-brand px-1.5 py-0.5 bg-brand/10 rounded">
                {sym}
              </code>
              <span className="text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
