import { CHALLENGE_DAYS, Client, DailyLog } from "./types";
import { addDays, daysBetween, todayISO } from "./date";

export type DayStatus = "good" | "warning" | "critical" | "missing";

const STATUS_RANK: Record<DayStatus, number> = { good: 0, warning: 1, critical: 2, missing: 3 };

export function worseStatus(a: DayStatus, b: DayStatus): DayStatus {
  return STATUS_RANK[a] >= STATUS_RANK[b] ? a : b;
}

export function calorieStatus(log: DailyLog | undefined, client: Client): DayStatus {
  if (!log || log.calories == null) return "missing";
  const diff = Math.abs(log.calories - client.magicNumber) / client.magicNumber;
  if (diff <= 0.1) return "good";
  if (diff <= 0.25) return "warning";
  return "critical";
}

export function waterStatus(log: DailyLog | undefined, client: Client): DayStatus {
  if (!log || !log.waterMl) return "missing";
  const ratio = log.waterMl / client.waterGoalMl;
  if (ratio >= 0.9) return "good";
  if (ratio >= 0.6) return "warning";
  return "critical";
}

export function sleepStatus(log: DailyLog | undefined, client: Client): DayStatus {
  if (!log || log.sleepHours == null) return "missing";
  const diff = Math.abs(log.sleepHours - client.sleepGoalHours);
  if (diff <= 1) return "good";
  if (diff <= 2) return "warning";
  return "critical";
}

export function dayStatus(log: DailyLog | undefined, client: Client): DayStatus {
  if (!log) return "missing";
  const hasAnyEntry =
    log.calories != null ||
    log.waterMl > 0 ||
    log.sleepHours != null ||
    !!log.shakePhoto ||
    !!log.supplementPhoto ||
    log.mealPhotos.length > 0;
  if (!hasAnyEntry) return "missing";
  // Only fold over metrics that have actually been logged — an unlogged metric
  // (e.g. sleep, before bedtime) shouldn't drag a partially-complete day down to "missing".
  const logged = [calorieStatus(log, client), waterStatus(log, client), sleepStatus(log, client)].filter(
    (s): s is Exclude<DayStatus, "missing"> => s !== "missing"
  );
  if (logged.length === 0) return "warning";
  return logged.reduce<DayStatus>((a, b) => worseStatus(a, b), "good");
}

export function isLogComplete(log: DailyLog | undefined): boolean {
  if (!log) return false;
  return !!log.shakePhoto && !!log.supplementPhoto && log.mealPhotos.length > 0 && log.calories != null;
}

/** Consecutive days (ending yesterday or today) with a completed check-in. */
export function currentStreak(logs: DailyLog[]): number {
  const byDate = new Map(logs.map((l) => [l.date, l]));
  const today = todayISO();
  let cursor = byDate.has(today) && isLogComplete(byDate.get(today)) ? today : addDays(today, -1);
  let streak = 0;
  while (true) {
    const log = byDate.get(cursor);
    if (log && isLogComplete(log)) {
      streak++;
      cursor = addDays(cursor, -1);
    } else {
      break;
    }
  }
  return streak;
}

export interface ChallengeProgress {
  dayNumber: number; // 1-indexed, clamped to [1, totalDays]
  totalDays: number;
  percent: number; // 0-100
  daysRemaining: number;
  isComplete: boolean;
}

export function challengeProgress(client: Client): ChallengeProgress {
  const totalDays = CHALLENGE_DAYS[client.challengeType];
  const elapsed = daysBetween(client.challengeStartDate, todayISO()) + 1;
  const dayNumber = Math.min(Math.max(elapsed, 1), totalDays);
  const percent = Math.round((dayNumber / totalDays) * 100);
  return {
    dayNumber,
    totalDays,
    percent,
    daysRemaining: Math.max(totalDays - dayNumber, 0),
    isComplete: elapsed > totalDays,
  };
}
