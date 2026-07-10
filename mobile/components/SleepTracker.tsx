import React from "react";
import { Pressable, View } from "react-native";
import { useI18n } from "@/lib/i18n";
import { round1 } from "@/lib/number";
import { SleepQuality } from "@/lib/types";
import { AppText } from "./ui/AppText";

const QUALITIES: SleepQuality[] = ["poor", "ok", "good"];

export function SleepTracker({
  hours,
  quality,
  goalHours,
  onHoursChange,
  onQualityChange,
}: {
  hours?: number;
  quality?: SleepQuality;
  goalHours: number;
  onHoursChange: (hours: number) => void;
  onQualityChange: (q: SleepQuality) => void;
}) {
  const { t } = useI18n();

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <AppText variant="bodyMedium">😴 {t.today.sleepTitle}</AppText>
        <AppText variant="caption" className="text-ink-secondary">
          {t.today.sleepGoal(goalHours)}
        </AppText>
      </View>
      <View className="mt-4 flex-row items-center gap-4">
        <Pressable
          onPress={() => onHoursChange(round1(Math.max(0, (hours ?? goalHours) - 0.5)))}
          accessibilityLabel="Remove half an hour"
          className="h-10 w-10 items-center justify-center rounded-full border border-hairline dark:border-hairline-dark"
        >
          <AppText variant="body" className="text-ink-secondary">−</AppText>
        </Pressable>
        <View className="flex-1 items-center">
          <AppText variant="headline">{hours != null ? hours : "–"}</AppText>
          <AppText variant="caption" className="text-ink-muted">
            {t.common.hours}
          </AppText>
        </View>
        <Pressable
          onPress={() => onHoursChange(round1((hours ?? goalHours - 0.5) + 0.5))}
          accessibilityLabel="Add half an hour"
          className="h-10 w-10 items-center justify-center rounded-full bg-[#4A3AA7]"
        >
          <AppText variant="body" className="text-paper">+</AppText>
        </Pressable>
      </View>
      <View className="mt-4 flex-row gap-2">
        {QUALITIES.map((q) => {
          const active = quality === q;
          return (
            <Pressable
              key={q}
              onPress={() => onQualityChange(q)}
              className={`flex-1 items-center rounded-xl border py-2.5 ${
                active ? "border-[#4A3AA7] bg-[#4A3AA7]/10" : "border-hairline dark:border-hairline-dark"
              }`}
            >
              <AppText variant="caption" className={active ? "text-[#4A3AA7]" : "text-ink-secondary"}>
                {t.sleepQuality[q]}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
