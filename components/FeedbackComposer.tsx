"use client";

import { useState } from "react";
import { FeedbackType } from "@/lib/types";

const QUICK_TAGS: { tag: string; type: FeedbackType; message: string }[] = [
  { tag: "👏 太棒了", type: "praise", message: "今天完成得非常好，继续保持这个状态！" },
  { tag: "💪 继续保持", type: "praise", message: "状态很稳定，照这个节奏走下去。" },
  { tag: "🔧 需要调整", type: "correction", message: "今天有几项没达标，我们一起看看怎么调整。" },
  { tag: "⚠️ 请注意", type: "correction", message: "记得按时打卡，规律作息很重要哦。" },
];

export function FeedbackComposer({
  onSubmit,
}: {
  onSubmit: (payload: { type: FeedbackType; quickTag?: string; message: string }) => void;
}) {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<FeedbackType>("praise");
  const [quickTag, setQuickTag] = useState<string | undefined>(undefined);

  function applyQuickTag(q: (typeof QUICK_TAGS)[number]) {
    setType(q.type);
    setQuickTag(q.tag);
    setMessage(q.message);
  }

  function handleSubmit() {
    if (!message.trim()) return;
    onSubmit({ type, quickTag, message: message.trim() });
    setMessage("");
    setQuickTag(undefined);
  }

  return (
    <div className="rounded-2xl border border-hairline bg-surface p-4">
      <p className="text-sm font-semibold text-ink-primary">给这一天留言</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {QUICK_TAGS.map((q) => (
          <button
            key={q.tag}
            type="button"
            onClick={() => applyQuickTag(q)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              quickTag === q.tag
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-hairline text-ink-secondary hover:border-brand-300"
            }`}
          >
            {q.tag}
          </button>
        ))}
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="写下表扬或专业建议…"
        rows={3}
        className="mt-3 w-full resize-none rounded-xl border border-hairline bg-surface-page px-3.5 py-2.5 text-sm outline-none focus:border-brand-400"
      />
      <div className="mt-2.5 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!message.trim()}
          className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-40"
        >
          发送点评
        </button>
      </div>
    </div>
  );
}
