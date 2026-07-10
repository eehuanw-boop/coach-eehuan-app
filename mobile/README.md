# Coach Eehuan — mobile (Expo)

The client-facing check-in app: daily shake / supplements / meal photos, the "magic
number" calorie target, water and sleep tracking, challenge progress, and Coach Eehuan's
feedback — as a real mobile app (camera access, native feel), bilingual EN/中文.

The coach-facing "auditor" backend stays on the Next.js web app in the repo root; this
app covers the learner side only.

## Design

Editorial-minimal visual language (generous whitespace, restrained warm-neutral palette,
Fraunces serif for English display type, system fonts for Chinese to avoid font-fallback
issues) — see `tailwind.config.js` for the full token set. Language toggle lives in the
Welcome and Profile screens and persists on-device.

## Data

Same shape as the web app's local store, but backed by `AsyncStorage` instead of
`localStorage` (see `lib/store.ts`, `lib/session.ts` — both hydrate once from the root
layout since `AsyncStorage` is async). A demo client with ~9 days of seed history is
available from the Welcome screen ("Preview a sample day") for quick evaluation. This is
a demo build — no backend yet; `lib/store.ts` is the seam to swap in a real API later.

## Develop

```bash
npm install
npx expo start --web   # browser preview — no simulator needed
npx expo start         # then press i / a for iOS / Android simulator, if available
```

```bash
npx tsc --noEmit   # typecheck
npx expo lint      # lint
```

`nativewind` is pinned to `4.1.23` (not `^4.x`) — 4.2.x pulls a `react-native-css-interop`
that requires `react-native-worklets`, which needs RN ≥0.83 and breaks bundling on this
project's RN 0.79 / Reanimated 3.x. Bump both together if you upgrade Reanimated to v4.
