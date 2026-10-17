interface MoonDiscProps {
  fraction: number;
  className?: string;
}

const CENTER = 50;
const RADIUS = 38;

function litPath(fraction: number): string {
  const waxing = fraction < 0.5;
  const k = Math.cos(2 * Math.PI * fraction);
  const rx = RADIUS * Math.abs(k);
  const top = CENTER - RADIUS;
  const bottom = CENTER + RADIUS;
  const limbSweep = waxing ? 1 : 0;
  const terminatorSweep = waxing ? (k > 0 ? 0 : 1) : k > 0 ? 1 : 0;
  return `M ${CENTER} ${top} A ${RADIUS} ${RADIUS} 0 0 ${limbSweep} ${CENTER} ${bottom} A ${rx} ${RADIUS} 0 0 ${terminatorSweep} ${CENTER} ${top} Z`;
}

export function MoonDisc({ fraction, className }: MoonDiscProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="moonLit" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#FBF5E4" />
          <stop offset="1" stopColor="#CDBF98" />
        </radialGradient>
      </defs>
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS + 6}
        fill="none"
        stroke="rgba(236,216,172,0.15)"
      />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="rgba(255,246,228,0.06)"
        stroke="rgba(236,216,172,0.3)"
      />
      <path d={litPath(fraction)} fill="url(#moonLit)" />
    </svg>
  );
}
