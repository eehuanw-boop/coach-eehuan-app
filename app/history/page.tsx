"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { StatusDot, StatusBadge } from "@/components/StatusBadge";
import { FeedbackThread } from "@/components/FeedbackThread";
import { useSession } from "@/lib/session";
import { useAppData, getClient, getLog, getFeedbackForClient } from "@/lib/store";
import { dateRange, formatDateLabel, todayISO, weekdayLabel } from "@/lib/date";
import { calorieStatus, dayStatus, sleepStatus, waterStatus } from "@/lib/stats";

export default function HistoryPage() {
  const router = useRouter();
  const session = useSession();
  const data = useAppData();
  const today = todayISO();
  const [selectedDate, setSelectedDate] = useState(today);

  const client = session.clientId ? getClient(data, session.clientId) : undefined;

  useEffect(() => {
    if (data.clients.length === 0) return;
    if (!session.clientId || !client) router.replace("/onboarding");
  }, [session.clientId, client, data.clients.length, router]);

  const days = useMemo(() => {
    if (!client) return [];
    return dateRange(client.challengeStartDate, today).reverse();
  }, [client, today]);

  const feedback = client ? getFeedbackForClient(data, client.id) : [];

  if (!client) {
    return <div className="flex flex-1 items-center justify-center text-sm text-ink-muted">加载中…</div>;
  }

  const selectedLog = getLog(data, client.id, selectedDate);
  const selectedFeedback = feedback.filter((f) => f.logDate === selectedDate);

  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-5">
        <Logo />
        <Link href="/dashboard" className="text-sm font-medium text-brand-600 hover:underline">
          返回今日打卡
        </Link>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 pb-16">
        <h1 className="text-xl font-bold text-ink-primary">{client.name} 的打卡记录</h1>
        <p className="mt-1 text-sm text-ink-secondary">挑战开始于 {formatDateLabel(client.challengeStartDate)}</p>

        <div className="mt-5 grid grid-cols-7 gap-2">
          {days.map((d) => {
            const status = dayStatus(getLog(data, client.id, d), client);
            const selected = d === selectedDate;
            return (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border py-2.5 transition ${
                  selected ? "border-brand-500 bg-brand-50" : "border-hairline bg-surface hover:border-brand-200"
                }`}
              >
                <span className="text-[10px] text-ink-muted">{weekdayLabel(d)}</span>
                <StatusDot status={status} />
                <span className="text-[11px] text-ink-secondary">{formatDateLabel(d).replace("月", "/").replace("日", "")}</span>
              </button>
            );
          })}
        </div>

        <section className="mt-6 rounded-2xl border border-hairline bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink-primary">{formatDateLabel(selectedDate)}（{weekdayLabel(selectedDate)}）</h2>
            <StatusDot status={dayStatus(selectedLog, client)} />
          </div>

          {!selectedLog ? (
            <p className="mt-4 text-sm text-ink-muted">这一天还没有打卡记录。</p>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[selectedLog.shakePhoto, selectedLog.supplementPhoto, ...selectedLog.mealPhotos]
                  .filter(Boolean)
                  .map((p, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={p as string} alt="打卡照片" className="aspect-square rounded-xl object-cover" />
                  ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-surface-page p-3">
                  <p className="text-xs text-ink-muted">卡路里</p>
                  <p className="mt-1 font-semibold text-ink-primary">{selectedLog.calories ?? "--"}</p>
                  <StatusBadge status={calorieStatus(selectedLog, client)} className="mt-1.5" />
                </div>
                <div className="rounded-xl bg-surface-page p-3">
                  <p className="text-xs text-ink-muted">饮水</p>
                  <p className="mt-1 font-semibold text-ink-primary">{(selectedLog.waterMl / 1000).toFixed(1)}L</p>
                  <StatusBadge status={waterStatus(selectedLog, client)} className="mt-1.5" />
                </div>
                <div className="rounded-xl bg-surface-page p-3">
                  <p className="text-xs text-ink-muted">睡眠</p>
                  <p className="mt-1 font-semibold text-ink-primary">{selectedLog.sleepHours ?? "--"}h</p>
                  <StatusBadge status={sleepStatus(selectedLog, client)} className="mt-1.5" />
                </div>
              </div>
            </>
          )}

          {selectedFeedback.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-ink-primary">教练点评</p>
              <FeedbackThread items={selectedFeedback} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
