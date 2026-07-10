import React from "react";
import { View } from "react-native";
import { useI18n } from "@/lib/i18n";
import { Feedback } from "@/lib/types";
import { AppText } from "./ui/AppText";

const TYPE_STYLE: Record<Feedback["type"], { bg: string; icon: string }> = {
  praise: { bg: "bg-gold-100/60 dark:bg-gold-700/20", icon: "👏" },
  correction: { bg: "bg-[rgba(208,59,59,0.06)]", icon: "🔧" },
  note: { bg: "bg-surface dark:bg-surface-dark", icon: "💬" },
};

export function FeedbackThread({ items }: { items: Feedback[] }) {
  const { t, formatShortDate } = useI18n();

  if (items.length === 0) {
    return (
      <View className="rounded-2xl border border-dashed border-hairline p-6 dark:border-hairline-dark">
        <AppText variant="caption" className="text-center text-ink-muted">
          {t.today.feedbackEmpty}
        </AppText>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {items.map((f) => {
        const style = TYPE_STYLE[f.type];
        return (
          <View key={f.id} className={`rounded-2xl border border-hairline p-4 dark:border-hairline-dark ${style.bg}`}>
            <View className="flex-row items-center justify-between">
              <AppText variant="bodyMedium">
                {style.icon} Coach Eehuan
              </AppText>
              <AppText variant="caption" className="text-ink-muted">
                {formatShortDate(f.logDate)}
              </AppText>
            </View>
            <AppText variant="body" className="mt-1.5 text-ink-secondary">
              {f.message}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}
