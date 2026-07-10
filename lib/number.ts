/** Rounds to 1 decimal place, avoiding binary floating-point artifacts like 6.8 + 0.4 = 7.199999999999999. */
export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
