export function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-4">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-ink-primary">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-ink-secondary">{hint}</p>}
    </div>
  );
}
