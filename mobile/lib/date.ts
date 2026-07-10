export function todayISO(): string {
  return toISODate(new Date());
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function daysBetween(fromIso: string, toIso: string): number {
  const a = new Date(fromIso + "T00:00:00").getTime();
  const b = new Date(toIso + "T00:00:00").getTime();
  return Math.round((b - a) / 86400000);
}

export function lastNDays(n: number, endIso: string = todayISO()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(addDays(endIso, -i));
  return out;
}

export function dateRange(startIso: string, endIso: string): string[] {
  const n = daysBetween(startIso, endIso);
  if (n < 0) return [];
  const out: string[] = [];
  for (let i = 0; i <= n; i++) out.push(addDays(startIso, i));
  return out;
}

/** 0 = Sunday .. 6 = Saturday, matches Date#getDay(). */
export function weekdayIndex(iso: string): number {
  return new Date(iso + "T00:00:00").getDay();
}

export function monthIndex(iso: string): number {
  return new Date(iso + "T00:00:00").getMonth();
}

export function dayOfMonth(iso: string): number {
  return new Date(iso + "T00:00:00").getDate();
}
