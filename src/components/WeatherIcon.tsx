interface WeatherIconProps {
  group: string;
  isDay: boolean;
  className?: string;
}

export function WeatherIcon({ group, isDay, className }: WeatherIconProps) {
  const stroke = "#F5F7FB";

  if (group === "clear" && isDay) {
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none">
        <circle cx="32" cy="32" r="12" fill="#FFB648" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          const x1 = 32 + Math.cos(a) * 20;
          const y1 = 32 + Math.sin(a) * 20;
          const x2 = 32 + Math.cos(a) * 27;
          const y2 = 32 + Math.sin(a) * 27;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFB648" strokeWidth="2.5" strokeLinecap="round" />
          );
        })}
      </svg>
    );
  }

  if (group === "clear" && !isDay) {
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none">
        <path d="M40 12a20 20 0 1 0 12 36 16 16 0 0 1-12-36Z" fill="#C9BFFB" />
        <circle cx="46" cy="18" r="1.6" fill="#C9BFFB" />
        <circle cx="50" cy="26" r="1" fill="#C9BFFB" />
      </svg>
    );
  }

  if (group === "fog") {
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none">
        <circle cx="26" cy="24" r="10" fill="#AEB9CE" opacity="0.7" />
        {[30, 38, 46].map((y, i) => (
          <line key={i} x1="12" y1={y} x2="52" y2={y} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" opacity={0.55 - i * 0.1} />
        ))}
      </svg>
    );
  }

  if (group === "snow") {
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none">
        <path d="M18 30a12 12 0 0 1 22-7 9 9 0 0 1 10 12 8 8 0 0 1-2 15H18a10 10 0 0 1 0-20Z" fill="#C7D2E6" />
        {[24, 32, 40].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="46" x2={x} y2="54" stroke="#DCE6F7" strokeWidth="2" strokeLinecap="round" />
            <line x1={x - 3} y1="48" x2={x + 3} y2="52" stroke="#DCE6F7" strokeWidth="1.4" strokeLinecap="round" />
            <line x1={x + 3} y1="48" x2={x - 3} y2="52" stroke="#DCE6F7" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        ))}
      </svg>
    );
  }

  if (group === "storm") {
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none">
        <path d="M18 28a12 12 0 0 1 22-7 9 9 0 0 1 10 12 8 8 0 0 1-2 15H18a10 10 0 0 1 0-20Z" fill="#8892B0" />
        <path d="M32 40l-6 10h5l-3 8 10-12h-5l4-6z" fill="#FFB648" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path d="M18 28a12 12 0 0 1 22-7 9 9 0 0 1 10 12 8 8 0 0 1-2 15H18a10 10 0 0 1 0-20Z" fill="#AEB9CE" />
      {group === "rain" &&
        [24, 32, 40].map((x, i) => (
          <line key={i} x1={x} y1="46" x2={x - 3} y2="56" stroke="#5FD4D6" strokeWidth="2.4" strokeLinecap="round" />
        ))}
    </svg>
  );
}
