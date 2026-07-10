import Link from "next/link";
import { Client } from "@/lib/types";
import { CHALLENGE_LABEL } from "@/lib/types";
import { DailyLog } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { DayStatus, challengeProgress, currentStreak } from "@/lib/stats";

export function ClientCard({
  client,
  todayLog,
  status,
  streakLogs,
}: {
  client: Client;
  todayLog: DailyLog | undefined;
  status: DayStatus;
  streakLogs: DailyLog[];
}) {
  const progress = challengeProgress(client);
  const streak = currentStreak(streakLogs);

  return (
    <Link
      href={`/coach/${client.id}`}
      className="flex items-center gap-4 rounded-2xl border border-hairline bg-surface p-4 transition hover:border-brand-300"
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl text-white"
        style={{ background: client.avatarColor }}
      >
        {client.avatarEmoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold text-ink-primary">{client.name}</p>
          <StatusBadge status={status} />
        </div>
        <p className="mt-1 text-xs text-ink-secondary">
          {CHALLENGE_LABEL[client.challengeType]} · 第 {progress.dayNumber}/{progress.totalDays} 天 · 🔥
          {streak} 天连续
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
          <span className={todayLog?.shakePhoto ? "opacity-100" : "opacity-30"}>🥤</span>
          <span className={todayLog?.supplementPhoto ? "opacity-100" : "opacity-30"}>💊</span>
          <span className={(todayLog?.mealPhotos.length ?? 0) > 0 ? "opacity-100" : "opacity-30"}>🍽️</span>
          <span className={todayLog?.waterMl ? "opacity-100" : "opacity-30"}>💧</span>
          <span className={todayLog?.sleepHours != null ? "opacity-100" : "opacity-30"}>😴</span>
        </p>
      </div>
      <span className="shrink-0 text-ink-muted">→</span>
    </Link>
  );
}
