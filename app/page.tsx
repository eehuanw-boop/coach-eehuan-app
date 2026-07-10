import { CoachAvatar } from "@/components/CoachAvatar";
import { Logo } from "@/components/Logo";
import { EntryButtons } from "@/components/EntryButtons";
import { CHALLENGE_DAYS, CHALLENGE_LABEL } from "@/lib/types";

const FEATURES = [
  {
    icon: "📸",
    title: "每日打卡拍照",
    desc: "奶昔、Supplements、三餐照片一次记录，习惯看得见。",
  },
  {
    icon: "🎯",
    title: "神奇数字热量目标",
    desc: "根据增重/减重目标设定每日卡路里，实时看达标进度。",
  },
  {
    icon: "💧",
    title: "饮水追踪",
    desc: "一键记录每日饮水量，養成规律的补水习惯。",
  },
  {
    icon: "😴",
    title: "睡眠状况",
    desc: "记录睡眠时长与质量，作息规律才能事半功倍。",
  },
  {
    icon: "🏆",
    title: "挑战与连续打卡",
    desc: "11天启动 / 1个月 / 3个月蜕变挑战，累积连续打卡天数。",
  },
  {
    icon: "💬",
    title: "教练真人点评",
    desc: "Coach Eehuan 每日亲自查看，及时表扬或专业修正。",
  },
];

const CHALLENGES: { type: keyof typeof CHALLENGE_LABEL; desc: string }[] = [
  { type: "day11", desc: "先建立打卡习惯，快速感受身体变化的启动挑战。" },
  { type: "month1", desc: "一个月稳定执行营养与作息，看见明显蜕变。" },
  { type: "month3", desc: "长期陪伴，把健康习惯变成生活方式。" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Logo />
      </header>

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-brand-100 blur-3xl opacity-60"
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pb-16 pt-10 text-center">
          <CoachAvatar size="xl" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink-primary sm:text-4xl">
            Coach Eehuan 蜕变陪伴系统
          </h1>
          <p className="mt-4 max-w-xl text-balance text-base leading-relaxed text-ink-secondary sm:text-lg">
            每天拍下你的奶昔、Supplements 与三餐，记录饮水和睡眠，
            达成属于你的「神奇数字」。真人教练每日陪伴，及时表扬、专业修正，
            让改变真正发生。
          </p>
          <div className="mt-8">
            <EntryButtons />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-hairline bg-surface p-5 shadow-sm"
            >
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold text-ink-primary">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-10">
        <h2 className="text-center text-xl font-bold text-ink-primary">选择你的挑战计划</h2>
        <p className="mt-2 text-center text-sm text-ink-secondary">
          每个计划都会配有完整的每日打卡与教练跟进
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CHALLENGES.map((c) => (
            <div
              key={c.type}
              className="flex flex-col rounded-2xl border border-hairline bg-surface p-6 text-center shadow-sm"
            >
              <span className="mx-auto inline-flex items-center gap-1 rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold text-gold-600">
                {CHALLENGE_DAYS[c.type]} 天
              </span>
              <h3 className="mt-3 font-semibold text-ink-primary">{CHALLENGE_LABEL[c.type]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 py-14">
        <div className="rounded-3xl bg-brand-600 px-8 py-10 text-center text-white">
          <p className="text-lg font-semibold">「表扬和真人陪伴，才是坚持下去的关键。」</p>
          <p className="mt-3 text-sm leading-relaxed text-brand-50">
            Coach Eehuan 每天亲自查看每一位学员的打卡记录 —— 做得好，第一时间给你掌声；
            状态需要调整，也会给你专业、温暖的建议。这不是冰冷的打卡工具，
            而是一个持续被真人教练关注和陪伴的蜕变旅程。
          </p>
        </div>
      </section>

      <footer className="mt-auto border-t border-hairline px-6 py-6 text-center text-xs text-ink-muted">
        Coach Eehuan 蜕变陪伴系统 · 数据保存在本机浏览器（Demo 版本）
      </footer>
    </div>
  );
}
