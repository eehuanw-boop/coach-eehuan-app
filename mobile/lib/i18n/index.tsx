import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { en, Dictionary } from "./en";
import { zh } from "./zh";
import { dayOfMonth, monthIndex, weekdayIndex } from "../date";

export type Locale = "en" | "zh";

const DICTIONARIES: Record<Locale, Dictionary> = { en, zh };
const STORAGE_KEY = "coach-eehuan:locale:v1";

const EN_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const EN_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const ZH_WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

interface I18nContextValue {
  locale: Locale;
  t: Dictionary;
  setLocale: (l: Locale) => void;
  formatShortDate: (iso: string) => string;
  formatWeekday: (iso: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === "en" || saved === "zh") setLocaleState(saved);
    });
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    AsyncStorage.setItem(STORAGE_KEY, l).catch(() => {});
  }

  const value = useMemo<I18nContextValue>(() => {
    const t = DICTIONARIES[locale];
    return {
      locale,
      t,
      setLocale,
      formatShortDate: (iso: string) =>
        locale === "en"
          ? `${EN_MONTHS[monthIndex(iso)]} ${dayOfMonth(iso)}`
          : `${monthIndex(iso) + 1}月${dayOfMonth(iso)}日`,
      formatWeekday: (iso: string) =>
        locale === "en" ? EN_WEEKDAYS[weekdayIndex(iso)] : ZH_WEEKDAYS[weekdayIndex(iso)],
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
