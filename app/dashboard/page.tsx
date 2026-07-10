"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ProgressRing } from "@/components/ProgressRing";
import { PhotoUploadCard } from "@/components/PhotoUploadCard";
import { MealPhotosGrid } from "@/components/MealPhotosGrid";
import { WaterTracker } from "@/components/WaterTracker";
import { SleepTracker } from "@/components/SleepTracker";
import { ChallengeProgressBar } from "@/components/ChallengeProgressBar";
import { FeedbackThread } from "@/components/FeedbackThread";
import { useSession, setCurrentClient } from "@/lib/session";
import { useAppData, getClient, getLog, getLogsForClient, getFeedbackForClient, upsertLog } from "@/lib/store";
import { newId } from "@/lib/id";
import { todayISO } from "@/lib/date";
import { challengeProgress, currentStreak } from "@/lib/stats";
import { DailyLog, SleepQuality } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const session = useSession();
  const data = useAppData();
  const today = todayISO();

  const client = session.clientId ? getClient(data, session.clientId) : undefined;

  useEffect(() => {
    if (data.clients.length === 0) return; // wait for store to hydrate
    if (!session.clientId || !client) {
      router.replace("/onboarding");
    }
  }, [session.clientId, client, data.clients.length, router]);

  if (!client) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-ink-muted">加载中…</div>
    );
  }

  const log = getLog(data, client.id, today);
  const logs = getLogsForClient(data, client.id);
  const feedback = getFeedbackForClient(data, client.id);
  const progress = challengeProgress(client);
  const streak = currentStreak(logs);
  const calories = log?.calories ?? 0;
  const caloriePercent = Math.min(100, Math.round((calories / client.magicNumber) * 100));

  function patchToday(patch: Partial<DailyLog>) {
    const existing: DailyLog =
      log ?? {
        id: newId("log"),
        clientId: client!.id,
        date: today,
        mealPhotos: [],
        waterMl: 0,
        updatedAt: "",
      };
    upsertLog({ ...existing, ...patch, updatedAt: new Date().toISOString() });
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-3">
          <select
            value={client.id}
            onChange={(e) => setCurrentClient(e.target.value)}
            className="rounded-full border border-hairline bg-surface px-3 py-1.5 text-xs text-ink-secondary outline-none"
            title="切换学员（测试用）"
          >
            {data.clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <Link href="/history" className="text-sm font-medium text-brand-600 hover:underline">
            历史记录
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 pb-16">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-xl text-white"
            style={{ background: client.avatarColor }}
          >
            {client.avatarEmoji}
          </div>
          <div>
            <p className="font-semibold text-ink-primary">{client.name}，你好 👋</p>
            <p className="text-sm text-ink-secondary">今天也要好好照顾自己哦</p>
          </div>
        </div>

        <div className="mt-5">
          <ChallengeProgressBar challengeType={client.challengeType} progress={progress} streak={streak} />
        </div>

        <section className="mt-6 rounded-2xl border border-hairline bg-surface p-5">
          <div className="flex items-center gap-5">
            <ProgressRing percent={caloriePercent} color="var(--color-gold-300)" size={104} strokeWidth={10}>
              <div className="text-center">
                <div className="text-lg font-bold text-ink-primary">{calories || "--"}</div>
                <div className="text-[10px] text-ink-muted">/ {client.magicNumber} kcal</div>
              </div>
            </ProgressRing>
            <div className="flex-1">
              <p className="flex items-center gap-1.5 font-semibold text-ink-primary">
                🎯 今日神奇数字
              </p>
              <p className="mt-1 text-sm text-ink-secondary">
                记录今天摄入的总卡路里，尽量贴近 {client.magicNumber} kcal 的目标。
              </p>
              <input
                type="number"
                inputMode="numeric"
                value={log?.calories ?? ""}
                onChange={(e) => patchToday({ calories: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="输入今日总摄入卡路里"
                className="mt-3 w-full rounded-xl border border-hairline bg-surface-page px-4 py-2.5 text-sm outline-none focus:border-gold-300"
              />
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 font-semibold text-ink-primary">每日打卡拍照</h2>
          <div className="grid grid-cols-2 gap-3">
            <PhotoUploadCard
              label="营养奶昔"
              icon="🥤"
              value={log?.shakePhoto}
              onChange={(url) => patchToday({ shakePhoto: url })}
            />
            <PhotoUploadCard
              label="Supplements"
              icon="💊"
              value={log?.supplementPhoto}
              onChange={(url) => patchToday({ supplementPhoto: url })}
            />
          </div>
          <div className="mt-3">
            <p className="mb-2 text-sm font-medium text-ink-secondary">三餐 / 加餐照片</p>
            <MealPhotosGrid
              photos={log?.mealPhotos ?? []}
              onAdd={(url) => patchToday({ mealPhotos: [...(log?.mealPhotos ?? []), url] })}
              onRemove={(idx) =>
                patchToday({ mealPhotos: (log?.mealPhotos ?? []).filter((_, i) => i !== idx) })
              }
            />
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <WaterTracker
            waterMl={log?.waterMl ?? 0}
            goalMl={client.waterGoalMl}
            onChange={(ml) => patchToday({ waterMl: ml })}
          />
          <SleepTracker
            hours={log?.sleepHours}
            quality={log?.sleepQuality}
            goalHours={client.sleepGoalHours}
            onHoursChange={(h) => patchToday({ sleepHours: h })}
            onQualityChange={(q: SleepQuality) => patchToday({ sleepQuality: q })}
          />
        </section>

        <section className="mt-8">
          <h2 className="mb-3 font-semibold text-ink-primary">💬 Coach Eehuan 的话</h2>
          <FeedbackThread items={feedback.slice(0, 5)} />
        </section>
      </main>
    </div>
  );
}
