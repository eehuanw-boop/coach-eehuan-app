import React from "react";
import { Text, TextProps } from "react-native";
import { useI18n } from "@/lib/i18n";

type Variant = "display" | "headline" | "title" | "body" | "bodyMedium" | "label" | "caption";

const VARIANT_STYLES: Record<Variant, { en: string; zh: string }> = {
  display: {
    en: "font-serif-semibold text-[40px] leading-[46px] tracking-tightest",
    zh: "font-sans-bold text-[32px] leading-[42px]",
  },
  headline: {
    en: "font-serif-semibold text-[26px] leading-[32px] tracking-tightest",
    zh: "font-sans-semibold text-[23px] leading-[30px]",
  },
  title: {
    en: "font-sans-semibold text-[17px] leading-[23px]",
    zh: "font-sans-semibold text-[17px] leading-[25px]",
  },
  body: {
    en: "font-sans text-[15px] leading-[22px]",
    zh: "text-[15px] leading-[24px]",
  },
  bodyMedium: {
    en: "font-sans-medium text-[15px] leading-[22px]",
    zh: "text-[15px] leading-[24px] font-medium",
  },
  label: {
    en: "font-sans-semibold text-[11px] leading-[14px] tracking-widest uppercase",
    zh: "text-[12px] leading-[16px] font-semibold",
  },
  caption: {
    en: "font-sans text-[12.5px] leading-[18px]",
    zh: "text-[12.5px] leading-[20px]",
  },
};

interface AppTextProps extends TextProps {
  variant?: Variant;
  className?: string;
}

export function AppText({ variant = "body", className = "", style, ...props }: AppTextProps) {
  const { locale } = useI18n();
  const variantClass = VARIANT_STYLES[variant][locale];
  return <Text className={`text-ink dark:text-ink-inverted ${variantClass} ${className}`} style={style} {...props} />;
}
