import { DayStatus } from "@/lib/stats";

const CONFIG: Record<DayStatus, { label: string; icon: string; color: string; bg: string }> = {
  good: { label: "达标", icon: "✓", color: "var(--color-status-good)", bg: "rgba(12,163,12,0.12)" },
  warning: {
    label: "接近目标",
    icon: "!",
    color: "var(--color-status-warning)",
    bg: "rgba(250,178,25,0.16)",
  },
  critical: {
    label: "需要关注",
    icon: "!",
    color: "var(--color-status-critical)",
    bg: "rgba(208,59,59,0.12)",
  },
  missing: { label: "未打卡", icon: "○", color: "var(--color-ink-muted)", bg: "rgba(137,135,129,0.14)" },
};

export function StatusBadge({ status, className = "" }: { status: DayStatus; className?: string }) {
  const c = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
      style={{ color: c.color, background: c.bg }}
    >
      <span aria-hidden>{c.icon}</span>
      {c.label}
    </span>
  );
}

export function StatusDot({ status }: { status: DayStatus }) {
  const c = CONFIG[status];
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-full"
      style={{ background: c.color }}
      title={c.label}
      aria-label={c.label}
    />
  );
}
