export interface AqiCategory {
  key:
    | "good"
    | "moderate"
    | "sensitive"
    | "unhealthy"
    | "veryUnhealthy"
    | "hazardous";
  color: string;
}

export function aqiCategory(aqi: number): AqiCategory {
  if (aqi <= 50) return { key: "good", color: "#7BC8A4" };
  if (aqi <= 100) return { key: "moderate", color: "#E5C567" };
  if (aqi <= 150) return { key: "sensitive", color: "#E39A5C" };
  if (aqi <= 200) return { key: "unhealthy", color: "#E0695F" };
  if (aqi <= 300) return { key: "veryUnhealthy", color: "#B07AD8" };
  return { key: "hazardous", color: "#A33A5A" };
}
