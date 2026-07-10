export type Goal = "gain" | "loss" | "maintain";

export type ChallengeType = "day11" | "month1" | "month3";

export const CHALLENGE_DAYS: Record<ChallengeType, number> = {
  day11: 11,
  month1: 30,
  month3: 90,
};

export type SleepQuality = "poor" | "ok" | "good";

export interface Client {
  id: string;
  name: string;
  avatarEmoji: string;
  avatarColor: string;
  goal: Goal;
  startWeightKg?: number;
  targetWeightKg?: number;
  magicNumber: number; // daily calorie target
  waterGoalMl: number;
  sleepGoalHours: number;
  challengeType: ChallengeType;
  challengeStartDate: string; // ISO date (YYYY-MM-DD)
  joinedAt: string; // ISO datetime
}

export interface DailyLog {
  id: string;
  clientId: string;
  date: string; // YYYY-MM-DD
  shakePhoto?: string;
  supplementPhoto?: string;
  mealPhotos: string[];
  calories?: number;
  waterMl: number;
  sleepHours?: number;
  sleepQuality?: SleepQuality;
  note?: string;
  updatedAt: string;
}

export type FeedbackType = "praise" | "correction" | "note";

export interface Feedback {
  id: string;
  clientId: string;
  logDate: string; // YYYY-MM-DD the feedback refers to
  type: FeedbackType;
  quickTag?: string;
  message: string;
  createdAt: string;
}

export interface AppData {
  clients: Client[];
  logs: DailyLog[];
  feedback: Feedback[];
}
