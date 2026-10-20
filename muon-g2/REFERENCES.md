# Muon g−2 scientific reference checks

Prepared 20 October 2026. These notes support an independent educational simulation, not an official E989 application or precision result.

## Positive-muon decay: checked sign and normalization

The requested positive-muon sign is correct. Fermilab thesis 2023-12, chapter 2, equations 2.13–2.15 (PDF pages 39–40), writes the angular factor with a plus sign, with energy-dependent asymmetry `(2x−1)/(3−2x)`. Thus energetic positrons prefer the positive-muon spin direction. The thesis uses a proportional distribution; the normalized joint density requested by the user is

`f(x,u) = x²[(3−2x)+P u(2x−1)]`, with `0≤x≤1`, `−1≤u≤1`.

Source: [Fermilab thesis, experimental technique](https://lss.fnal.gov/archive/thesis/2000/fermilab-thesis-2023-12.pdf).

Independent analytic checks:

- Integrating over `u` gives `f_x(x)=2x²(3−2x)`. Its integral is exactly one.
- The energy CDF is `2x³−x⁴`, and its mean is `7/10`.
- `E[u|x]=P(2x−1)/[3(3−2x)]`; its sign changes at `x=1/2`.
- The full angular marginal is `(1+P u/3)/2`; `E[u]=P/9`.
- Uniform rest-frame azimuth contributes a separate factor `1/(2π)`.
- At `P=0`, the distribution loses all dependence on spin. The inclusive decay rate remains exponential for every polarization.
- The positive sign refers to `mu+` and the angle to its rest-frame polarization. Do not reuse the electron-from-`mu−` sign.

Useful independent ultrarelativistic oracle, **derived here**: write `y=E_lab/E_mu` and neglect `1−β`. After azimuth integration the lab spectrum is

`dP/dy = (5/3−3y²+4y³/3) + P cos(ψ)(−1/3+3y²−8y³/3)`,

where `ψ` is the spin–momentum angle. Above threshold `y0`,

`Pr(y>y0) = C0(y0)+P cos(ψ) C1(y0)`,

`C0=1−5y0/3+y0³−y0⁴/3`,

`C1=y0/3−y0³+2y0⁴/3`.

Thus ideal threshold asymmetry is `P C1/C0`; at zero threshold `C1=0`. This is an analytic validation oracle, not a replacement for generating energy and direction jointly. Finite-β generation should agree approximately, not bit-for-bit, with this β=1 formula.

## Installed detector layout

[Straw detector paper, arXiv:2111.02076v3](https://arxiv.org/html/2111.02076v3), sections 2.1, 3 and 7, establishes two installed stations, near 180° and 270° from injection (figure 2 places them just downstream). They are inside the vacuum chamber, radially inside the circulating beam, upstream of calorimeters. Each has eight modules, each with four layers of 32 straws at stereo angles ±7.5°. The paper's top view has clockwise positive-muon circulation. A display may use these approximate azimuths but must label its other unvalidated dimensions schematic.

[Calorimeter paper, arXiv:1905.04407v2](https://arxiv.org/pdf/1905.04407), sections 2–3 and figure 21, supports 24 stations and 54 PbF₂ Cherenkov crystals per station in nine columns and six rows, with SiPM readout. Calorimeters sit inside the orbit against the scalloped chamber. Their measured performance is not automatically the performance of a toy smearing model. State chosen toy resolution explicitly. The paper identifies pileup and gain stability as relevant rate-analysis complications.

Do not model trackers as an enclosing cylinder. A positron helix in a uniform magnetic field has constant curvature radius: colloquial “spiral inward” in apparatus prose must not become shrinking numerical radius. There are no detector hits from neutrinos.

## Orbital and spin conventions

[Precession analysis, arXiv:2104.03247v1](https://arxiv.org/html/2104.03247v1), introduction and equations 1–4, supports the energy-selected exponential oscillation and the signed relation `ω_a = −(q/m)a B` for transverse uniform-field motion. Equation 4 includes electric-field and pitch terms; setting `a−1/(γ²−1)=0` removes the ideal electric contribution to relative precession, not electric focusing.

Keep angular frequency and cyclic frequency distinct: `f=ω/(2π)`. For a horizontal orbit the laboratory spin angular velocity is the orbital angular velocity plus the relative spin angular velocity. A g=2 toggle removes only the latter. With Cartesian B along +z, a positive particle initially moving +y at +x rotates clockwise as seen from +z. If the renderer uses y as up, map this physical coordinate system explicitly.

Pure magnetic force preserves energy. For finite perpendicular momentum, `R=p_perp/(0.299792458 |q/e| B)` in metres, GeV/c and tesla. With pitch absent, `p_perp=p`.

## Internally consistent constants and scales

Reference constants: [NIST CODATA 2022 complete table](https://physics.nist.gov/cuu/Constants/Table/allascii.txt). Use `c=299792458 m/s`, `e=1.602176634e−19 C`, and `m_mu c²=105.6583755 MeV`. Derive `m_mu=1.8835316270491198e−28 kg` from these values rather than independently rounding it.

A consistent choice `p=3.094 GeV/c`, `R=7.112 m` gives the following values, independently calculated from the equations above:

| Quantity | Value |
|---|---:|
| Derived field B | 1.45113513856 T |
| Lorentz factor | 29.30012455 |
| Orbital period | 149.1433863 ns |
| Injected teaching anomaly | 0.001165920 |
| Anomalous angular frequency | 1.439176594 rad/µs |
| Anomalous cyclic frequency | 229.052069 kHz |
| Anomalous period | 4.365819547 µs |
| Boosted lifetime using 2.1969811 µs rest lifetime | 64.37181986 µs |

The anomaly is a simulation input; these notes make no current theory-versus-experiment claim. A rounded teaching rest lifetime of 2.197 µs is also adequate if used consistently. NIST’s optional **free-proton** angular gyromagnetic ratio is `2.6752218708e8 s⁻¹ T⁻¹`; its frequency counterpart is `42.577478461 MHz/T`.

## Separate field measurement and interpretation

[Field analysis, arXiv:2104.03201v2](https://arxiv.org/html/2104.03201v2), sections I.2, III–VII: the experiment calibrates to a shielded proton in a spherical water reference at a specified temperature. Trolley maps sample the storage region; the trolley is withdrawn for muon data collection. Fixed probes follow field variations between trolley maps. The field relevant to the anomaly is weighted by the stored-muon distribution, with further acceptance/time considerations. The application's uniform-field arithmetic mean is justified only for its explicitly uniform lesson.

For a direct SI teaching extraction, use `a=m ω_a/(e B_measured)`. An optional free-proton route can use `ω_p=γ_p B`, then `a=(ω_a/ω_p)mγ_p/e`; label it free proton throughout. Do not combine that γ with shielded-proton frequencies.

For independent frequency and field inputs, derive `σ_a²/a²=σ_ω²/ω²+σ_B²/B²`. If probes have known independent noise σ and a shared calibration uncertainty σ_cal, their mean uncertainty is `sqrt(σ²/n+σ_cal²)`: the shared term never divides by sqrt(n). A deliberately injected offset is a bias unless the declared calibration corrects it; an assigned calibration uncertainty is a separate quantity.

## Fit limitations and source roles

The basic five-parameter model is a closure target for an ideal time-independent acceptance. Geometry, variable flight time, gain drift and beam motion can alter the observed rate. Retain measured arrival times and expose model mismatch. A constant flight delay shifts phase/normalization; a distribution correlated with energy or spin may do more.

The precession paper's equations 26–31 demonstrate that experimental acceptance and beam-motion corrections can change normalization, asymmetry and phase. Its precision and correction values are not specifications for this app.

[Run 2/3 result, arXiv:2308.06230](https://arxiv.org/abs/2308.06230) is a historical primary reference for the analysis chain and correction categories, not a claim to be today's latest result.

[Technical Design Report, arXiv:1501.06858](https://arxiv.org/abs/1501.06858) supplies design context; use the installed tracker publication for station count. [Fermilab explanation](https://muon-g-2.fnal.gov/how-does-muon-g-2-work.html) supplies accessible context. These latter references were checked for identity and role; numerical implementation should prefer the detailed publications and analytic checks above.

## Lifetime and source versions

- [Particle Data Group, muon properties](https://pdg.lbl.gov/2024/listings/rpp2024-list-muon.pdf): lifetime 2.1969811 μs used as a fixed teaching input. This document's historical edition is identified deliberately; no latest-value claim is made.
- Numerical implementation constants are centralized in `app/constants.js`; SI muon mass is derived from the chosen mass energy, exact charge and c.
- Three.js 0.170.0 is distributed locally with its original MIT license. It is a rendering library, not a physics source.

## Coordinate clarification

The implementation starts a positive muon at +x moving **−y**, with B along +z. This gives the equilibrium circular orbit centered at the origin and clockwise circulation. An initial +y velocity at +x would require a different circle center; it is not the implemented stored-orbit state.
