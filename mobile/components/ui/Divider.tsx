import React from "react";
import { View } from "react-native";

export function Divider({ className = "" }: { className?: string }) {
  return <View className={`h-px bg-hairline dark:bg-hairline-dark ${className}`} />;
}
