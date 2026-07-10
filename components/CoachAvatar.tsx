const SIZES = { sm: 40, md: 64, lg: 112, xl: 176 } as const;

export function CoachAvatar({
  size = "md",
  className = "",
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const px = SIZES[size];
  const gradId = `coach-grad-${size}`;
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 112 112"
      className={className}
      role="img"
      aria-label="Coach Eehuan 头像"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1f9857" />
          <stop offset="100%" stopColor="#0b6039" />
        </linearGradient>
      </defs>
      <circle cx="56" cy="56" r="52" fill={`url(#${gradId})`} />
      <circle cx="56" cy="56" r="52" fill="none" stroke="#f2a73b" strokeWidth="3" />
      <path
        d="M20 78 C 34 58, 44 50, 56 50 C 68 50, 78 58, 92 78"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.14"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <text
        x="56"
        y="66"
        textAnchor="middle"
        fontSize="44"
        fontWeight="700"
        fill="#ffffff"
        fontFamily="-apple-system, 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif"
      >
        E
      </text>
      <g transform="translate(80,80)">
        <circle r="15" fill="#f2a73b" stroke="#fcfcfb" strokeWidth="2.5" />
        <text x="0" y="6" textAnchor="middle" fontSize="16">
          🌿
        </text>
      </g>
    </svg>
  );
}
