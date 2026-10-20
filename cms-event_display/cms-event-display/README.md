# CMS // Event Display

An independent educational Three.js display of an approximate early Run 3 (2022) CMS detector. Default seed `314159` gives a dimuon event with a reconstructed invariant mass of approximately 91.51 GeV/c². No CERN data feed or real event provenance is claimed.

## Launch

From this directory run `python3 -m http.server 4173 --directory dist`, then open http://localhost:4173. Alternatively, `npm start`. No build or dependency install is necessary: Three.js 0.169.0 and the required camera/postprocessing modules are included in `dist/vendor/`. Google Fonts is the only optional external UI dependency; system fonts work offline. Serve over HTTP, not `file://`.

Run `node tests.mjs` (or `npm test`) for deterministic scientific checks. Deploy the static `dist` directory to any static web host.

## Use

Play, next and replay; nine event categories; 0.5/1/2 events per second; fixed seed; pile-up and intensity; truth overlay; charged-track pT threshold; particle and detector filters; opacity; cutaway angle; geometry modes; five camera presets; automatic orbit; scene PNG export. Scroll within compact desktop panels for additional controls or measurements. On narrow screens the scene sits above stacked panels.

Drag to orbit, right-drag or two fingers to pan, wheel or pinch to zoom. Space: playback, N: next, R: reset, 1–5: camera, C: geometry, L: labels, Escape: clear/close. Click a track, hit, plot, or object button to select. Capture includes a simulation label and seed. The complete notes and source links are accessible from “Model notes & sources”.

## Architecture

- `dist/detector.js`: central approximate geometry parameters, reusable instanced modules, detector visibility and presentation transforms.
- `dist/physics.js`: seeded generation; four-vector utilities; trajectory integration; simplified signals; object interpretation.
- `dist/scene.js`: Three.js, camera, picking, staged response, selective luminance bloom, event-resource disposal, performance fallback.
- `dist/plots.js`: synchronized Canvas x–y, nonnegative r–z, and eta–phi deposit projections and picking.
- `dist/app.js`: shared interface state, deterministic replay, readouts and keyboard interaction.
- `dist/analysis-data.js`: channel definitions, observable descriptions, Gaussian maximum-likelihood estimates, sample validation and de-duplication.
- `dist/analysis.js`: browser-local collection, sample ledger, histogram, fit controls and CSV export.
- `dist/style.css`: responsive instrument panels and reduced-motion support.

## Scientific approximations

This is a toy visualization, not CMSSW, Geant4 or a detector performance model. Dimensions are coarse display envelopes in metres. The principal CMS envelope is about 21 m long and 15 m across; forward HCAL is shown beyond that envelope. Phase-1 pixel/strip trackers, ECAL/HCAL, solenoid, five yoke wheels with three radial steel layers, four endcap steel disks per side, DT/CSC/RPC regions and installed GE1/1 are included. Small GE2/1 demonstrators are omitted. Future HGCAL, MTD, ME0 and full GE2/1 stations are excluded.

Two-body rest-frame decays use the daughter masses and receive a longitudinal Lorentz boost. Soft background pairs and dijet constituent pairs balance transverse momentum. Response smearing independently scales each visible momentum, then recomputes the on-shell energy; this toy smearing is not a claim about CMS resolution. Pair masses use the same displayed reconstructed four-vectors. Reconstructed jets sum predefined generated constituent groups, without a jet clustering algorithm. There is no proton PDF, parton shower, full pile-up model, material transport, energy loss, conversion, trigger or actual track-fitting algorithm.

Within r < 3 m and |z| < 6.25 m, charged trajectories follow pT = 0.2998 |q/e| B R at 3.8 T, with opposite charge curvature. Outside that envelope, muons follow a straight tangent as a clearly labeled illustrative continuation; the steel return field is not modeled. Exact uniform-field Lorentz steps are sampled adaptively, with explicit field-boundary intersections. Finite path sampling and simplified detector envelopes limit hit precision. Calorimeter deposits and muon segments are illustrative responses, not readout channels. A low-pT trajectory is capped at one revolution, explicitly a display limit and not physical stopping. Solid electron/hadron paths are clipped at the tracker envelope; muon paths switch to dashed, unvalidated tangent extrapolation outside the inner field. The solid inner muon segment outside the tracker is also an ideal-field extrapolation. Barrel and endcap response envelopes are simplified.

Photons show dashed neutral flight guides and ECAL deposits, neutral hadrons have deposits without charged tracks, and neutrinos have no hits or drawn detector trajectory. Missing transverse momentum is the negative sum of all visible reconstructed momenta, including pile-up, independent of display filters. Its arrow length is scaled for visibility and is an event quantity, not a neutrino path. Plot units and angular coordinates are labeled. The longitudinal plot uses r = sqrt(x²+y²) ≥ 0, removing the spurious jumps of the old sign(y) × r convention.

