import React from "react";
import { View } from "react-native";
import { DayStatus } from "@/lib/stats";

const COLOR: Record<DayStatus, string> = {
  good: "#0CA30C",
  warning: "#FAB219",
  critical: "#D03B3B",
  missing: "#9B978A",
};

export function StatusDot({ status, size = 8 }: { status: DayStatus; size?: number }) {
  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: COLOR[status] }}
    />
  );
}
