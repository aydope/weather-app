# Contributing

Bug reports, ideas and pull requests are welcome.

## Setup

```bash
npm install
npm run dev
```

Run `npm run build` before opening a pull request. It type checks the project and builds it.

## Guidelines

- Keep changes focused. One pull request should do one thing.
- Follow the existing structure and naming. UI strings live in `src/i18n.ts` and need both `fa` and `en` entries.
- Weather and air quality data come from Open-Meteo, so no API key is needed.
- For UI changes, include a screenshot in both languages if the layout is affected (the Persian layout is right to left).
