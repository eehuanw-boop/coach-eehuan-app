import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

export function ProgressRing({
  percent,
  color,
  trackColor = "#E4E1D6",
  size = 128,
  strokeWidth = 10,
  children,
}: {
  percent: number;
  color: string;
  trackColor?: string;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = c - (clamped / 100) * c;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size} style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={offset}
        />
      </Svg>
      <View className="items-center justify-center">{children}</View>
    </View>
  );
}
