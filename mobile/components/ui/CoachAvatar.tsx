import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";

const SIZES = { sm: 40, md: 64, lg: 112, xl: 176 } as const;
const MONOGRAM_SCALE = 0.36;
const BADGE_SCALE = 0.14;

export function CoachAvatar({ size = "md" }: { size?: keyof typeof SIZES }) {
  const px = SIZES[size];
  const badgeSize = Math.round(px * BADGE_SCALE * 2);

  return (
    <View style={{ width: px, height: px }}>
      <Svg width={px} height={px} viewBox="0 0 112 112" style={{ position: "absolute" }}>
        <Defs>
          <LinearGradient id="coachGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#2C6B49" />
            <Stop offset="100%" stopColor="#17452C" />
          </LinearGradient>
        </Defs>
        <Circle cx={56} cy={56} r={52} fill="url(#coachGrad)" />
        <Circle cx={56} cy={56} r={52} fill="none" stroke="#B8873B" strokeWidth={2.5} />
        <Path
          d="M20 78 C 34 58, 44 50, 56 50 C 68 50, 78 58, 92 78"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity={0.12}
          strokeWidth={14}
          strokeLinecap="round"
        />
      </Svg>
      <View className="items-center justify-center" style={{ width: px, height: px }}>
        <Text style={{ fontSize: px * MONOGRAM_SCALE, color: "#F7F5EF", fontWeight: "600" }}>E</Text>
      </View>
      <View
        className="absolute items-center justify-center rounded-full bg-gold-500"
        style={{
          width: badgeSize,
          height: badgeSize,
          right: px * 0.06,
          bottom: px * 0.06,
          borderWidth: 2,
          borderColor: "#F7F5EF",
        }}
      >
        <Text style={{ fontSize: badgeSize * 0.55 }}>🌿</Text>
      </View>
    </View>
  );
}
