"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { StatusBadge } from "@/components/StatusBadge";
import { FeedbackThread } from "@/components/FeedbackThread";
import { FeedbackComposer } from "@/components/FeedbackComposer";
import { ComplianceTrendChart, TrendDay } from "@/components/ComplianceTrendChart";
import { ChallengeProgressBar } from "@/components/ChallengeProgressBar";
import { useSession, setCoach } from "@/lib/session";
import { useAppData, getClient, getLog, getLogsForClient, getFeedbackForClient, addFeedback } from "@/lib/store";
import { newId } from "@/lib/id";
import { lastNDays, formatDateLabel, weekdayLabel } from "@/lib/date";
import { calorieStatus, waterStatus, sleepStatus, dayStatus, challengeProgress, currentStreak } from "@/lib/stats";
import { GOAL_LABEL, FeedbackType } from "@/lib/types";

export function CoachClientDetail({ clientId }: { clientId: string }) {
  const session = useSession();
  const data = useAppData();

  useEffect(() => {
    if (session.role !== "coach") setCoach();
  }, [session.role]);

  const client = getClient(data, clientId);
  const logs = client ? getLogsForClient(data, client.id) : [];
  const feedback = client ? getFeedbackForClient(data, client.id) : [];

  const trendDays: TrendDay[] = client
    ? lastNDays(7).map((date) => {
        const log = getLog(data, client.id, date);
        return {
          date,
          caloriePct: log?.calories ? Math.round((log.calories / client.magicNumber) * 100) : 0,
          waterPct: log?.waterMl ? Math.round((log.waterMl / client.waterGoalMl) * 100) : 0,
          sleepPct: log?.sleepHours ? Math.round((log.sleepHours / client.sleepGoalHours) * 100) : 0,
        };
      })
    : [];

  if (!client) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-16 text-center text-sm text-ink-muted">
        找不到这位学员，
        <Link href="/coach" className="text-brand-600 underline">
          返回学员列表
        </Link>
      </div>
    );
  }

  const progress = challengeProgress(client);
  const streak = currentStreak(logs);

  function handleAddFeedback(
    date: string,
    payload: { type: FeedbackType; quickTag?: string; message: string }
  ) {
    addFeedback({
      id: newId("fb"),
      clientId: client!.id,
      logDate: date,
      type: payload.type,
      quickTag: payload.quickTag,
      message: payload.message,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-5">
        <Logo />
        <Link href="/coach" className="text-sm font-medium text-brand-600 hover:underline">
          ← 学员列表
        </Link>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 pb-16">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl text-white"
            style={{ background: client.avatarColor }}
          >
            {client.avatarEmoji}
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink-primary">{client.name}</h1>
            <p className="text-sm text-ink-secondary">
              {GOAL_LABEL[client.goal]} · 神奇数字 {client.magicNumber} kcal · 饮水 {(client.waterGoalMl / 1000).toFixed(1)}L
              · 睡眠 {client.sleepGoalHours}h
            </p>
          </div>
        </div>

        <div className="mt-5">
          <ChallengeProgressBar challengeType={client.challengeType} progress={progress} streak={streak} />
        </div>

        <div className="mt-6">
          <ComplianceTrendChart days={trendDays} />
        </div>

        <section className="mt-8">
          <h2 className="mb-3 font-semibold text-ink-primary">每日打卡记录</h2>
          <div className="flex flex-col gap-5">
            {logs.slice(0, 14).map((log) => {
              const dayFeedback = feedback.filter((f) => f.logDate === log.date);
              const photos = [log.shakePhoto, log.supplementPhoto, ...log.mealPhotos].filter(Boolean) as string[];
              return (
                <div key={log.id} className="rounded-2xl border border-hairline bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink-primary">
                      {formatDateLabel(log.date)} · {weekdayLabel(log.date)}
                    </p>
                    <StatusBadge status={dayStatus(log, client)} />
                  </div>

                  {photos.length > 0 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto">
                      {photos.map((p, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={p} alt="打卡照片" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                      ))}
                    </div>
                  )}

                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-surface-page p-2.5">
                      <p className="text-[11px] text-ink-muted">卡路里</p>
                      <p className="text-sm font-semibold text-ink-primary">{log.calories ?? "--"}</p>
                      <StatusBadge status={calorieStatus(log, client)} className="mt-1" />
                    </div>
                    <div className="rounded-xl bg-surface-page p-2.5">
                      <p className="text-[11px] text-ink-muted">饮水</p>
                      <p className="text-sm font-semibold text-ink-primary">{(log.waterMl / 1000).toFixed(1)}L</p>
                      <StatusBadge status={waterStatus(log, client)} className="mt-1" />
                    </div>
                    <div className="rounded-xl bg-surface-page p-2.5">
                      <p className="text-[11px] text-ink-muted">睡眠</p>
                      <p className="text-sm font-semibold text-ink-primary">{log.sleepHours ?? "--"}h</p>
                      <StatusBadge status={sleepStatus(log, client)} className="mt-1" />
                    </div>
                  </div>

                  {dayFeedback.length > 0 && (
                    <div className="mt-3">
                      <FeedbackThread items={dayFeedback} />
                    </div>
                  )}

                  <div className="mt-3">
                    <FeedbackComposer onSubmit={(payload) => handleAddFeedback(log.date, payload)} />
                  </div>
                </div>
              );
            })}
            {logs.length === 0 && (
              <p className="rounded-2xl border border-dashed border-hairline p-8 text-center text-sm text-ink-muted">
                这位学员还没有打卡记录。
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
