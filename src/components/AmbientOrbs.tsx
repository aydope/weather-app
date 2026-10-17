interface AmbientOrbsProps {
  group: string;
  isDay: boolean;
}

type Palette = [string, string, string];

const dayPalettes: Record<string, Palette> = {
  idle: ["#C9A55C", "#2B3A8C", "#1F5F66"],
  clear: ["#D9A24A", "#B5532F", "#2D5FA8"],
  cloud: ["#4C5F9C", "#8A6FB8", "#2E6E78"],
  rain: ["#2B5CB0", "#2E7C86", "#4B3FA0"],
  snow: ["#93A9CC", "#5E8FC2", "#9B90C8"],
  storm: ["#5A33B0", "#C28A32", "#1E2A70"],
  fog: ["#77839B", "#98A3B8", "#5A6890"],
};

const nightPalette: Palette = ["#3E34A0", "#1F3A8A", "#8B6FC0"];

export function AmbientOrbs({ group, isDay }: AmbientOrbsProps) {
  const [a, b, c] = isDay
    ? (dayPalettes[group] ?? dayPalettes.cloud)
    : nightPalette;

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      <span
        className="orb animate-orb-a"
        style={{
          top: "-12%",
          left: "-8%",
          width: "48vmax",
          height: "48vmax",
          backgroundColor: a,
        }}
      />
      <span
        className="orb animate-orb-b"
        style={{
          top: "28%",
          right: "-14%",
          width: "42vmax",
          height: "42vmax",
          backgroundColor: b,
        }}
      />
      <span
        className="orb animate-orb-c"
        style={{
          bottom: "-18%",
          left: "18%",
          width: "44vmax",
          height: "44vmax",
          backgroundColor: c,
        }}
      />
    </div>
  );
}
