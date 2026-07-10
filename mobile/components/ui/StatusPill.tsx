import React from "react";
import { View } from "react-native";
import { DayStatus } from "@/lib/stats";
import { useI18n } from "@/lib/i18n";
import { AppText } from "./AppText";
import { StatusDot } from "./StatusDot";

const BG: Record<DayStatus, string> = {
  good: "rgba(12,163,12,0.10)",
  warning: "rgba(250,178,25,0.14)",
  critical: "rgba(208,59,59,0.10)",
  missing: "rgba(155,151,138,0.14)",
};

export function StatusPill({ status, className = "" }: { status: DayStatus; className?: string }) {
  const { t } = useI18n();
  return (
    <View
      className={`flex-row items-center gap-1.5 self-start rounded-full px-2.5 py-1 ${className}`}
      style={{ backgroundColor: BG[status] }}
    >
      <StatusDot status={status} size={6} />
      <AppText variant="caption" className="text-ink-secondary">
        {t.status[status]}
      </AppText>
    </View>
  );
}