Exploded and cutaway modes change detector presentation only. Particle and hit coordinates never move, so signals need not align with moved geometry. Truth overlays show unsmeared trajectories. Selection and visibility use shared state; counts and event totals are calculated before presentation filters. Render rate is explicitly labeled as application FPS.

## Verification

The detailed [physics audit](PHYSICS_AUDIT.md) distinguishes verified mathematics from unvalidated detector modeling. An independent Cartesian Runge–Kutta Lorentz-force oracle checks 108 charge/field/momentum cases, with maximum position disagreement 1.954e-11 m over the tested 0.4 m paths. Additional checks cover charge direction, constant orbit radius, helix pitch, energy conservation, axial motion, finite surface hits, field-boundary continuity and the radial-projection regression. Automated checks also cover 20 category/seed fixtures (including boundary seeds), deterministic generation, invariant masses, transverse balance, on-shell energies, missing momentum, neutral signatures, inner-field curvature and pile-up counts. Browser checks of the prior event-display version cover rendering, event selection, category changes, playback, geometry modes, pile-up, truth overlay, seed replay and responsive layouts. Coarse geometry and toy response have not been validated against engineering surveys or CMS reconstruction output.

## Sources

- https://cms.cern/detector
- https://cms.cern/news/pay-attention-cms-magnet-powered
- https://cms.cern/index.php/detector/detecting-muons
- https://cms.cern/news/first-gem-station-ge11-installed-cms
- https://arxiv.org/abs/2309.05466
- https://arxiv.org/abs/2203.11525
- Visual inspiration: https://kimsiang.github.io/FS-muonEDM/

Not affiliated with or endorsed by CERN or the CMS Collaboration. Three.js is MIT licensed; see `dist/vendor/THREE-LICENSE`.

## Physics audit update

Readouts are explicitly labeled **smeared truth**, not actual reconstructed CMS measurements. The track and response model is not physics-certified. See [PHYSICS_AUDIT.md](PHYSICS_AUDIT.md) for corrections, independent checks, remaining limitations and primary sources.


## Data & fits teaching workspace

Nine channels: Z→μμ, Z→ee, gluon-fusion-inspired H→γγ and H→ZZ*→2e2μ, VBF-inspired H→γγ+jj, semileptonic and eμ dileptonic tt̄, dijets and W→μν. New processes use exact sequential two-body kinematics. The H→ZZ* channel sets one Z mass to 91.1876 GeV and draws the other uniformly from 12–32 GeV; this is kinematically valid but not a predicted virtual-mass distribution. Top masses are fixed to 172.5 GeV, W to 80.38 GeV, H to 125.1 GeV. New jet groups are 5 GeV two-hadron cluster proxies, not parton fragmentation or b-tagged jets. Production distributions, spin correlations and rates are not predicted.

Open **Data & fits**, choose a channel, collect 100 or 1,000 events, choose an observable, then **Fit mass & width**. Available observables include dilepton/diphoton/four-lepton mass, truth-assigned hadronic W and top masses, missing transverse momentum, jet HT, tagging-jet invariant mass and |Δη|, and W transverse mass. Only resonance-peak observables enable Gaussian fitting. The continuum and transverse-mass endpoint are deliberately excluded from this model.

Counts are unique `(category, seed)` pairs of no-pile-up simulated events. They are not CMS collected luminosity or physical production proportions. Replaying or reapplying a seed never duplicates a record. Samples persist in browser local storage (up to 20,000 events); a storage failure falls back to memory with a status message. Display filters do not select the analysis sample. Data can be exported to CSV or cleared. No sample is sent to a server.

The Gaussian unbinned maximum-likelihood solution estimates mean μ = Σm/N and width σ = sqrt(Σ(m−μ)²/N), with approximate model-based statistical errors σ/√N and σ/√(2N). This is a real fit to synthetic observations, but the response is not exactly Gaussian. No backgrounds, acceptance, mass-window truncation, natural widths or systematic uncertainties enter the fit. σ describes the imposed response, not a particle lifetime. A fit needs at least 20 finite entries with nonzero variance. The injected mass is displayed as a reference, never imposed as a fit constraint.

### Validation of this addition

The tests check 1,000 sequential-decay fixtures for four-momentum closure, exact injected masses, off-shell bounds, jet sums, neutrino multiplicities and finite rendering coordinates. Six 1,000-event fits agree with their injected mass inputs. Independent analytic fit checks and sample de-duplication/persistence-format checks pass. Existing trajectory/field tests also pass. Browser visual and interaction checks for the new workspace remain incomplete: automatic browser approval review was blocked by a usage limit and then rejected a retry. The static server returned HTTP 200; module syntax and HTML/selector structure were checked without browser access.

Primary sources for the pedagogical channel choices:
- https://cms.cern/news/symmetric-or-not-thats-question
- https://cms.cern/index.php/news/using-golden-decay-channel-understand-production-higgs-boson
- https://cms.cern/news/and-the-higgs-boson-said-let-there-be-light
