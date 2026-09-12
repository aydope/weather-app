# Weather App

Bilingual (Persian / English) real-time weather app.
React + TypeScript + Vite + Tailwind CSS, shadcn/ui-style components, Vazirmatn font for Persian.

Data source: [Open-Meteo](https://open-meteo.com) (free, no API key required) — geocoding + current conditions.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  api/weather.ts          Open-Meteo API calls (geocoding + forecast)
  components/
    ui/                   shadcn/ui-style primitives (Button, Input)
    SearchBar.tsx         city search + autocomplete
    WeatherHero.tsx       big temperature / city / icon panel
    StatsRow.tsx          feels-like / humidity / wind
    WeatherIcon.tsx       hand-drawn SVG weather icons
  lib/
    utils.ts              cn() class-merge helper
    weatherMeta.ts         weather-code -> label / gradient mapping
  i18n.ts                  fa / en dictionary
  types.ts                 shared TypeScript types
  App.tsx                  app state (language, search, loading/error)
```

---

## Run

```bash
npm install
npm run dev
```
