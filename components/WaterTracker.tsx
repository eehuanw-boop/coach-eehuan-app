const STEP = 250;

export function WaterTracker({
  waterMl,
  goalMl,
  onChange,
}: {
  waterMl: number;
  goalMl: number;
  onChange: (nextMl: number) => void;
}) {
  const percent = Math.min(100, Math.round((waterMl / goalMl) * 100));

  return (
    <div className="rounded-2xl border border-hairline bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">💧</span>
          <span className="font-semibold text-ink-primary">今日饮水</span>
        </div>
        <span className="text-sm text-ink-secondary">
          {(waterMl / 1000).toFixed(2)} / {(goalMl / 1000).toFixed(1)} L
        </span>
      </div>
      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-brand-50">
        <div
          className="h-full rounded-full bg-[var(--color-series-1)] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, waterMl - STEP))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-lg text-ink-secondary transition hover:border-brand-300"
          aria-label="减少250毫升"
        >
          −
        </button>
        <span className="w-20 text-center text-sm text-ink-muted">每次 {STEP}ml</span>
        <button
          type="button"
          onClick={() => onChange(waterMl + STEP)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-series-1)] text-lg text-white transition hover:opacity-90"
          aria-label="增加250毫升"
        >
          +
        </button>
      </div>
    </div>
  );
}
