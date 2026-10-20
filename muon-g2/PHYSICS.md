# Physics model and scientific boundaries

Version `ring-to-result-1.0.0`, 20 October 2026. Every number is either a documented input, a generated quantity, a toy observation or a fit result. There is no current Standard Model comparison or discovery-significance claim.

## 1. Constants and reference apparatus

All constants live in `app/constants.js`. Momentum and energy use GeV/c and GeV, positions use metres, times use microseconds, fields use tesla, and angular frequencies use rad/μs.

| Input | Value | Role |
|---|---:|---|
| c | 299792458 m/s | Exact SI constant |
| Elementary charge | 1.602176634 × 10⁻¹⁹ C | Exact SI constant |
| Muon mass energy | 105.6583755 MeV | CODATA 2022 numerical value |
| Muon mass in kg | derived as `(m c² in GeV) × 10⁹ e / c²` | Same mass, converted to SI |
| Proper mean lifetime | 2.1969811 μs | Teaching input, PDG-listed muon lifetime |
| Mean reference p | 3.094 GeV/c | Teaching apparatus input |
| Reference ring radius | 7.112 m | Teaching apparatus input |
| Reference field | p / (0.299792458 R) = 1.45113513856 T | Derived consistent field |
| Injected a_mu | 0.001165920 | Teaching input, not latest result |
| Default polarization | 0.97 | Teaching input |

The values give gamma = 29.30012455, orbital period = 149.143 ns, anomalous period = 4.36582 μs, frequency = 229.052 kHz, and mean lab lifetime = 64.3718 μs. The injected teaching frequency is about 1.439176594 rad/μs. These are generated reference scales, not measured results.

## 2. Coordinates, charge and motion

The ring lies in physical x–y, with B along +z. Positive muons start at `(R,0,0)` with momentum `(0,−p,0)` and circulate clockwise viewed from +z. The camera uses that same z-up coordinate system.

`R = p / (0.299792458 B)`

`omega_c = e B / (gamma m_mu)`

`position(t) = (R cos(omega_c t), −R sin(omega_c t), 0)`

The muon momentum is tangent, with constant magnitude. The radius changes when p or B changes. A fixed acceptance accepts equilibrium radii within ±45 mm of the reference ring. It is a deliberately simplified storage cut; it does not calculate injection efficiency, detailed losses or collimator interactions. Accepted particles are initialized on their own equilibrium orbit. Rejected particles produce no decay/detector records in this model.

Injection is a **prescribed illustration** of arrival, inflector passage and kicker deflection. It is not integrated through device fields. The validated circular model starts after injection. Electrostatic quadrupoles and collimators are visible schematic components, but E = 0 and vertical parent momentum = 0 in quantitative transport. No randomly imposed beam oscillation, material loss or shrinking circular trajectory is used.

Consequently, changing momentum is a uniform-B, planar lesson, not a quantitative off-magic electric-focusing simulation. Vertical pitch, actual focusing, detailed apertures, kicker efficiency and beam dynamics are omitted.

## 3. Spin

The signed vector relation is `omega_a_vector = −(q/m_mu) a_mu B_vector`. Both orbital and anomalous rotations are clockwise here. The laboratory spin angle is the momentum angle **plus** the signed relative anomaly angle:

`theta_p = −pi/2 − omega_c t`

`theta_s = theta_p − omega_a t`

`omega_a = a_mu e B / m_mu`, `f_a = omega_a / (2pi)`.

The g=2 switch sets a_mu=0: the orbit and random decay continue, while ideal relative precession stops. At zero polarization, the drawn spin axis is only a reference axis; the ensemble has no preferred spin direction and no coherent energy-selected modulation.

The magic condition `a_mu − 1/(gamma_magic²−1) = 0` suppresses the ideal transverse electric-field term in anomalous precession. It does not eliminate electric focusing or every real correction. Thomas–BMT transport with electric fields or vertical pitch is not implemented; those effects are explanatory only.

## 4. Stochastic decay and energy-angle correlation

Each stored muon samples proper time `−tau0 log(1−u)`, then lab time = gamma × proper time. Decay is not scheduled at a selected spin phase. Fills use a common injection t=0 with zero bunch-time spread.

For positive muons, draw `(x, cos(theta))` from the normalized leading-order massless-electron density

`x² [(3−2x) + P cos(theta)(2x−1)]`,

with 0≤x≤1, −1≤cos(theta)≤1. Rejection sampling uses envelope 2 over the uniform rectangle. Draw the remaining azimuth uniformly in [0,2pi). The energy marginal is `2x²(3−2x)`, CDF `2x³−x⁴`, mean x=0.7. The full mean cos(theta) is P/9, and high-energy positrons prefer the positive-muon spin direction.

Resolve the rest-frame direction in longitudinal (muon momentum), transverse horizontal and vertical axes using the instantaneous relative spin phase. Then Lorentz boost along the parent momentum:

`E_lab = gamma E* (1 + beta n_long)`

`p_long = gamma E* (n_long + beta)`

