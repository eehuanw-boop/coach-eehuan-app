import { CHALLENGE_LABEL, ChallengeType } from "@/lib/types";
import { ChallengeProgress } from "@/lib/stats";

export function ChallengeProgressBar({
  challengeType,
  progress,
  streak,
}: {
  challengeType: ChallengeType;
  progress: ChallengeProgress;
  streak: number;
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-gold-50 px-2.5 py-0.5 text-xs font-semibold text-gold-600">
            {CHALLENGE_LABEL[challengeType]}
          </span>
          <p className="mt-1.5 text-sm text-ink-secondary">
            第 <span className="font-semibold text-ink-primary">{progress.dayNumber}</span> 天 / 共{" "}
            {progress.totalDays} 天
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-gold-50 px-3 py-1.5 text-sm font-semibold text-gold-600">
          🔥 连续打卡 {streak} 天
        </div>
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-brand-50">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
      <p className="mt-1.5 text-right text-xs text-ink-muted">
        {progress.isComplete ? "挑战已完成 🎉" : `还剩 ${progress.daysRemaining} 天`}
      </p>
    </div>
  );
}
