"use client";

import { useEffect, useMemo } from "react";
import { Logo } from "@/components/Logo";
import { ClientCard } from "@/components/ClientCard";
import { StatTile } from "@/components/StatTile";
import { useSession, setCoach } from "@/lib/session";
import { useAppData, getLog, getLogsForClient } from "@/lib/store";
import { todayISO } from "@/lib/date";
import { dayStatus, DayStatus } from "@/lib/stats";

const STATUS_RANK: Record<DayStatus, number> = { critical: 0, missing: 1, warning: 2, good: 3 };

export default function CoachPage() {
  const session = useSession();
  const data = useAppData();
  const today = todayISO();

  useEffect(() => {
    if (session.role !== "coach") setCoach();
  }, [session.role]);

  const rows = useMemo(
    () =>
      data.clients.map((client) => {
        const todayLog = getLog(data, client.id, today);
        const logs = getLogsForClient(data, client.id);
        return { client, todayLog, logs, status: dayStatus(todayLog, client) };
      }),
    [data, today]
  );

  const sorted = [...rows].sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status]);

  const checkedInToday = rows.filter((r) => r.status !== "missing").length;
  const checkInRate = rows.length ? Math.round((checkedInToday / rows.length) * 100) : 0;
  const needsAttention = rows.filter((r) => r.status === "critical" || r.status === "missing").length;

  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-5">
        <Logo />
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          教练后台 · Auditor
        </span>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-16">
        <h1 className="text-xl font-bold text-ink-primary">今日学员总览</h1>
        <p className="mt-1 text-sm text-ink-secondary">先看需要关注的学员，及时表扬或给出专业建议。</p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <StatTile label="学员总数" value={String(rows.length)} />
          <StatTile label="今日打卡率" value={`${checkInRate}%`} hint={`${checkedInToday}/${rows.length} 人`} />
          <StatTile label="需要关注" value={String(needsAttention)} hint="未打卡或未达标" />
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {sorted.map(({ client, todayLog, logs, status }) => (
            <ClientCard key={client.id} client={client} todayLog={todayLog} status={status} streakLogs={logs} />
          ))}
          {rows.length === 0 && (
            <p className="rounded-2xl border border-dashed border-hairline p-8 text-center text-sm text-ink-muted">
              还没有学员数据。
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
