import Link from "next/link";
import { CoachAvatar } from "./CoachAvatar";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 shrink-0">
      <CoachAvatar size="sm" />
      <span className="flex flex-col leading-tight">
        <span className="font-semibold text-ink-primary tracking-tight">Coach Eehuan</span>
        <span className="text-[11px] text-ink-muted">蜕变陪伴系统</span>
      </span>
    </Link>
  );
}
