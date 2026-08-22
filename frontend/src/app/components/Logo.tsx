export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="glg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0D7377" />
          <stop offset="100%" stopColor="#14A3A8" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#glg)" />
      <circle cx="24" cy="24" r="10" stroke="white" strokeWidth="2" strokeDasharray="4 2" fill="none" opacity=".6" />
      <circle cx="24" cy="24" r="3" fill="white" />
      <line x1="24" y1="4" x2="24" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".5" />
      <line x1="24" y1="34" x2="24" y2="44" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".5" />
      <line x1="4" y1="24" x2="14" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".5" />
      <line x1="34" y1="24" x2="44" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".5" />
      <path d="M24 16 L27 22 L24 20 L21 22 Z" fill="white" />
    </svg>
  );
}
