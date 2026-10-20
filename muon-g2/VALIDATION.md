# Validation report

20 October 2026 · version `ring-to-result-1.0.0`

## Numerical checks: 19 / 19 passed

Run `node tests/run.mjs` in the complete-source package to reproduce the checks and machine-readable report `data/validation.json`. No test framework or dependency installation is needed.

1. Internally consistent momentum, field, radius, magic gamma and characteristic periods.
2. Independent fourth-order Runge–Kutta Lorentz-force integration versus the circular orbit; both charge signs.
3. Independent numerical positron integration versus the analytic helix; energy conservation.
4. Laboratory and relative spin evolution, including the g=2 limit.
5. Exponential proper lifetime and Lorentz dilation.
6. Michel normalization, energy CDF, mean energy, positive-muon angular sign and uniform azimuth.
7. Lorentz boost and four-momentum closure of the positron plus total invisible recoil. Individual neutrinos are not generated.
8. Threshold asymmetry against an independently derived ultrarelativistic energy-angle oracle.
9. Finite calorimeter intersections, undetected positrons, tracker measurements and no neutrino records.
10. Per-configuration IDs, replay deduplication, chunk-invariant generation and nested cut consistency.
11. Exact bin integral checked independently with Simpson quadrature.
12. Recovery of independently generated ideal rate samples at a different frequency from the app default; zero bins and multiple fit windows.
13. Closure of the Michel/boost-generated ideal sample using measured arrival times.
14. No identified frequency in fully inclusive, unpolarized or g=2 ideal samples.
15. Sparse-sample failure and competing two-frequency rejection or visible model mismatch.
16. Early-efficiency correction on exactly the same observations as the incomplete baseline.
17. Twelve independent pseudo-experiments: pull behavior and approximate square-root statistical scaling.
18. Field calibration, angular-frequency units, anomaly extraction and common uncertainty floor.
19. Architectural check that the fitter does not import the generator, physics constants or hidden truth.

## Seeded demonstration

| Quantity | Result |
|---|---:|
| Run ID | Rf955b105 |
| Generated positive muons | 100,000 |
| Selected arrivals, E ≥ 1.8 GeV, 30–650 μs | 11,895 |
| Fitted omega_a | 1.439650820 ± 0.000487389 rad/μs |
| Injected omega_a (comparison only) | 1.439176594 rad/μs |
| Fitted lifetime | 64.0636 μs |
| Fitted asymmetry | 0.4022 |
| Frequency–phase correlation | −0.8230 |

The difference between fit and input is about 0.97 statistical standard deviations. The input was not passed to the fitter.

An independently generated 12-experiment rate-model ensemble gave mean frequency pull 0.193 and pull standard deviation 1.043. Mean uncertainties for 20,000 versus 80,000 generated rate-model entries had ratio 2.014, near the expected 2. This small ensemble is a sanity check, **not** precision validation of frequentist coverage.

## Separate detector validation

A 20,000-parent geometric sample produced 7,763 detected positrons and 372 tracker-tagged events. Every accepted calorimeter coordinate was checked against its finite plane and independently evaluated helix. Undetected trajectories remain absent from the measured sample.

These intersection and provenance checks do **not** establish unbiased frequency recovery for realistic acceptance. The application always labels detector-aware fits as exploratory and exposes mismatch diagnostics; it does not claim to reproduce E989 acceptance or response.

## Quantitative distortion check

For 200,000 parents with a 60% early-efficiency deficit, fitting the same observations gave:

| Model | Fitted lifetime / μs | Poisson deviance |
|---|---:|---:|
| Incomplete baseline | 72.6394 | 1130.30 |
| Known efficiency correction | 64.0781 | 1012.98 |

The injected lifetime is 64.3718 μs. A distortion can bias the lifetime even if the fitted frequency moves little. The corrected result uses the known declared efficiency law; gain drift has no supplied corrected fit.

## Browser checks performed

The application was exercised in the Codex in-app browser with desktop and narrow phone viewport overrides:

- Four-workspace navigation and seeded worker generation/fitting.
- Ring, co-moving and tracker views; distinguishable p and S markers.
- Addition of a single muon: stable event `Rf955b105/F101/M1`; replay retained the 100,001 generated count.
- New 10,000-parent geometric configuration: separate run ID, 3,898 detections, 499 selected entries and inspectable tracker-tagged event.
- Sparse geometric sample correctly reported insufficient information for a frequency estimate.
- Independent field readings and extraction: separate uncertainty components and distinct a, g−2 and g values.
- Local recipe regeneration after reload.
- Explicit schematic mode (`?view=schematic`) displayed the non-WebGL fallback with functional data controls.
- Analysis download completed. The downloaded JSON parsed successfully and contained provenance, units, configuration and 1,240 bins totaling the 499 selected geometric entries.
- Phone layout showed no horizontal document overflow at the tested narrow viewport.
- No browser console errors were observed during these checks.

## Verification limits

This is not an exhaustive browser/device, screen-reader, GPU or performance certification. The fallback was exercised through its explicit mode, not a physical GPU failure. Keyboard focus styles, semantic controls and tables are supplied, but a full assistive-technology audit was not performed. The export mechanism was browser-tested for analysis JSON; CSV, full-event JSON and SVG share the download path and were checked in source, not each downloaded in every browser.

The exact five-parameter model is validated for the stated ideal benchmark. Geometric acceptance, momentum spread, fast smearing and gain drift may cause unquantified model bias. The reported covariance does not include that bias. The fixed-parameter Poisson diagnostic is not a calibrated fit p-value. No full detector shower, independent tracker reconstruction, electric-field transport, vertical pitch, real beam distribution, nonuniform field weighting, pile-up or precision correction model has been validated or claimed.
