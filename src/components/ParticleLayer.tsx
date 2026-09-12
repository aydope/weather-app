interface ParticleLayerProps {
  group: string;
}

export function ParticleLayer({ group }: ParticleLayerProps) {
  if (group === "rain" || group === "storm") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 22 }).map((_, i) => (
          <span
            key={i}
            className="absolute block w-px h-8 bg-cyan/40 animate-fall-line"
            style={{
              left: `${(i * 97) % 100}%`,
              animationDuration: `${0.9 + (i % 5) * 0.2}s`,
              animationDelay: `${(i % 7) * 0.3}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (group === "snow") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 26 }).map((_, i) => (
          <span
            key={i}
            className="absolute block rounded-full bg-paper/50 animate-fall-dot"
            style={{
              left: `${(i * 83) % 100}%`,
              width: `${3 + (i % 3)}px`,
              height: `${3 + (i % 3)}px`,
              animationDuration: `${5 + (i % 6)}s`,
              animationDelay: `${(i % 8) * 0.6}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 opacity-[0.06] animate-drift pointer-events-none"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 30%, white 0, transparent 40%), radial-gradient(circle at 80% 70%, white 0, transparent 45%)",
      }}
    />
  );
}
