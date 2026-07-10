import { AppData, Client, DailyLog, Feedback } from "./types";
import { addDays, todayISO } from "./date";
import { placeholderPhoto } from "./placeholder";
import { round1 } from "./number";

const today = todayISO();

const clients: Client[] = [
  {
    id: "seed-xiaomei",
    name: "王小美",
    avatarEmoji: "🥗",
    avatarColor: "#0E7A4A",
    goal: "loss",
    startWeightKg: 68,
    targetWeightKg: 60,
    magicNumber: 1450,
    waterGoalMl: 2000,
    sleepGoalHours: 7,
    challengeType: "month1",
    challengeStartDate: addDays(today, -9),
    joinedAt: addDays(today, -9) + "T08:00:00",
  },
  {
    id: "seed-zhiqiang",
    name: "陈志强",
    avatarEmoji: "💪",
    avatarColor: "#B4790C",
    goal: "gain",
    startWeightKg: 62,
    targetWeightKg: 70,
    magicNumber: 2800,
    waterGoalMl: 3000,
    sleepGoalHours: 8,
    challengeType: "day11",
    challengeStartDate: addDays(today, -2),
    joinedAt: addDays(today, -2) + "T08:00:00",
  },
  {
    id: "seed-jiaen",
    name: "李佳恩",
    avatarEmoji: "🌟",
    avatarColor: "#4A3AA7",
    goal: "maintain",
    startWeightKg: 55,
    targetWeightKg: 55,
    magicNumber: 1800,
    waterGoalMl: 2200,
    sleepGoalHours: 7.5,
    challengeType: "month3",
    challengeStartDate: addDays(today, -40),
    joinedAt: addDays(today, -40) + "T08:00:00",
  },
];

const shakePhoto = (c: string) => placeholderPhoto("🥤", c);
const suppPhoto = (c: string) => placeholderPhoto("💊", c);
const mealPhoto = (c: string) => placeholderPhoto("🍽️", c);

const logs: DailyLog[] = [];
const feedback: Feedback[] = [];

function pushLog(l: DailyLog) {
  logs.push(l);
}
function pushFeedback(f: Omit<Feedback, "id" | "createdAt"> & { createdAt?: string }) {
  feedback.push({
    id: `fb-${feedback.length + 1}`,
    createdAt: f.createdAt ?? today + "T20:00:00",
    ...f,
  });
}

// 王小美 — 9 天连续打卡，表现优秀
for (let i = 9; i >= 1; i--) {
  const date = addDays(today, -i);
  pushLog({
    id: `xm-${date}`,
    clientId: "seed-xiaomei",
    date,
    shakePhoto: shakePhoto("#DFF3E6"),
    supplementPhoto: suppPhoto("#FBEFD9"),
    mealPhotos: [mealPhoto("#FDEFEA"), mealPhoto("#EAF1FD")],
    calories: 1400 + (i % 3) * 20,
    waterMl: 1900 + (i % 4) * 60,
    sleepHours: round1(6.8 + (i % 3) * 0.3),
    sleepQuality: i % 4 === 0 ? "ok" : "good",
    updatedAt: date + "T21:00:00",
  });
}
pushFeedback({
  clientId: "seed-xiaomei",
  logDate: addDays(today, -1),
  type: "praise",
  quickTag: "👏 太棒了",
  message: "小美这周状态很稳定，奶昔和三餐都拍得很认真，体重曲线很漂亮，继续保持！",
  createdAt: addDays(today, -1) + "T21:10:00",
});
pushFeedback({
  clientId: "seed-xiaomei",
  logDate: addDays(today, -4),
  type: "note",
  quickTag: "💬 备注",
  message: "睡眠时间比较晚，尽量11点前入睡，代谢会更好哦。",
  createdAt: addDays(today, -4) + "T09:00:00",
});

// 陈志强 — 增重挑战第 3 天，昨天喝水不够
for (let i = 2; i >= 1; i--) {
  const date = addDays(today, -i);
  pushLog({
    id: `zq-${date}`,
    clientId: "seed-zhiqiang",
    date,
    shakePhoto: shakePhoto("#FBEFD9"),
    supplementPhoto: suppPhoto("#FBEFD9"),
    mealPhotos: [mealPhoto("#FDEFEA")],
    calories: i === 1 ? 2300 : 2750,
    waterMl: i === 1 ? 1500 : 2900,
    sleepHours: i === 1 ? 5.5 : 7.5,
    sleepQuality: i === 1 ? "poor" : "good",
    updatedAt: date + "T22:00:00",
  });
}
pushFeedback({
  clientId: "seed-zhiqiang",
  logDate: addDays(today, -1),
  type: "correction",
  quickTag: "🔧 需要调整",
  message: "昨天热量和饮水都没达标，晚餐可以加多一份碳水，睡前记得把水分补够，今天加油！",
  createdAt: addDays(today, -1) + "T22:15:00",
});
pushFeedback({
  clientId: "seed-zhiqiang",
  logDate: addDays(today, -2),
  type: "praise",
  quickTag: "👏 太棒了",
  message: "第一天打卡就全部达标，气势很好，照这个节奏11天挑战没问题！",
  createdAt: addDays(today, -2) + "T21:00:00",
});

// 李佳恩 — 3个月挑战进行中，长期稳定
for (let i = 6; i >= 1; i--) {
  const date = addDays(today, -i);
  pushLog({
    id: `je-${date}`,
    clientId: "seed-jiaen",
    date,
    shakePhoto: shakePhoto("#EDE9FB"),
    supplementPhoto: suppPhoto("#EDE9FB"),
    mealPhotos: [mealPhoto("#FDEFEA"), mealPhoto("#EAF1FD")],
    calories: 1780 + (i % 2) * 30,
    waterMl: 2150 + (i % 3) * 40,
    sleepHours: round1(7.2 + (i % 2) * 0.4),
    sleepQuality: "good",
    updatedAt: date + "T20:30:00",
  });
}
pushFeedback({
  clientId: "seed-jiaen",
  logDate: addDays(today, -1),
  type: "praise",
  quickTag: "🌟 里程碑",
  message: "佳恩已经坚持第40天了，是我们小组的榜样！体态维持得非常好，继续稳稳走下去。",
  createdAt: addDays(today, -1) + "T20:40:00",
});

export function buildSeedData(): AppData {
  return { clients, logs, feedback };
}
