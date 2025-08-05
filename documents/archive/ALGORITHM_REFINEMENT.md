I want to determine an algorithm that, given a lat/long and a date, can provide:

- the best time to observe the Galactic Center of the Milky Way
- a rating from 1 to 4 of how good the observation condition are on that date

The factors to consider are:

- the start of the astronomical night (`nightStart`)
- the end of the astronomical night (`nightEnd`)
- the moon rise time (`moonRise`) (could be the next day)
- the moon set time (`moonSet`) (could be the next day)
- the moon phase (`moonPhase`) and/or moon illumination (`moonIllumination`)
- the time at which the Galactic Center is above the horizon
  (`galacticCenterRise`)
- the time at which the Galactic Center sets below the horizon
  (`galacticCenterSet`)
- the angle between the Galactic Center and the moon (`galacticCenterMoonAngle`)
  at a given time

Given this:

- a longer observation window (between `galacticCenterRise` and
  `galacticCenterSet`) is better. 4h30 is probably the maximum. If the
  observation window is less than 30minutes, the rating should be 0.
- a higher moon illumination is worse.
- a smaller angle between the Galactic Center and the moon is worse, if the
  illumination is greater than 0
- a minimal angle of 90deg is desirable, which is slightly wider than the 84def
  angle of view of a 24mm lense
- the score probably needs to be integrated over the observation window, since
  it should depend on `galacticCenterMoonAngle` and `moonIllumination`. This of
  course can be simplified if the illumination is 0 (in which case the moon is
  not visible) or greater than 60% (in which case the moon is very bright and
  the angle does not matter much)
- the rating should be 0 for no visible galactic core, 1 for very bad
  conditions, 2 for bad conditions, 3 for good conditions and 4 for very good
  conditions

---

Let's refine the algorithm for scoring the best time to observe the Galactic
Center, the optimal time for observation, duration of the observation window.

````js
/**
 * Galactic Center Observation Scoring Algorithm
 * ----------------------------------------------
 *
 * PURPOSE:
 * --------
 * Given a date, latitude, longitude, and astronomical data (night start/end,
 * moon rise/set/illumination, Galactic Center rise/set, and functions to get
 * altitudes and angular separations), this algorithm calculates:
 *   1. The BEST time to observe the Galactic Center.
 *   2. A RATING (0–4) indicating observation quality:
 *      0 - Not visible or <30 min window
 *      1 - Very bad
 *      2 - Bad
 *      3 - Good
 *      4 - Very good
 *   3. A time-series "visibility curve" for plotting/debugging.
 *
 * FACTORS CONSIDERED:
 * -------------------
 * 1. Night window:
 *    - Defined by astronomical twilight (sun at -18°).
 *    - If not achieved (high latitudes in summer), returns 0.
 *    - If latitude > ~61° N/S, GC never visible → returns 0.
 *
 * 2. Galactic Center window:
 *    - From GC rise to GC set.
 *    - Only times when GC altitude ≥ 15° are considered usable.
 *
 * 3. Moon effects:
 *    - Moon above horizon → reduces score.
 *    - Bright moon (illumination > 60%): angle to GC is less important.
 *    - Faint moon (illumination ≤ 60%): larger angular separation from GC is better.
 *    - Ideal separation: ≥ 90° (slightly wider than a 24mm lens FoV).
 *
 * 4. Observation window length:
 *    - Maximum useful window = 4.5 hours (270 min).
 *    - Score is multiplied by (window length / max window), capped at 1.0.
 *
 * 5. Rating thresholds (after window-length scaling):
 *    - <0.20 → rating 1
 *    - <0.40 → rating 2
 *    - <0.70 → rating 3
 *    - ≥0.70 → rating 4
 *
 * ALGORITHM OVERVIEW:
 * -------------------
 * 1. Determine overlap between:
 *       [nightStart, nightEnd] ∩ [gcRise, gcSet]
 *
 * 2. If overlap < 30 min → rating = 0.
 *
 * 3. Integrate a "visibility score" across the observation window:
 *       - Score(t) = 1.0 if moon below horizon
 *       - Score(t) = f(moonIllumination, moon–GC angle) otherwise
 *
 * 4. Variable-step integration for performance:
 *       - First 30 min: small step (2 min)
 *       - Middle: large step (8 min)
 *       - Last 30 min: small step (2 min)
 *    Weight samples by step size so averages are correct.
 *
 * 5. Track:
 *       - `accumulatedScore` = sum(score * stepMinutes)
 *       - `bestTime` = time with max score
 *       - `curve[]` = array of {time, score, altitudeGC, moonAlt, moonAngle}
 *
 * 6. Compute:
 *       avgScore = accumulatedScore / totalMinutes
 *       finalScore = avgScore * lengthMultiplier
 *       rating = map finalScore to 0–4 scale
 *
 * OUTPUT:
 * -------
 * {
 *   bestTime: Date | null, // Time of peak score
 *   rating: number,        // 0–4
 *   curve: VisibilitySample[] // for plotting/debugging
 * }
 *
 * USAGE:
 * ------
 * - Provide `gcAltitude(t)`, `moonAltitude(t)`, `gcMoonAngle(t)` functions
 *   returning instantaneous values in degrees for given Date.
 * - Call once per night per location/date to precompute results.
 * - Use `curve` for plotting quality vs time.
 */

