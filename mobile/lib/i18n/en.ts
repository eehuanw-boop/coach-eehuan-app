import { ChallengeType, Goal, SleepQuality } from "../types";
import { DayStatus } from "../stats";

export const en = {
  common: {
    continue: "Continue",
    save: "Save",
    cancel: "Cancel",
    done: "Done",
    kcal: "kcal",
    hours: "hrs",
    optional: "Optional",
    day: (n: number) => (n === 1 ? "1 day" : `${n} days`),
  },
  status: {
    good: "On track",
    warning: "Close to target",
    critical: "Needs attention",
    missing: "Not logged",
  } satisfies Record<DayStatus, string>,
  goal: {
    loss: "Fat loss",
    gain: "Lean gain",
    maintain: "Maintain",
  } satisfies Record<Goal, string>,
  goalHint: {
    loss: "Calorie deficit, steady fat loss",
    gain: "Calorie surplus, build lean mass",
    maintain: "Hold your current shape & rhythm",
  } satisfies Record<Goal, string>,
  sleepQuality: {
    poor: "Poor",
    ok: "Fair",
    good: "Great",
  } satisfies Record<SleepQuality, string>,
  challenge: {
    day11: "11-Day Jumpstart",
    month1: "1-Month Transformation",
    month3: "3-Month Transformation",
  } satisfies Record<ChallengeType, string>,
  challengeHint: {
    day11: "Build the daily habit and feel the first shift.",
    month1: "A full month of steady nutrition and rhythm.",
    month3: "Long-term coaching — make it a way of life.",
  } satisfies Record<ChallengeType, string>,

  tabs: {
    today: "Today",
    history: "History",
    profile: "Profile",
  },

  welcome: {
    eyebrow: "Coach Eehuan",
    title: "A coaching companion,\nnot another tracker.",
    subtitle:
      "Photograph your shake, your supplements, and your meals each day. Hit your personal number. Log your water and your sleep. And have a real coach actually watching — ready to cheer you on, or gently correct course.",
    ctaPrimary: "Begin your transformation",
    ctaContinue: "Continue my check-in",
    ctaDemo: "Preview a sample day",
    featuresTitle: "What's inside",
    features: [
      { icon: "📸", title: "Daily proof", desc: "Shake, supplements, and every meal — one photo at a time." },
      { icon: "🎯", title: "Your magic number", desc: "A calorie target tuned to your goal, tracked in real time." },
      { icon: "💧", title: "Water & sleep", desc: "The quiet habits that decide whether the rest works." },
      { icon: "💬", title: "A real coach", desc: "Eehuan reviews your day and responds — in person, not by algorithm." },
    ],
    programsTitle: "Choose your program",
    quote: "“Praise and real human coaching are what make people stay.”",
    quoteBody:
      "Coach Eehuan reviews every check-in personally — a win gets celebrated immediately, and a rough day gets a thoughtful nudge. Not a cold tracker. A coach who is actually paying attention.",
    footer: "Coach Eehuan — data stored on this device (demo build)",
  },

  onboarding: {
    title: "Set up your check-in",
    subtitle: "A few details so Coach Eehuan can follow your nutrition and rhythm from day one.",
    nameLabel: "Your name",
    namePlaceholder: "e.g. Alex Chen",
    goalLabel: "Your goal",
    weightLabel: "Current weight",
    targetWeightLabel: "Target weight",
    weightUnit: "kg",
    magicNumberLabel: "Daily magic number",
    magicNumberPlaceholder: "e.g. 1450",
    magicNumberHelper: "Not sure? Ask Coach Eehuan to calculate it with you.",
    magicNumberSuggestion: (n: number) => `Estimated from your weight: ${n} kcal — tap to use`,
    waterGoalLabel: "Daily water goal",
    sleepGoalLabel: "Daily sleep goal",
    challengeLabel: "Choose your program",
    startDateLabel: "Start date",
    submit: "Start checking in",
    errorName: "Please enter your name",
    errorMagicNumber: "Please enter your daily magic number",
  },

  today: {
    greeting: (name: string) => `Hello, ${name}`,
    subtitle: "Take good care of yourself today.",
    streak: (n: number) => `${n}-day streak`,
    dayOf: (day: number, total: number) => `Day ${day} of ${total}`,
    daysRemaining: (n: number) => `${n} days to go`,
    challengeComplete: "Challenge complete 🎉",
    magicNumberTitle: "Today's magic number",
    magicNumberSubtitle: (target: number) => `Log today's total intake — aim close to ${target} kcal.`,
    magicNumberPlaceholder: "Enter today's calories",
    photosTitle: "Today's check-in",
    shake: "Shake",
    supplements: "Supplements",
    meals: "Meals",
    addMeal: "Add a meal",
    tapToCapture: "Tap to capture",
    retake: "Retake",
    waterTitle: "Water",
    waterStep: (ml: number) => `+${ml}ml per tap`,
    sleepTitle: "Sleep",
    sleepGoal: (h: number) => `Goal ${h}h`,
    feedbackTitle: "From Coach Eehuan",
    feedbackEmpty: "No notes yet — keep checking in and Coach Eehuan will be by soon.",
  },

  history: {
    title: "Your check-in history",
    subtitle: (date: string) => `Program started ${date}`,
    emptyDay: "Nothing logged this day.",
    calories: "Calories",
    water: "Water",
    sleep: "Sleep",
    coachNotes: "Coach notes",
  },

  profile: {
    title: "Profile",
    language: "Language",
    yourPlan: "Your plan",
    goalRow: "Goal",
    magicNumberRow: "Magic number",
    waterRow: "Water goal",
    sleepRow: "Sleep goal",
    programRow: "Program",
    startOver: "Start over",
    startOverConfirm: "This clears your local check-in data on this device. Continue?",
  },
};

export type Dictionary = typeof en;
