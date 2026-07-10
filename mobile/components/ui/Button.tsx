import React from "react";
import { Pressable, PressableProps } from "react-native";
import { AppText } from "./AppText";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends PressableProps {
  label: string;
  variant?: Variant;
  className?: string;
}

const CONTAINER: Record<Variant, string> = {
  primary: "bg-brand-600 active:bg-brand-700",
  secondary: "bg-transparent border border-hairline active:border-brand-300 dark:border-hairline-dark",
  ghost: "bg-transparent",
};

const LABEL_COLOR: Record<Variant, string> = {
  primary: "text-paper",
  secondary: "text-ink dark:text-ink-inverted",
  ghost: "text-ink dark:text-ink-inverted",
};

export function Button({ label, variant = "primary", className = "", ...props }: ButtonProps) {
  const padding = variant === "ghost" ? "px-1 py-2" : "px-7 py-4";
  const shape = variant === "ghost" ? "" : "rounded-full items-center";
  return (
    <Pressable className={`${CONTAINER[variant]} ${padding} ${shape} ${className}`} {...props}>
      <AppText variant="bodyMedium" className={`${LABEL_COLOR[variant]} text-center`}>
        {label}
      </AppText>
    </Pressable>
  );
}
