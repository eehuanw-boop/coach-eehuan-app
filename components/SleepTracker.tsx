import { SLEEP_QUALITY_LABEL, SleepQuality } from "@/lib/types";
import { round1 } from "@/lib/number";

const QUALITIES: SleepQuality[] = ["poor", "ok", "good"];
const QUALITY_ICON: Record<SleepQuality, string> = { poor: "😣", ok: "😐", good: "😴" };

export function SleepTracker({
  hours,
  quality,
  goalHours,
  onHoursChange,
  onQualityChange,
}: {
  hours?: number;
  quality?: SleepQuality;
  goalHours: number;
  onHoursChange: (hours: number) => void;
  onQualityChange: (q: SleepQuality) => void;
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">😴</span>
          <span className="font-semibold text-ink-primary">昨晚睡眠</span>
        </div>
        <span className="text-sm text-ink-secondary">目标 {goalHours} 小时</span>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onHoursChange(round1(Math.max(0, (hours ?? goalHours) - 0.5)))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-lg text-ink-secondary transition hover:border-brand-300"
          aria-label="减少0.5小时"
        >
          −
        </button>
        <div className="flex-1 text-center">
          <span className="text-2xl font-bold text-ink-primary">{hours != null ? hours : "--"}</span>
          <span className="ml-1 text-sm text-ink-muted">小时</span>
        </div>
        <button
          type="button"
          onClick={() => onHoursChange(round1((hours ?? goalHours - 0.5) + 0.5))}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4A3AA7] text-lg text-white transition hover:opacity-90"
          aria-label="增加0.5小时"
        >
          +
        </button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {QUALITIES.map((q) => (
          <button
            type="button"
            key={q}
            onClick={() => onQualityChange(q)}
            className={`rounded-xl border py-2 text-center text-xs transition ${
              quality === q
                ? "border-[#4A3AA7] bg-[#4A3AA7]/10 text-[#4A3AA7] font-semibold"
                : "border-hairline text-ink-secondary hover:border-[#4A3AA7]/40"
            }`}
          >
            <div className="text-base">{QUALITY_ICON[q]}</div>
            {SLEEP_QUALITY_LABEL[q]}
          </button>
        ))}
      </div>
    </div>
  );
}
