# Scalar — Scientific Calculator + Unit Converter
Offline app (Vite + React + mathjs), runs in the browser or as an Electron desktop app. No accounts, tracking or network calls.

    npm install
    npm run dev      # http://localhost:5173
    npm run build    # production build in dist/
    npm test         # conversion + calculator smoke tests
    node --test test-inch-chart.mjs # exact fractional-inch decimal tests
    npm run app      # build + launch desktop app (Electron)
    npm run dist     # macOS app folder in release/
    npm run dist:win # Windows portable .exe in release/

- Left: converter (Length, Weight, Temperature, Volume, Area, Speed, Time, Data, Energy). Type in any row; all rows update. Star categories/units to pin them. "+ Custom unit" adds a unit defined relative to the category base unit (temperature: factor + offset to kelvin). Custom units can be edited/deleted.
- Right: fx-991ES-style calculator: SHIFT layer (inverse trig, x!, ∛, 10ˣ, eˣ, |x|, π, e, %), DEG/RAD, S⇔D fraction toggle, Ans, history (click to reuse, capped at 100), click display to copy.
- Inch chart: hover a fractional label or tick to see its exact decimal value in inches (for example, 3/8 = 0.375").
- Keyboard: digits, + - * / ^ ( ) . % !, Enter/=, Backspace, Escape, p = π.
- Saved in localStorage: favorites, custom units, settings, history, Ans, last category and values.
## Code map
- `src/main.jsx`, `src/App.jsx`: entry and layout
- `src/Converter.jsx`, `src/units.js`: unit converter and unit data
- `src/Calculator.jsx`, `src/calc.js`: calculator UI and evaluation
- `src/BendChart.jsx`, `src/bendData.js`: bend chart and its data
- `src/InchChart.jsx`: inch/fraction chart
- `src/FitScale.jsx`, `src/ResizeHandle.jsx`: window scaling and resize
- `src/store.js`: localStorage persistence
- `electron/main.cjs`, `electron/preload.cjs`: desktop shell
- `test.mjs`: smoke tests; `docs/screenshots/`: UI screenshots (v1, v2)
