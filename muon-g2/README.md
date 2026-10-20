# Muon g−2 // Ring to Result

An independent educational pseudo-experiment. All events and field readings are simulated. This is not an official Fermilab application, real experimental data, or a precision E989 reproduction.

## Launch locally

No build, account, API key, CDN or network connection is required after downloading the package. The included Three.js dependency is vendored.

1. Extract the archive.
2. Open a terminal in the `muon-g2` folder.
3. Run `python3 start.py` (Windows: `py start.py`).
4. Open the printed localhost address. The launcher also attempts to open your browser.
5. Stop the local server with Ctrl+C when finished.

Alternatively, run `python3 -m http.server 8765` in the folder and open `http://localhost:8765/`. Use an HTTP server: double-clicking `index.html` as a `file:` URL does not allow JavaScript module workers in many browsers. A current browser with JavaScript is required. WebGL provides the 3D display; without it, the application shows a schematic and retains controls, event records, plots, fits and field extraction.

## GitHub Pages: add this site beside the existing sites

The deployment ZIP extracts **one folder named `muon-g2`**, containing `index.html`, `style.css`, `app/`, `vendor/`, `data/` and documentation directly within that folder. There is no `dist/` layer.

Copy this new folder into the existing published root:

```
SiewYan.github.io/
├── cv/
├── cms-event-display/
└── muon-g2/
    ├── index.html
    ├── style.css
    ├── app/
    ├── vendor/
    └── data/
```

With the repository's existing Pages configuration, the intended additional address is `https://siewyan.github.io/muon-g2/`. Preserve the other folders, branch, domain and Pages settings. Nothing in this delivery publishes or modifies that repository. Do not replace the repository with this ZIP's contents. All application asset paths are relative; serving under a subfolder is supported.

## Start here

The first visit generates the seeded 100,000-muon ideal benchmark in a worker, shows a representative selected event, and fits its measured arrival-time histogram. It is deliberately paused for accessibility. Use the guided route or explore the four workspaces freely. Take an independent field measurement in workspace 4 to complete the extraction.

- **Ring & decay:** six camera views, drag rotation, zoom buttons, cutaway, labeled spin and momentum, stochastic decay provenance, injection illustration, play/pause/step/replay and physical-time scrubber.
- **Detectors:** 24 inner calorimeters; 9 × 6 crystal/SiPM close-up; two schematic eight-module trackers; separate trolley operation.
- **Data & wiggle fit:** threshold/window selections, exact-integral Poisson likelihood, multistart frequency search, covariance/correlations, fit failure messages, residuals, folded counts, spectrum, linked event inspection and stability history.
- **Field & g−2:** independent toy probe readings, common calibration offset/correction/uncertainty, and separate `a_mu`, `g_mu−2`, `g_mu` with uncertainty components.

A generation change creates a new dataset. A cut change reuses events and invalidates the old fit. Replay never appends events. Up to 300,000 generated muons can be retained per dataset. A deterministic recipe, field observations and recent fit history are saved locally; full events are regenerated from the recipe on reload. No data leave the browser unless you export them yourself.

## Exports and seeded data

- Full JSON includes every generated parent, its decay/observation when applicable, configuration, constants, units, selection, field observations, fit, covariance and correlations.
- Event CSV contains scalar event provenance and selection; comment lines contain simulation metadata. Use JSON for full coordinate arrays, straw records and covariance.
- Histogram/fit JSON includes all bins, including zeros, plus diagnostic plot rows.
- SVG exports provide standalone scientific plots with axes, units and series labels. They are simulated observations, not data from Fermilab.
- `data/demo.json` is the exact deterministic 100,000-parent recipe. `data/demo-events.json` contains 32 realized selected events, and `data/demo-fit.json` contains the complete benchmark histogram and fit. These files document the same initial demonstration that the application regenerates.

## Tests (complete-source package)

Node.js 20 or newer is sufficient; no installation is needed:

```
node tests/run.mjs
```

The test script prints checks and writes `data/validation.json`, the example records and benchmark fit. See `VALIDATION.md` for outcomes and limits. The complete-source ZIP includes the tests; the deployment ZIP does not need them at runtime.

## Module map

| File | Responsibility |
|---|---|
| `app/constants.js` | Physical constants, reference apparatus and defaults |
| `app/random.js` | Seeded PRNG, variates and Poisson reference sampling |
| `app/physics.js` | Circular muon transport, spin, Michel sampling, boosts, positron helix |
| `app/geometry.js` | Finite calorimeter and tracker surfaces/intersections |
| `app/generator.js` | Per-parent events, detector response, stable IDs and selection |
| `app/fit.js` | Observation-only Poisson fit and diagnostics; no truth imports |
| `app/field.js` | Independent field samples, calibration and extraction |
| `app/storage.js` | Deduplication, bounded recipe persistence and downloads |
| `app/worker.js` | Generation and fitting off the main UI thread |
| `app/scene.js` | Three.js display, camera, rendering and schematic fallback |
| `app/plots.js` | Accessible SVG plots and data-table values |
| `app/main.js` | Workspace navigation, controls and presentation |

See `PHYSICS.md`, `TEACHING.md`, `REFERENCES.md`, and `VALIDATION.md` for the scientific model and teaching guidance. Three.js 0.170.0 is MIT-licensed; its original license is retained in `vendor/THREE-LICENSE.txt`.
