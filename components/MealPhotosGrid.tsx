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

export function MealPhotosGrid({
  photos,
  onAdd,
  onRemove,
}: {
  photos: string[];
  onAdd: (dataUrl: string) => void;
  onRemove: (index: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readAsDataURL(file);
    onAdd(dataUrl);
    e.target.value = "";
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {photos.map((p, i) => (
        <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-hairline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p} alt={`三餐照片 ${i + 1}`} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition group-hover:opacity-100"
            aria-label="删除照片"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-hairline text-ink-muted transition hover:border-brand-300 hover:text-brand-600"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFile}
        />
        <span className="text-xl leading-none">+</span>
        <span className="text-[11px]">添加一餐</span>
      </button>
    </div>
  );
}
