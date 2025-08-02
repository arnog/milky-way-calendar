import { Location } from "../types/astronomy";
import { 
  computeGCObservationScore,
  createGCAltitudeFunction,
  createMoonAltitudeFunction,
  createGCMoonAngleFunction,
  VisibilitySample
} from "./gcObservationScoring";

export interface IntegratedOptimalWindow {
  startTime: Date | null;
  endTime: Date | null;
  duration: number; // in hours
  averageScore: number; // 0.0 - 1.0
  bestTime: Date | null;
  description: string;
  qualityPeriods: QualityPeriod[];
}

export interface QualityPeriod {
  start: Date;
  end: Date;
  duration: number; // hours
  averageScore: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

/**
 * Calculate observation window boundaries based on time-integrated visibility scoring
 * This finds periods where viewing conditions are actually good, not just when
 * GC and darkness overlap.
 */
export function calculateIntegratedOptimalWindow(
  location: Location,
  date: Date,
  nightStart: Date | null,
  nightEnd: Date | null,
  moonRise: Date | null,
  moonSet: Date | null,
  moonIllumination: number,
  gcRise: Date | null,
  gcSet: Date | null,
  scoreThreshold: number = 0.5 // Minimum score for "good" viewing
): IntegratedOptimalWindow {
  
  if (!nightStart || !nightEnd || !gcRise || !gcSet) {
    return {
      startTime: null,
      endTime: null,
      duration: 0,
      averageScore: 0,
      bestTime: null,
      description: "No viewing opportunity available",
      qualityPeriods: []
    };
  }

  // Get the full scoring analysis
  const gcAltitude = createGCAltitudeFunction(location);
  const moonAltitude = createMoonAltitudeFunction(location);
  const gcMoonAngle = createGCMoonAngleFunction(location);

  const scoringResult = computeGCObservationScore({
    latitude: location.lat,
    longitude: location.lng,
    date,
    nightStart,
    nightEnd,
    moonRise,
    moonSet,
    moonIllumination,
    gcRise,
    gcSet,
    gcAltitude,
    moonAltitude,
    gcMoonAngle
  });

  if (scoringResult.curve.length === 0) {
    return {
      startTime: null,
      endTime: null,
      duration: 0,
      averageScore: 0,
      bestTime: null,
      description: "No viable observation time",
      qualityPeriods: []
    };
  }

  // Find continuous periods above threshold
  const qualityPeriods = findQualityPeriods(scoringResult.curve, scoreThreshold);
  
  if (qualityPeriods.length === 0) {
    // No periods above threshold - find best available period
    const bestPeriod = findBestAvailablePeriod(scoringResult.curve);
    if (bestPeriod) {
      return {
        startTime: bestPeriod.start,
        endTime: bestPeriod.end,
        duration: bestPeriod.duration,
        averageScore: bestPeriod.averageScore,
        bestTime: scoringResult.bestTime,
        description: `Limited viewing opportunity (${bestPeriod.quality})`,
        qualityPeriods: [bestPeriod]
      };
    }
    
    return {
      startTime: null,
      endTime: null,
      duration: 0,
      averageScore: 0,
      bestTime: null,
      description: "Poor viewing conditions throughout",
      qualityPeriods: []
    };
  }

  // Find the best quality period (highest average score * duration)
  const primaryPeriod = qualityPeriods.reduce((best, current) => {
    const bestWeight = best.averageScore * best.duration;
    const currentWeight = current.averageScore * current.duration;
    return currentWeight > bestWeight ? current : best;
  });

  const totalDuration = qualityPeriods.reduce((sum, p) => sum + p.duration, 0);
  const weightedAverageScore = qualityPeriods.reduce((sum, p) => sum + p.averageScore * p.duration, 0) / totalDuration;

  return {
    startTime: primaryPeriod.start,
    endTime: primaryPeriod.end,
    duration: primaryPeriod.duration,
    averageScore: weightedAverageScore,
    bestTime: scoringResult.bestTime,
    description: `${primaryPeriod.quality.charAt(0).toUpperCase() + primaryPeriod.quality.slice(1)} viewing window`,
    qualityPeriods
  };
}

function findQualityPeriods(curve: VisibilitySample[], threshold: number): QualityPeriod[] {
  const periods: QualityPeriod[] = [];
  let currentPeriodStart: Date | null = null;
  let currentPeriodSamples: VisibilitySample[] = [];

  for (const sample of curve) {
    if (sample.score >= threshold) {
      // Start or continue a quality period
      if (!currentPeriodStart) {
        currentPeriodStart = sample.time;
        currentPeriodSamples = [sample];
      } else {
        currentPeriodSamples.push(sample);
      }
    } else {
      // End current period if it exists
      if (currentPeriodStart && currentPeriodSamples.length > 0) {
        const period = createQualityPeriod(currentPeriodStart, currentPeriodSamples);
        if (period.duration >= 0.25) { // At least 15 minutes
          periods.push(period);
        }
        currentPeriodStart = null;
        currentPeriodSamples = [];
      }
    }
  }

  // Handle period extending to end of curve
  if (currentPeriodStart && currentPeriodSamples.length > 0) {
    const period = createQualityPeriod(currentPeriodStart, currentPeriodSamples);
    if (period.duration >= 0.25) {
      periods.push(period);
    }
  }

  return periods;
}

function findBestAvailablePeriod(curve: VisibilitySample[]): QualityPeriod | null {
  if (curve.length === 0) return null;
  
  // Find the continuous period with highest average score
  let bestPeriod: QualityPeriod | null = null;
  let bestWeight = 0;
  
  // Try different minimum durations
  for (const minDuration of [0.25, 0.5, 1.0]) {
    const period = findBestPeriodWithMinDuration(curve, minDuration);
    if (period) {
      const weight = period.averageScore * period.duration;
      if (weight > bestWeight) {
        bestWeight = weight;
        bestPeriod = period;
      }
    }
  }
  
  return bestPeriod;
}

function findBestPeriodWithMinDuration(curve: VisibilitySample[], minDurationHours: number): QualityPeriod | null {
  let bestPeriod: QualityPeriod | null = null;
  let bestScore = 0;
  
  const minSamples = Math.max(1, Math.floor(minDurationHours * 60 / 8)); // Assume 8-minute avg step
  
  for (let i = 0; i <= curve.length - minSamples; i++) {
    for (let j = i + minSamples - 1; j < curve.length; j++) {
      const samples = curve.slice(i, j + 1);
      const period = createQualityPeriod(samples[0].time, samples);
      
      if (period.duration >= minDurationHours && period.averageScore > bestScore) {
        bestScore = period.averageScore;
        bestPeriod = period;
      }
    }
  }
  
  return bestPeriod;
}

function createQualityPeriod(start: Date, samples: VisibilitySample[]): QualityPeriod {
  const end = samples[samples.length - 1].time;
  const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
  const averageScore = samples.reduce((sum, s) => sum + s.score, 0) / samples.length;
  
  let quality: 'excellent' | 'good' | 'fair' | 'poor';
  if (averageScore >= 0.8) quality = 'excellent';
  else if (averageScore >= 0.6) quality = 'good';
  else if (averageScore >= 0.4) quality = 'fair';
  else quality = 'poor';
  
  return {
    start,
    end,
    duration,
    averageScore,
    quality
  };
}