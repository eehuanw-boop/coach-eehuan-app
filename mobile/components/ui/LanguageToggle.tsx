import React from "react";
import { Pressable, View } from "react-native";
import { useI18n, Locale } from "@/lib/i18n";
import { AppText } from "./AppText";

const OPTIONS: { locale: Locale; label: string }[] = [
  { locale: "en", label: "EN" },
  { locale: "zh", label: "中" },
];

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  return (
    <View className={`flex-row items-center rounded-full border border-hairline p-0.5 ${className}`}>
      {OPTIONS.map((opt) => {
        const active = opt.locale === locale;
        return (
          <Pressable
            key={opt.locale}
            onPress={() => setLocale(opt.locale)}
            className={`px-3 py-1.5 rounded-full ${active ? "bg-brand-600" : ""}`}
            hitSlop={4}
          >
            <AppText variant="label" className={active ? "text-paper" : "text-ink-secondary"}>
              {opt.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
