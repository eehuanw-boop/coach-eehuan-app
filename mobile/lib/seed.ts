import { AppData, Client, DailyLog, Feedback } from "./types";
import { addDays, todayISO } from "./date";
import { makePlaceholder } from "./photo";
import { round1 } from "./number";

const today = todayISO();

const demoClient: Client = {
  id: "seed-demo",
  name: "Alex Chen",
  avatarEmoji: "🥗",
  avatarColor: "#1F5738",
  goal: "loss",
  startWeightKg: 68,
  targetWeightKg: 60,
  magicNumber: 1450,
  waterGoalMl: 2000,
  sleepGoalHours: 7,
  challengeType: "month1",
  challengeStartDate: addDays(today, -9),
  joinedAt: addDays(today, -9) + "T08:00:00",
};

const shakePhoto = () => makePlaceholder("🥤", "#EAF1EC");
const suppPhoto = () => makePlaceholder("💊", "#F3E6C9");
const mealPhoto = () => makePlaceholder("🍽️", "#F3EDE4");

const logs: DailyLog[] = [];
const feedback: Feedback[] = [];

for (let i = 9; i >= 1; i--) {
  const date = addDays(today, -i);
  logs.push({
    id: `demo-${date}`,
    clientId: demoClient.id,
    date,
    shakePhoto: shakePhoto(),
    supplementPhoto: suppPhoto(),
    mealPhotos: [mealPhoto(), mealPhoto()],
    calories: 1400 + (i % 3) * 20,
    waterMl: 1900 + (i % 4) * 60,
    sleepHours: round1(6.8 + (i % 3) * 0.3),
    sleepQuality: i % 4 === 0 ? "ok" : "good",
    updatedAt: date + "T21:00:00",
  });
}

feedback.push(
  {
    id: "fb-1",
    clientId: demoClient.id,
    logDate: addDays(today, -1),
    type: "praise",
    quickTag: "👏",
    message: "Really steady week — your shake and meal photos have been consistent and your trend line looks great. Keep this rhythm going!",
    createdAt: addDays(today, -1) + "T21:10:00",
  },
  {
    id: "fb-2",
    clientId: demoClient.id,
    logDate: addDays(today, -4),
    type: "note",
    quickTag: "💬",
    message: "Your bedtime has crept later this week — try to be lights-out by 11pm, it'll help your metabolism.",
    createdAt: addDays(today, -4) + "T09:00:00",
  }
);

export function buildSeedData(): AppData {
  return { clients: [demoClient], logs, feedback };
}