type ObservationInputs = {
  latitude: number;
  longitude: number;
  date: Date;
  nightStart: Date | null;
  nightEnd: Date | null;
  moonRise: Date | null;
  moonSet: Date | null;
  moonIllumination: number; // 0.0 - 1.0
  gcRise: Date | null;
  gcSet: Date | null;
  gcAltitude: (time: Date) => number; // degrees
  moonAltitude: (time: Date) => number; // degrees
  gcMoonAngle: (time: Date) => number; // degrees
};

type VisibilitySample = {
  time: Date;
  score: number;
  altitudeGC: number;
  moonAlt: number;
  moonAngle: number;
};

export function computeGCObservationScore(
  inputs: ObservationInputs
): {
  bestTime: Date | null;
  rating: number; // 0-4
  curve: VisibilitySample[];
} {
  const {
    latitude,
    nightStart,
    nightEnd,
    moonIllumination,
    gcRise,
    gcSet,
    gcAltitude,
    moonAltitude,
    gcMoonAngle
  } = inputs;

  const curve: VisibilitySample[] = [];

  // GC never visible for lat > 61°N or < -61°S
  if (Math.abs(latitude) > 61) {
    return { bestTime: null, rating: 0, curve };
  }

  // No astronomical night
  if (!nightStart || !nightEnd) {
    return { bestTime: null, rating: 0, curve };
  }

  // No GC rise/set data
  if (!gcRise || !gcSet) {
    return { bestTime: null, rating: 0, curve };
  }

  // Intersection of night and GC visibility
  let windowStart = new Date(Math.max(nightStart.getTime(), gcRise.getTime()));
  let windowEnd = new Date(Math.min(nightEnd.getTime(), gcSet.getTime()));

  // Check window length
  const windowLengthMin = (windowEnd.getTime() - windowStart.getTime()) / 60000;
  if (windowLengthMin < 30) {
    return { bestTime: null, rating: 0, curve };
  }

  // Integration parameters
  const edgeSpan = 30; // minutes
  const smallStep = 2; // minutes
  const largeStep = 8; // minutes

  type Segment = { start: Date; end: Date; step: number };
  const segments: Segment[] = [];

  const pushSegment = (start: Date, end: Date, step: number) => {
    if (end > start) segments.push({ start, end, step });
  };

  const addMinutes = (d: Date, m: number) => new Date(d.getTime() + m * 60000);

  pushSegment(windowStart, addMinutes(windowStart, edgeSpan), smallStep);
  pushSegment(
    addMinutes(windowStart, edgeSpan),
    addMinutes(windowEnd, -edgeSpan),
    largeStep
  );
  pushSegment(addMinutes(windowEnd, -edgeSpan), windowEnd, smallStep);

  let accumulatedScore = 0;
  let totalMinutes = 0;
  let bestTime: Date | null = null;
  let bestScore = -Infinity;

  for (const seg of segments) {
    for (let t = seg.start; t <= seg.end; t = addMinutes(t, seg.step)) {
      const altitudeGC = gcAltitude(t);
      if (altitudeGC < 15) continue; // Altitude cutoff

      const moonAlt = moonAltitude(t);
      const angle = gcMoonAngle(t);
      let score: number;

      if (moonAlt <= 0) {
        score = 1.0; // perfect: moon not visible
      } else {
        if (moonIllumination > 0.6) {
          score = (1 - moonIllumination) * 0.2;
        } else {
          const angleFactor = Math.min(angle / 90, 1.0);
          score = (1 - moonIllumination) * angleFactor;
        }
      }

      // Record the sample for curve plotting
      curve.push({
        time: new Date(t),
        score,
        altitudeGC,
        moonAlt,
        moonAngle: angle
      });

      accumulatedScore += score * seg.step;
      totalMinutes += seg.step;

      if (score > bestScore) {
        bestScore = score;
        bestTime = t;
      }
    }
  }

  if (totalMinutes === 0) return { bestTime: null, rating: 0, curve };

  let avgScore = accumulatedScore / totalMinutes;

  // Window length multiplier
  const maxWindow = 270; // 4.5 hours
  const lengthMultiplier = Math.min(windowLengthMin / maxWindow, 1);
  const finalScore = avgScore * lengthMultiplier;

  // Map to rating
  let rating: number;
  if (windowLengthMin < 30) rating = 0;
  else if (finalScore < 0.2) rating = 1;
  else if (finalScore < 0.4) rating = 2;
  else if (finalScore < 0.7) rating = 3;
  else rating = 4;

  return { bestTime, rating, curve };
}

```;
````
