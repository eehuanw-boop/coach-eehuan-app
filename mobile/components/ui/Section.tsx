import React from "react";
import { View } from "react-native";
import { AppText } from "./AppText";

export function Section({
  title,
  eyebrow,
  right,
  children,
  className = "",
}: {
  title?: string;
  eyebrow?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View className={`mt-10 ${className}`}>
      {(title || eyebrow) && (
        <View className="mb-4 flex-row items-end justify-between">
          <View>
            {eyebrow && (
              <AppText variant="label" className="mb-1 text-ink-muted">
                {eyebrow}
              </AppText>
            )}
            {title && <AppText variant="title">{title}</AppText>}
          </View>
          {right}
        </View>
      )}
      {children}
    </View>
  );
}
