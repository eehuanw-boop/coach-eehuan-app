import { formatDateLabel, weekdayLabel } from "@/lib/date";

export interface TrendDay {
  date: string;
  caloriePct: number;
  waterPct: number;
  sleepPct: number;
}

const SERIES = [
  { key: "caloriePct" as const, label: "卡路里", color: "var(--color-series-1)" },
  { key: "waterPct" as const, label: "饮水", color: "var(--color-series-2)" },
  { key: "sleepPct" as const, label: "睡眠", color: "var(--color-series-3)" },
];

const CHART_HEIGHT = 140;
const CAP = 150; // percent scale ceiling
const GOAL_LINE_TOP = ((1 - 100 / CAP) * CHART_HEIGHT).toFixed(1);

export function ComplianceTrendChart({ days }: { days: TrendDay[] }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ink-primary">近7天达标趋势</h3>
      </div>
      <div className="mt-2 flex items-center gap-4">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-xs text-ink-secondary">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>

      <div className="relative mt-4" style={{ height: CHART_HEIGHT }}>
        <div
          className="absolute left-0 right-0 border-t border-dashed"
          style={{ top: `${GOAL_LINE_TOP}px`, borderColor: "var(--color-hairline)" }}
        />
        <span
          className="absolute right-0 -translate-y-full text-[10px] text-ink-muted"
          style={{ top: `${GOAL_LINE_TOP}px` }}
        >
          目标 100%
        </span>
        <div className="flex h-full items-end justify-between gap-2">
          {days.map((d) => (
            <div key={d.date} className="flex h-full flex-1 items-end justify-center gap-[3px]">
              {SERIES.map((s) => {
                const raw = d[s.key];
                const value = Math.max(0, Math.min(CAP, raw));
                const heightPx = Math.max(2, (value / CAP) * CHART_HEIGHT);
                return (
                  <div
                    key={s.key}
                    title={`${s.label} ${formatDateLabel(d.date)}：${Math.round(raw)}%`}
                    className="w-2 rounded-t-[3px]"
                    style={{ height: heightPx, background: s.color }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-between">
        {days.map((d) => (
          <span key={d.date} className="flex-1 text-center text-[10px] text-ink-muted">
            {weekdayLabel(d.date).replace("周", "")}
          </span>
        ))}
      </div>
    </div>
  );
}
