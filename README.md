# Weather App

Bilingual (Persian / English) real-time weather app with a dark, glass-based luxury design.
React + TypeScript + Vite + Tailwind CSS, shadcn/ui-style components, Cormorant Garamond for English display text and Vazirmatn for Persian.

Data source: [Open-Meteo](https://open-meteo.com) (free, no API key required) for geocoding, weather and air quality.

## Features

- City search with keyboard navigation (press `/` to focus), recent cities and saved (starred) cities
- Use my location
- Today's briefing: umbrella, UV, clothing, wind, air quality and visibility tips derived from the data
- Next 24 hours as cards plus a temperature curve and rain probability chart
- 7-day forecast with rain chance and temperature range
- Air quality (US AQI) with pollutant values
- Details: wind and gusts, UV, humidity, pressure, visibility, cloud cover, dew point, precipitation
- Sun arc, daylight length and moon phase
- Celsius / Fahrenheit, Persian (RTL) / English (LTR)
- The last viewed city is restored on the next visit

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

## Design

Frosted glass panels (`backdrop-filter` blur, translucent warm gradient, gold hairline borders)
float over a dark sky gradient, slow colored light and a subtle film grain. The light colors
follow the current weather and day or night. Glass utilities live in `src/index.css`
(`.glass`, `.glass-strong`, `.glass-pill`, `.glass-input`, `.glass-menu`).

## Project structure

```
src/
  api/weather.ts          Open-Meteo calls (geocoding, forecast, air quality)
  components/
    ui/                   Button, Chip, Segmented, Skeleton, SectionTitle, icons
    Header.tsx            sticky header with section navigation and unit/language switches
    Footer.tsx            GitHub star and contribute buttons
    SearchCommand.tsx     search, suggestions, locate, saved and recent cities
    EmptyState.tsx        landing state with popular cities
    Hero.tsx              current conditions and quick stats
    Briefing.tsx          generated tips for today
    HourlyStrip.tsx       next hours (cards) and HourlyChart.tsx (curve and rain bars)
    DailyForecast.tsx     7-day forecast
    AirQuality.tsx        AQI gauge and pollutants
    DetailsGrid.tsx       wind, UV, humidity, pressure and more
    SunMoon.tsx           sun arc, daylight and MoonDisc.tsx
    AmbientOrbs.tsx       blurred colored light behind the glass
  lib/
    config.ts             repository URLs
    insights.ts           tip rules for the briefing
    moon.ts               moon phase calculation
    airQuality.ts         AQI categories
  i18n.ts                 fa / en dictionary
  types.ts                shared TypeScript types
  App.tsx                 app state (language, search, favorites, loading/error)
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
