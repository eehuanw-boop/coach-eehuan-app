"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { addClient } from "@/lib/store";
import { setCurrentClient } from "@/lib/session";
import { newId } from "@/lib/id";
import { todayISO } from "@/lib/date";
import {
  CHALLENGE_DAYS,
  CHALLENGE_LABEL,
  ChallengeType,
  Client,
  Goal,
  GOAL_LABEL,
} from "@/lib/types";

const GOAL_OPTIONS: { value: Goal; icon: string; hint: string }[] = [
  { value: "loss", icon: "🥗", hint: "热量赤字，稳定减脂" },
  { value: "gain", icon: "💪", hint: "热量盈余，增重增肌" },
  { value: "maintain", icon: "🌟", hint: "维持现有体态与作息" },
];

const CHALLENGE_OPTIONS: ChallengeType[] = ["day11", "month1", "month3"];

const GOAL_AVATAR: Record<Goal, { emoji: string; color: string }> = {
  loss: { emoji: "🥗", color: "#0E7A4A" },
  gain: { emoji: "💪", color: "#B4790C" },
  maintain: { emoji: "🌟", color: "#4A3AA7" },
};

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [goal, setGoal] = useState<Goal>("loss");
  const [weight, setWeight] = useState<string>("");
  const [targetWeight, setTargetWeight] = useState<string>("");
  const [magicNumber, setMagicNumber] = useState<string>("");
  const [waterGoalMl, setWaterGoalMl] = useState(2000);
  const [sleepGoalHours, setSleepGoalHours] = useState(7.5);
  const [challengeType, setChallengeType] = useState<ChallengeType>("day11");
  const [startDate, setStartDate] = useState(todayISO());
  const [error, setError] = useState("");

  const suggestedMagicNumber = useMemo(() => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return null;
    const maintenance = Math.round(w * 30);
    if (goal === "loss") return maintenance - 500;
    if (goal === "gain") return maintenance + 400;
    return maintenance;
  }, [weight, goal]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const magic = parseFloat(magicNumber);
    if (!name.trim()) {
      setError("请填写你的姓名");
      return;
    }
    if (!magic || magic <= 0) {
      setError("请输入你的每日神奇数字（目标卡路里）");
      return;
    }
    const avatar = GOAL_AVATAR[goal];
    const client: Client = {
      id: newId("client"),
      name: name.trim(),
      avatarEmoji: avatar.emoji,
      avatarColor: avatar.color,
      goal,
      startWeightKg: weight ? parseFloat(weight) : undefined,
      targetWeightKg: targetWeight ? parseFloat(targetWeight) : undefined,
      magicNumber: magic,
      waterGoalMl,
      sleepGoalHours,
      challengeType,
      challengeStartDate: startDate,
      joinedAt: new Date().toISOString(),
    };
    addClient(client);
    setCurrentClient(client.id);
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-2xl items-center px-6 py-5">
        <Logo />
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 pb-16">
        <h1 className="text-2xl font-bold text-ink-primary">建立你的打卡档案</h1>
        <p className="mt-1.5 text-sm text-ink-secondary">
          填好这些资料，Coach Eehuan 就能陪你一起追踪每天的营养与作息。
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8">
          <section>
            <label className="block text-sm font-semibold text-ink-primary">你的姓名</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：陈志强"
              className="mt-2 w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-sm outline-none focus:border-brand-400"
            />
          </section>

          <section>
            <label className="block text-sm font-semibold text-ink-primary">你的目标</label>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {GOAL_OPTIONS.map((g) => (
                <button
                  type="button"
                  key={g.value}
                  onClick={() => setGoal(g.value)}
                  className={`rounded-xl border p-4 text-left transition ${
                    goal === g.value
                      ? "border-brand-500 bg-brand-50"
                      : "border-hairline bg-surface hover:border-brand-200"
                  }`}
                >
                  <div className="text-xl">{g.icon}</div>
                  <div className="mt-1.5 font-semibold text-ink-primary">{GOAL_LABEL[g.value]}</div>
                  <div className="mt-0.5 text-xs text-ink-secondary">{g.hint}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink-primary">目前体重 (kg)</label>
              <input
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="选填"
                className="mt-2 w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-sm outline-none focus:border-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-primary">目标体重 (kg)</label>
              <input
                type="number"
                inputMode="decimal"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                placeholder="选填"
                className="mt-2 w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-sm outline-none focus:border-brand-400"
              />
            </div>
          </section>

          <section>
            <label className="block text-sm font-semibold text-ink-primary">
              每日神奇数字（目标卡路里）
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="number"
                inputMode="numeric"
                value={magicNumber}
                onChange={(e) => setMagicNumber(e.target.value)}
                placeholder="例如：1450"
                className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-sm outline-none focus:border-brand-400"
              />
              <span className="shrink-0 text-sm text-ink-muted">kcal</span>
            </div>
            {suggestedMagicNumber && (
              <button
                type="button"
                onClick={() => setMagicNumber(String(suggestedMagicNumber))}
                className="mt-2 text-xs text-brand-600 underline decoration-dotted underline-offset-4"
              >
                根据体重估算参考值：{suggestedMagicNumber} kcal，点击套用
              </button>
            )}
            <p className="mt-1.5 text-xs text-ink-muted">
              没把握的话，可以先请 Coach Eehuan 帮你核算这个数字。
            </p>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink-primary">每日饮水目标</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  step={100}
                  value={waterGoalMl}
                  onChange={(e) => setWaterGoalMl(Number(e.target.value))}
                  className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-sm outline-none focus:border-brand-400"
                />
                <span className="shrink-0 text-sm text-ink-muted">ml</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-primary">每日睡眠目标</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  step={0.5}
                  value={sleepGoalHours}
                  onChange={(e) => setSleepGoalHours(Number(e.target.value))}
                  className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-sm outline-none focus:border-brand-400"
                />
                <span className="shrink-0 text-sm text-ink-muted">小时</span>
              </div>
            </div>
          </section>

          <section>
            <label className="block text-sm font-semibold text-ink-primary">选择挑战计划</label>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {CHALLENGE_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setChallengeType(c)}
                  className={`rounded-xl border p-4 text-left transition ${
                    challengeType === c
                      ? "border-brand-500 bg-brand-50"
                      : "border-hairline bg-surface hover:border-brand-200"
                  }`}
                >
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold-50 px-2.5 py-0.5 text-xs font-semibold text-gold-600">
                    {CHALLENGE_DAYS[c]} 天
                  </span>
                  <div className="mt-1.5 font-semibold text-ink-primary">{CHALLENGE_LABEL[c]}</div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="block text-sm font-semibold text-ink-primary">开始日期</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-2 w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-sm outline-none focus:border-brand-400 sm:w-56"
            />
          </section>

          {error && <p className="text-sm text-status-critical">{error}</p>}

          <button
            type="submit"
            className="rounded-full bg-brand-600 px-7 py-3.5 font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            开始打卡 →
          </button>
        </form>
      </main>
    </div>
  );
}
