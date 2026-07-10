import React from "react";
import { View } from "react-native";
import { useI18n } from "@/lib/i18n";
import { ChallengeType } from "@/lib/types";
import { ChallengeProgress } from "@/lib/stats";
import { AppText } from "./ui/AppText";

export function ChallengeProgressBar({
  challengeType,
  progress,
  streak,
}: {
  challengeType: ChallengeType;
  progress: ChallengeProgress;
  streak: number;
}) {
  const { t } = useI18n();

  return (
    <View>
      <View className="flex-row items-end justify-between">
        <View>
          <AppText variant="label" className="text-gold-700 dark:text-gold-300">
            {t.challenge[challengeType]}
          </AppText>
          <AppText variant="bodyMedium" className="mt-1">
            {t.today.dayOf(progress.dayNumber, progress.totalDays)}
          </AppText>
        </View>
        <View className="rounded-full bg-gold-100 px-3 py-1.5 dark:bg-gold-700/30">
          <AppText variant="caption" className="text-gold-700 dark:text-gold-300">
            🔥 {t.today.streak(streak)}
          </AppText>
        </View>
      </View>
      <View className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-brand-50 dark:bg-hairline-dark">
        <View className="h-full rounded-full bg-brand-500" style={{ width: `${progress.percent}%` }} />
      </View>
      <AppText variant="caption" className="mt-1.5 text-right text-ink-muted">
        {progress.isComplete ? t.today.challengeComplete : t.today.daysRemaining(progress.daysRemaining)}
      </AppText>
    </View>
  );
}
