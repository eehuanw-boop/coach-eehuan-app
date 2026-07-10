/** Generates a small inline SVG data-URI used as a stand-in "photo" for seed/demo data. */
export function placeholderPhoto(emoji: string, bg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">
    <rect width="240" height="240" rx="24" fill="${bg}"/>
    <text x="50%" y="54%" font-size="104" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
