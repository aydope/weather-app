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
  "99": { fa: "رعد و برق شدید با تگرگ", en: "Severe thunderstorm", group: "storm" },
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
  if (!isDay) return "from-[#070A16] via-[#0F1530] to-[#1B2148]";
  switch (group) {
    case "clear":
      return "from-[#132A4A] via-[#1F4470] to-[#FFB648]/25";
    case "cloud":
      return "from-[#111830] via-[#1B2544] to-[#2E3B66]";
    case "rain":
      return "from-[#0C1122] via-[#141F3C] to-[#1F2E52]";
    case "snow":
      return "from-[#1A2643] via-[#243459] to-[#A9BEE0]/30";
    case "storm":
      return "from-[#0A0D1C] via-[#161832] to-[#241C48]";
    case "fog":
      return "from-[#1A2032] via-[#232A42] to-[#2E3450]";
    default:
      return "from-[#0C1122] via-[#141F3C] to-[#1F2E52]";
  }
}

export function uvLabel(uv: number, lang: Lang): string {
  if (uv < 3) return lang === "fa" ? "کم" : "Low";
  if (uv < 6) return lang === "fa" ? "متوسط" : "Moderate";
  if (uv < 8) return lang === "fa" ? "زیاد" : "High";
  if (uv < 11) return lang === "fa" ? "خیلی زیاد" : "Very high";
  return lang === "fa" ? "شدید" : "Extreme";
}
