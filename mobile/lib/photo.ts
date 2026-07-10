/**
 * React Native's <Image> can't rasterize SVG data URIs the way a browser can, so seed/demo
 * "photos" are encoded as a small marker string instead of an actual image and rendered by a
 * dedicated placeholder view. Anything else is treated as a real captured photo (data: URI).
 */
const PREFIX = "placeholder:";

export function makePlaceholder(emoji: string, bg: string): string {
  return `${PREFIX}${emoji}:${bg}`;
}

export interface ParsedPlaceholder {
  emoji: string;
  bg: string;
}

export function parsePlaceholder(value: string): ParsedPlaceholder | null {
  if (!value.startsWith(PREFIX)) return null;
  const [, emoji, bg] = value.split(":");
  return { emoji: emoji ?? "🥤", bg: bg ?? "#EAF1EC" };
}

export function isPlaceholder(value: string): boolean {
  return value.startsWith(PREFIX);
}
