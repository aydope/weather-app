const SYNODIC_MONTH_DAYS = 29.530588853;
const REFERENCE_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14);

const phaseKeys = [
  "moonNew",
  "moonWaxingCrescent",
  "moonFirstQuarter",
  "moonWaxingGibbous",
  "moonFull",
  "moonWaningGibbous",
  "moonLastQuarter",
  "moonWaningCrescent",
];

export function moonPhase(date: Date) {
  const days = (date.getTime() - REFERENCE_NEW_MOON_MS) / 86_400_000;
  const fraction = (((days % SYNODIC_MONTH_DAYS) + SYNODIC_MONTH_DAYS) % SYNODIC_MONTH_DAYS) / SYNODIC_MONTH_DAYS;
  const illumination = (1 - Math.cos(2 * Math.PI * fraction)) / 2;
  const nameKey = phaseKeys[Math.floor(fraction * 8 + 0.5) % 8];
  return { fraction, illumination, nameKey };
}
