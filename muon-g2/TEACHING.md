# A short teaching guide

Allow approximately 30–45 minutes. Begin with the seeded example, an ideal-acceptance benchmark. Ask the learner to identify the status of each number: input, generated truth, toy measurement or fitted estimate.

## Guided route

1. **Ring & decay:** find the μ⁺, pointed p arrow and ring-ended S arrow. The momentum rotates around the ring; spin accumulates an additional relative phase. Use the co-moving view. Pause and scrub physical time. The selected event is one member of the full generated sample; its future positron path can be inspected before replay reaches decay.
2. **Detectors:** open the 54-crystal close-up, then the two-station tracker description. Inspect the event's parent, decay, energy, measured time and selection. Ideal/fast station numbers are illustrative. Only geometric mode claims physical detector intersections.
3. **Data & wiggle fit:** fit 30–650 μs at 1.8 GeV. The default plot zooms to 160 μs but fits the full window. Read omega and its uncertainty, then divide by 2pi to get cyclic frequency. Inspect the frequency–phase correlation and residuals before revealing truth.
4. **Field & g−2:** take an independent field measurement. Explain why arrival times alone do not determine the anomaly. Verify that `g−2` is twice `a`, while `g` includes the leading 2.

## Six executable exercises

### 1. Why g = 2 matters

Press the first lesson button. It generates a new 100,000-parent sample with a=0. Replay in the co-moving view. Spin and momentum stay aligned, but muons still orbit and decay. The fit should reject a frequency estimate because there is no oscillatory information. This is not a measurement of omega with zero uncertainty. Restore the seeded example to compare.

### 2. Why polarization matters

Press the second lesson. A new unpolarized sample still has exponentially distributed decays and energetic positrons, but no coherent modulation. A random reference spin direction is not a polarized ensemble. Discuss why a noisy curve can always contain accidental Fourier peaks and why a fit must sometimes refuse a number.

### 3. Why select energetic positrons

In Data, compare thresholds 0, 1.4, 1.8, 2.2 and 2.6 GeV, refitting after each change. These are analysis changes to the same events. Record selected counts, A, omega and sigma(omega). At zero threshold, ideal inclusive decays have no coherent wiggle. At very high threshold, asymmetry grows but counts fall. Use the comparison button for current, higher-threshold and later-window fits. These comparisons share observations and are correlated.

### 4. More data

Fit a sample, then add 100,000 generated muons and refit without changing threshold or window. Uncertainty should usually decrease approximately with sqrt(N); the physical frequency has not changed. A particular estimate may move within its statistical errors. Do not demand exact sqrt scaling from one realization. The app limits a dataset to 300,000 parents.

### 5. Why the magnetic field matters

Keep the positron data and fit fixed. Take field readings. Change the **applied calibration correction** by +1,000 ppm. This reduces corrected B and increases inferred a. Separately inject a common offset into a newly generated probe sample and compare with/without the matching correction. Increase common uncertainty to 1,000 ppm to make the field error dominate the browser-sized positron sample. Adding positrons cannot reduce a common field-calibration error.

### 6. Find a hidden bias

Press lesson 6 to generate an ideal sample with a 60% early-efficiency deficit. Inspect the deliberately incomplete baseline fit and residuals. Its fitted lifetime can be biased even when the frequency shift is small. Check “Correct known early-efficiency loss” and refit the same arrivals. Compare deviance and lifetime in the result/history. The correction uses an externally declared known shape, not a parameter inferred by magic from hidden data.

For a second example, apply a gain drift and fixed measured-energy cut. The app has no validated gain-corrected model; discuss the persistent bias warning. A satisfactory deviance check alone cannot prove absence of bias.

## Questions for discussion

- Why is the orbital period far shorter than the anomalous period?
- Why does the inclusive decay probability not oscillate?
- Why are the calorimeters inside the orbit instead of intercepting the muon beam every turn?
- Why is a geometric sample not automatically described exactly by the ideal five-parameter model?
- Which calibration error averages down with more probes, and which does not?
- Why is an energy resolution a property of the chosen toy detector rather than a measured performance claim?
- Why does successful closure against one model not validate all detector settings or statistical coverage?

Use the exported event JSON to trace a selected count back to one parent and one decay. A multi-crystal display still supplies one event, not 54 independent decays.
