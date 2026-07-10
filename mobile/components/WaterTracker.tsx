import React from "react";
import { Pressable, View } from "react-native";
import { useI18n } from "@/lib/i18n";
import { AppText } from "./ui/AppText";

const STEP = 250;

export function WaterTracker({
  waterMl,
  goalMl,
  onChange,
}: {
  waterMl: number;
  goalMl: number;
  onChange: (nextMl: number) => void;
}) {
  const { t } = useI18n();
  const percent = Math.min(100, Math.round((waterMl / goalMl) * 100));

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <AppText variant="bodyMedium">💧 {t.today.waterTitle}</AppText>
        <AppText variant="caption" className="text-ink-secondary">
          {(waterMl / 1000).toFixed(2)} / {(goalMl / 1000).toFixed(1)} L
        </AppText>
      </View>
      <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-brand-50 dark:bg-hairline-dark">
        <View className="h-full rounded-full bg-brand-500" style={{ width: `${percent}%` }} />
      </View>
      <View className="mt-4 flex-row items-center justify-center gap-5">
        <Pressable
          onPress={() => onChange(Math.max(0, waterMl - STEP))}
          accessibilityLabel="Remove 250ml"
          className="h-10 w-10 items-center justify-center rounded-full border border-hairline dark:border-hairline-dark"
        >
          <AppText variant="body" className="text-ink-secondary">−</AppText>
        </Pressable>
        <AppText variant="caption" className="text-ink-muted">
          {t.today.waterStep(STEP)}
        </AppText>
        <Pressable
          onPress={() => onChange(waterMl + STEP)}
          accessibilityLabel="Add 250ml"
          className="h-10 w-10 items-center justify-center rounded-full bg-brand-600"
        >
          <AppText variant="body" className="text-paper">+</AppText>
        </Pressable>
      </View>
    </View>
  );
}
