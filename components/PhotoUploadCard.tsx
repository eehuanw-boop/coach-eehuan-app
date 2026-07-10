"use client";

import { useRef } from "react";

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function PhotoUploadCard({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: string;
  value?: string;
  onChange: (dataUrl: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readAsDataURL(file);
    onChange(dataUrl);
    e.target.value = "";
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="group relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-hairline bg-surface text-center transition hover:border-brand-300"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />
      {value ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="h-full w-full object-cover" />
          <span className="absolute inset-x-0 bottom-0 bg-black/55 py-1.5 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
            重新拍摄
          </span>
          <span className="absolute right-1.5 top-1.5 rounded-full bg-status-good px-1.5 py-0.5 text-[10px] font-semibold text-white">
            ✓
          </span>
        </>
      ) : (
        <>
          <span className="text-3xl">{icon}</span>
          <span className="mt-2 text-xs font-medium text-ink-secondary">{label}</span>
          <span className="mt-0.5 text-[11px] text-ink-muted">点击拍照/上传</span>
        </>
      )}
    </button>
  );
}
