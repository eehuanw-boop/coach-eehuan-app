"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, setCurrentClient, setCoach } from "@/lib/session";

export function EntryButtons() {
  const session = useSession();
  const router = useRouter();

  const hasActiveClient = session.role === "client" && !!session.clientId;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href={hasActiveClient ? "/dashboard" : "/onboarding"}
          className="w-full sm:w-auto rounded-full bg-brand-600 px-7 py-3.5 text-center font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          {hasActiveClient ? "继续我的打卡 →" : "开始我的蜕变挑战 →"}
        </Link>
        <button
          onClick={() => {
            setCoach();
            router.push("/coach");
          }}
          className="w-full sm:w-auto rounded-full border border-hairline bg-surface px-7 py-3.5 text-center font-semibold text-ink-primary transition hover:border-brand-300"
        >
          教练后台 · Coach Eehuan
        </button>
      </div>
      <button
        onClick={() => {
          setCurrentClient("seed-xiaomei");
          router.push("/dashboard");
        }}
        className="text-sm text-ink-muted underline decoration-dotted underline-offset-4 hover:text-brand-600"
      >
        先看看学员打卡示例 →
      </button>
    </div>
  );
}