`p_transverse = E* n_transverse`, `p_z = E* n_z`.

Only the positron marginal and **total invisible recoil** are modeled. Individual neutrino four-vectors are not generated. The recoil is exactly parent four-momentum minus positron four-momentum; its invariant mass squared is `m_mu² (1−x) ≥ 0`. Neutrinos produce no hits. Electron mass, radiative corrections, positron interactions and full three-body event kinematics are omitted.

There is no sine-wave overlay on the events. The energy-selected wiggle follows from Michel angles, rotating spin, the boost and the lab energy cut. The inclusive ideal population remains exponential.

An independently derived beta→1 threshold oracle uses y=E_cut/E_mu:

`C0 = 1 − 5y/3 + y³ − y⁴/3`

`C1 = y/3 − y³ + 2y⁴/3`

`Pr(pass | phase) = C0 + P C1 cos(phase)`.

The oracle is used for validation, not generation. A higher threshold raises the asymmetry while losing events; it does not guarantee better frequency precision.

## 5. Positron motion and three detector modes

A positron begins at the decay vertex with the boosted momentum. It has positive charge. In uniform B, with k=0.299792458 B and E=|p| in the massless approximation:

`theta = c k dt / E`

`x = x0 + [px sin(theta) + py (1−cos(theta))]/k`

`y = y0 + [py sin(theta) − px (1−cos(theta))]/k`

`z = z0 + c pz dt/E`.

Its transverse curvature radius is fixed. No trajectory is forced into a calorimeter.

### Ideal acceptance / closure benchmark

All stored muon decays within 0–700 μs are detected. Energy is exact; arrival time is decay time plus a fixed **20 ns modeled flight time**. Stations are assigned uniformly and explicitly labeled illustrative. The displayed helix is a physical trajectory preview; it does not assert an intersection with the assigned station. This ideal acceptance is the five-parameter fit closure target.

### Fast response

Independent base detection efficiency = 0.75. Toy energy sigma = `0.04 sqrt(E/GeV) GeV`; time sigma = 0.1 ns, independently Gaussian. Energy is clipped at zero. Flight time remains 20 ns and station assignment remains illustrative. These are chosen teaching resolutions, not claims about measured E989 performance.

### Finite geometry

24 equally spaced calorimeter planes lie at radius R_ref−0.35 m, facing radially outward. Each finite tangent rectangle has half-width 0.42 m and half-height 0.10 m. These dimensions/orientations are simplified teaching geometry, not an installed detector survey. Analytic circle/line intersections find candidate positive flight times; finite tangential and vertical coordinates must fall on the plane. The earliest valid intersection in the first transverse turn wins. With parent z=0 and monotonic positron z, later turns cannot rescue a first-turn vertical miss in these surfaces. Undetected positrons remain undetected.

Geometric detection then applies the same 75% base efficiency and toy smearing. Arrival time includes the actual helix flight time plus time noise. A shower spanning crystals is still one decay/analysis event. The crystal light distribution and analytic readout pulse are illustrative, not microscopic showers or calibrated electronics. No pile-up merging is implemented.

Two trackers use **schematic** azimuths at 7/24 and 15/24 of a turn, radius R_ref−0.17 m. The installed detector locations are approximately 180°/270°; this simplified layout is intentionally marked schematic. Each model station has eight finite module planes, separated by 6 mm radially, half-width 0.45 m and half-height 0.08 m. Each intersected module records two stereo coordinates with angles ±0.13 rad, 5 mm wire pitch, nearest-wire drift and 0.15 mm independent drift noise. The display suggests four physical stereo layers with a thinned/enlarged straw representation. It does not claim 128 microscopic straw intersections per module.

The trajectory display and tracker-tagged parent-radius plot are **truth-assisted**. No independent track fit or beam-profile reconstruction is supplied. Parent vertical coordinates are zero. Calorimeter arrival times provide the wiggle measurement.

## 6. Identifiers, reproducibility and time

The run ID hashes the sorted configuration including seed, momentum distribution, polarization, anomaly, B, detector mode and distortion inputs. Each event uses a deterministic per-index PRNG seeded by its run ID and global index. IDs include run/fill/muon; each fill has up to 1,000 generated parents. Chunking, rendering and replay cannot change generated events. Deduplication rejects other configurations and duplicate IDs.

The PRNG is a compact 32-bit teaching generator, not a cryptographic or collaboration production RNG. All scalar random inputs and distributions are explicit in source. Fits use all selected records, while 3D renders one selected muon and a bounded trajectory preview; scatter plots show at most 1,800 deterministic representative entries.

Physical state is evaluated at a physical time, never advanced by a frame-count integrator. Playback maps elapsed wall time to μs using the chosen speed. A co-moving camera makes the relative spin angle readable. There is no independently phase-exaggerated spin. Orbit motion sampled at screen refresh can visibly alias; pause, scrub or use the co-moving view. Playback starts paused and has no autoplay; reduced-motion CSS avoids transitions.

