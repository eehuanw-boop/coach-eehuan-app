import { Feedback } from "@/lib/types";
import { formatDateLabel } from "@/lib/date";

const TYPE_STYLE: Record<Feedback["type"], { bg: string; ring: string; icon: string }> = {
  praise: { bg: "bg-gold-50", ring: "border-gold-200", icon: "👏" },
  correction: { bg: "bg-[rgba(208,59,59,0.06)]", ring: "border-[rgba(208,59,59,0.25)]", icon: "🔧" },
  note: { bg: "bg-surface", ring: "border-hairline", icon: "💬" },
};

export function FeedbackThread({ items, emptyHint }: { items: Feedback[]; emptyHint?: string }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline p-6 text-center text-sm text-ink-muted">
        {emptyHint ?? "还没有教练点评，坚持打卡，Coach Eehuan 很快会来看你！"}
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((f) => {
        const style = TYPE_STYLE[f.type];
        return (
          <li key={f.id} className={`rounded-2xl border p-4 ${style.bg} ${style.ring}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-ink-primary">
                <span>{style.icon}</span>
                Coach Eehuan
                {f.quickTag && <span className="text-xs font-normal text-ink-secondary">· {f.quickTag}</span>}
              </span>
              <span className="text-xs text-ink-muted">{formatDateLabel(f.logDate)}</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">{f.message}</p>
          </li>
        );
      })}
    </ul>
  );
}
