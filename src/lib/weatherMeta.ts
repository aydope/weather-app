import type { Lang } from "@/types";

interface CodeEntry {
  fa: string;
  en: string;
  group: "clear" | "cloud" | "fog" | "rain" | "snow" | "storm";
}

const codeMap: Record<string, CodeEntry> = {
  "0": { fa: "آسمان صاف", en: "Clear sky", group: "clear" },
  "1": { fa: "عمدتاً صاف", en: "Mostly clear", group: "clear" },
  "2": { fa: "کمی ابری", en: "Partly cloudy", group: "cloud" },
  "3": { fa: "ابری", en: "Overcast", group: "cloud" },
  "45": { fa: "مه‌آلود", en: "Foggy", group: "fog" },
  "48": { fa: "مه یخ‌زده", en: "Rime fog", group: "fog" },
  "51": { fa: "نم‌نم باران سبک", en: "Light drizzle", group: "rain" },
  "53": { fa: "نم‌نم باران", en: "Drizzle", group: "rain" },
  "55": { fa: "نم‌نم باران شدید", en: "Dense drizzle", group: "rain" },
  "61": { fa: "باران سبک", en: "Light rain", group: "rain" },
  "63": { fa: "باران", en: "Rain", group: "rain" },
  "65": { fa: "باران شدید", en: "Heavy rain", group: "rain" },
  "71": { fa: "برف سبک", en: "Light snow", group: "snow" },
  "73": { fa: "برف", en: "Snow", group: "snow" },
  "75": { fa: "برف شدید", en: "Heavy snow", group: "snow" },
  "80": { fa: "رگبار سبک", en: "Light showers", group: "rain" },
  "81": { fa: "رگبار", en: "Showers", group: "rain" },
  "82": { fa: "رگبار شدید", en: "Violent showers", group: "rain" },
  "95": { fa: "رعد و برق", en: "Thunderstorm", group: "storm" },
  "96": { fa: "رعد و برق با تگرگ", en: "Thunderstorm, hail", group: "storm" },
  "99": {
    fa: "رعد و برق شدید با تگرگ",
    en: "Severe thunderstorm",
    group: "storm",
  },
};

export function weatherMeta(code: number, lang: Lang) {
  const entry = codeMap[String(code)] ?? {
    fa: "نامشخص",
    en: "Unknown",
    group: "cloud" as const,
  };
  return { label: entry[lang], group: entry.group };
}

export function skyGradient(group: string, isDay: boolean): string {
  if (!isDay) return "from-[#05060B] via-[#0A0D1C] to-[#141230]";
  switch (group) {
    case "clear":
      return "from-[#0B1424] via-[#13294A] to-[#3D2D14]/70";
    case "cloud":
      return "from-[#0B1020] via-[#141C38] to-[#232C50]";
    case "rain":
      return "from-[#070B16] via-[#0D1630] to-[#142446]";
    case "snow":
      return "from-[#0E1628] via-[#18253F] to-[#42536F]/60";
    case "storm":
      return "from-[#06070F] via-[#0F1026] to-[#1C1438]";
    case "fog":
      return "from-[#0F131F] via-[#171C2C] to-[#252B3F]";
    default:
      return "from-[#0B1020] via-[#141C38] to-[#232C50]";
  }
}

export function uvLabel(uv: number, lang: Lang): string {
  if (uv < 3) return lang === "fa" ? "کم" : "Low";
  if (uv < 6) return lang === "fa" ? "متوسط" : "Moderate";
  if (uv < 8) return lang === "fa" ? "زیاد" : "High";
  if (uv < 11) return lang === "fa" ? "خیلی زیاد" : "Very high";
  return lang === "fa" ? "شدید" : "Extreme";
}