## 7. Poisson likelihood and uncertainty

The fitter imports only numerical random utilities and receives measured arrival times or a histogram plus an explicit optional efficiency correction. It never receives the injected anomaly, field, parent momentum or true frequency.

The rate is `N0 exp(−t/tau) [1 + A cos(omega t + phi)]`. Counts use 0.5 μs bins over the declared measured-arrival window (default 30–650 μs). Every bin, including zeros, contributes `mu_i − n_i log(mu_i)` to the negative log likelihood. Expectations integrate the rate analytically over the actual edges, including a shortened final bin.

N0 is analytically profiled at each trial, not fixed. The remaining four parameters are optimized in `(log(tau), c, s, omega)`, where `c=A cos(phi)`, `s=−A sin(phi)`. Exponential-only Poisson fitting initializes lifetime from observations. A broad 0.2–3.5 rad/μs scan ranks observed Fourier content; ten starts separated by ≥0.045 rad/μs feed Nelder–Mead optimization. Bounds are 10<tau<200 μs and A<0.95. Lifetime is free.

The fit rejects fewer than 600 selected entries, unresolved separated frequency solutions within delta NLL<4, optimizer failures, boundary solutions, weak improvement over the no-oscillation model (2 delta NLL<35), and A/error(A)<4. These are conservative teaching quality cuts, not a rigorously calibrated detection-significance test.

A finite-difference **observed likelihood Hessian** in all five reported parameters is required to be positive definite, then inverted to obtain covariance and correlations. Nonfinite or unreasonably large frequency errors are rejected. Uncertainties are local asymptotic statistical errors. Numerical and small-ensemble tests support their use in the stated ideal benchmark, not arbitrary detector settings.

The fixed flight delay shifts fitted phase and normalization; the fit never substitutes decay truth for observed arrival time. The default lower bound is well beyond the flight delay. Momentum spread creates a lifetime mixture. Geometric acceptance, variable flight, gain drift and smearing can depart from the ideal model; such fits are visibly labeled exploratory even if a goodness-of-fit diagnostic passes. There is no claimed geometric-model frequency closure.

Goodness of fit reports Poisson deviance, nominal degrees of freedom and a 99% fixed-parameter Poisson reference from 160 seeded draws. This reference samples counts from fitted means without refitting parameters; it is explicitly **not a calibrated fit p-value**. Sparse late-time bins make a naive deviance/ndf interpretation inappropriate. Pearson residuals and their frequency spectrum are diagnostics only, not Gaussian fitting inputs or significance estimates. Phase folding compares raw counts with model counts integrated in 20 subbins per original bin.

## 8. Implemented distortions

- Early efficiency: multiply base efficiency by `1−d exp(−t_decay/80 μs)`, d∈[0,0.6]. The optional corrected fit uses the known input d and declared 20 ns flight delay, giving an exact integral as the difference of two exponential-cosine integrals. It is exact for ideal mode and an approximation with fast time smearing; it is not a full geometric correction. Baseline and corrected fits reuse identical observations.
- Gain: multiply true deposit energy by `1+h exp(−t_decay/80 μs)` before smearing/thresholding, h∈[−0.2,0.2]. No corrected gain-drift rate model is supplied. Result warnings retain this unmodeled-bias limitation.
- Field common offset/correction/uncertainty: quantitative and separate from detector generation.

Pile-up, dead-time electronics, lost-muon time evolution, CBO, material transport, nonuniform fields and precision experimental corrections are documented future extensions, not hidden or decorative working controls.

## 9. Separate field measurement and extraction

A separate seeded normal stream generates 48 uniform-field readings:

`B_i = B_true [1 + (injected_common_offset_ppm + noise_ppm Z_i) × 10⁻⁶]`.

These are calibrated direct-tesla toy observations, with default independent noise 30 ppm. They are not NMR readings. The simulation does not mix free-proton and shielded-proton constants. Trolley mapping is a separate displayed operation, with muon generation blocked while the trolley occupies the aperture.

The estimate is the sample mean divided by `1+applied_correction_ppm ×10⁻⁶`. Its independent standard error is the sample standard deviation divided by sqrt(n) and the same calibration factor. A common relative calibration uncertainty (default 20 ppm) is added separately in quadrature and is never divided by sqrt(n). An uncorrected injected offset is a bias, not statistical noise.

The uniform assumption justifies averaging probe locations. No claim is made about nonuniform muon-weighted fields; the real experiment needs mapping, monitoring, calibration transfer, muon weighting and corrections.

`a_mu = m_mu [omega_fit ×10⁶ rad/s per rad/μs] / (e B_measured)`.

`g_mu−2 = 2a_mu`, `g_mu = 2(1+a_mu)`.

Frequency, independent field-noise and common-calibration contributions are shown separately. For independent inputs their relative variances add. Muon-mass uncertainty is neglected at the sample sizes supported by this app. Model mismatch is not silently absorbed into this statistical covariance; an exploratory-result warning remains. No modest browser sample is represented as collaboration-level precision.
