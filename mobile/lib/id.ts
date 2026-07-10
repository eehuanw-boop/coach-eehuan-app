/** Locally-unique id — good enough for on-device demo data, no crypto/native deps needed. */
export function newId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${rand}`;
}
