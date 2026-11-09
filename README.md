# Scalar — Scientific Calculator + Unit Converter
Offline app (Vite + React + mathjs), runs in the browser or as an Electron desktop app. No accounts, tracking or network calls.

## Install on a Mac (Apple Silicon)
Paste this in Terminal. It downloads the latest release, checks its SHA-256 against the release's `SHA256SUMS`, installs `Scalar.app` in `/Applications`, clears the Gatekeeper quarantine flag (the app is not notarized) and opens it. Existing history and settings are kept.

    curl -fsSL https://raw.githubusercontent.com/f4k3id/scalar/master/scripts/install-mac.sh | bash

To install a specific version, pass it as an argument, for example `bash scripts/install-mac.sh 1.1.0`. Windows and web builds are on the [Releases](https://github.com/f4k3id/scalar/releases) page.

## Development

    npm install
    npm run dev      # http://localhost:5173
    npm run build    # production build in dist/
    npm test         # conversion + calculator smoke tests
    node --test test-inch-chart.mjs # exact fractional-inch decimal tests
    node --test test-drill-data.mjs # drilling guide data checks (row counts, order, spot values)
    npm run app      # build + launch desktop app (Electron)
    npm run dist     # macOS app folder in release/
    npm run dist:win # Windows portable .exe in release/

- Left: converter (Length, Weight, Temperature, Volume, Area, Speed, Time, Data, Energy). Type in any row; all rows update. Star categories/units to pin them. "+ Custom unit" adds a unit defined relative to the category base unit (temperature: factor + offset to kelvin). Custom units can be edited/deleted.
- Right: fx-991ES-style calculator: SHIFT layer (inverse trig, x!, ∛, 10ˣ, eˣ, |x|, π, e, %), DEG/RAD, S⇔D fraction toggle, Ans, history (click to reuse, capped at 100), Copy button.
- Inch chart: hover a fractional label or tick to see its exact decimal value in inches (for example, 3/8 = 0.375").
- Keyboard: digits, + - * / ^ ( ) . % !, Enter/=, Backspace, Escape, p = π.
- Saved in localStorage: favorites, custom units, settings, history, Ans, last category and values.
## Code map
- `src/main.jsx`, `src/App.jsx`: entry and layout
- `src/Converter.jsx`, `src/units.js`: unit converter and unit data
- `src/Calculator.jsx`, `src/calc.js`: calculator UI and evaluation
- `src/BendChart.jsx`, `src/bendData.js`: bend chart and its data
- `src/InchChart.jsx`: inch/fraction chart
- `src/DrillGuide.jsx`, `src/drillData.js`: metal drilling reference guide and its data
- `docs/reference/`: reference PDFs bundled with the desktop app
- `src/FitScale.jsx`, `src/ResizeHandle.jsx`: window scaling and resize
- `src/store.js`: localStorage persistence
- `electron/main.cjs`, `electron/preload.cjs`: desktop shell
- `test.mjs`: smoke tests; `docs/screenshots/`: UI screenshots (v1, v2)

## Metal drilling guide
The drilling guide panel transcribes the IRWIN Metal Drilling Reference Guide. The panel shows an RPM calculator (RPM = SFM × 3.82 ÷ drill diameter; pick a material and type a drill size such as 1/4, .25, #7, F or 6 mm) and the usual NC/NF and coarse metric tap drills. Click it to see the full guide: cutting speeds, feed per revolution, deep-hole speed and feed reduction, and all 187 rows of the Tap & Drill Selection Chart. Hover a row to see its decimal, mm value and taps. The links open the OSG Drilling Technical Guide (Vol 1) and the IRWIN PDF. The desktop app opens its bundled copies in your PDF viewer, and the web version opens them online.

## Enlarged panels
Click the inch chart, the folding table or the drilling guide to open it enlarged in a pop-up. Click anywhere on the pop-up (or press Esc) to close it.

## Web version
`web/Scalar.html` is a single self-contained file: open it in any modern browser, no install or server needed. Settings are saved in the browser's local storage. Rebuild it with `npm run build:web`.

## Fractions in the calculator
Type the numerator, press the fraction key (□/□, next to SHIFT), then type the denominator. Fractions show stacked (numerator over a bar over the denominator). Fraction results also show their decimal value, for example 1/32 and 0.03125. Recent calculations scroll inside the display as well as in the History panel; click one to reuse it.
