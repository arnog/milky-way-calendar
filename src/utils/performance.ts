/**
 * Performance optimization utilities for the Milky Way Calendar application
 *
 * This module provides tools to measure, optimize, and manage performance-critical operations:
 *
 * 1. PerformanceMonitor - Singleton class for measuring operation durations
 *    - Only active in development mode
 *    - Warns about operations slower than 16ms (60fps threshold)
 *    - Used to track zoom operations and image loading performance
 *
 * 2. throttle() - Limits function execution frequency
 *    - Used for mouse wheel zoom events (throttled to ~60fps)
 *    - Prevents performance issues from rapid scrolling
 *
 * 3. debounce() - Delays execution until after calls stop
 *    - Used for window resize handling
 *    - Prevents excessive image reloading during resizing
 *
 * 4. memoize() - Caches function results with LRU eviction
 *    - Configurable cache size limit (default 100)
 *    - Available for caching expensive calculations
 *
 * 5. scheduleWork() - Priority-based callback scheduling
 *    - high: Immediate execution
 *    - normal: Next animation frame (requestAnimationFrame)
 *    - low: Idle time execution (requestIdleCallback)
 *
 * 6. BatchProcessor - Groups multiple updates into single frames
 *    - Prevents layout thrashing
 *    - Optimizes DOM update performance
 *
 * Created during Phase 4 of the WorldMap refactoring to ensure smooth 60fps performance.
 */

export interface PerformanceMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  name: string;
  metadata?: Record<string, unknown>;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private isEnabled: boolean = import.meta.env.DEV;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMeasurement(name: string, metadata?: Record<string, unknown>): void {
    if (!this.isEnabled) return;

    const startTime = performance.now();
    this.metrics.set(name, {
      name,
      startTime,
      metadata,
    });
  }

  endMeasurement(name: string): PerformanceMetrics | null {
    if (!this.isEnabled) return null;

    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance measurement '${name}' was not started`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    const completedMetric: PerformanceMetrics = {
      ...metric,
      endTime,
      duration,
    };

    // Log slow operations
    if (duration > 16) {
      // Slower than 60fps
      console.warn(
        `Slow operation detected: ${name} took ${duration.toFixed(2)}ms`,
        completedMetric,
      );
    }

    this.metrics.delete(name);
    return completedMetric;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  measureFunction<T extends (...args: any[]) => any>(
    name: string,
    fn: T,
    metadata?: Record<string, unknown>,
  ): T {
    if (!this.isEnabled) return fn;

    return ((...args: Parameters<T>) => {
      this.startMeasurement(name, metadata);
      try {
        const result = fn(...args);

        // Handle async functions
        if (result instanceof Promise) {
          return result.finally(() => {
            this.endMeasurement(name);
          });
        }

        this.endMeasurement(name);
        return result;
      } catch (error) {
        this.endMeasurement(name);
        throw error;
      }
    }) as T;
  }

  getAllMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  clearMetrics(): void {
    this.metrics.clear();
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
}

// Throttle function for performance optimization
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): T {
  let inThrottle: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  } as T;
}

// Debounce function for performance optimization
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean,
): (...args: Parameters<T>) => void {
  let timeout: number | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any, ...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };

    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

// Memoization utility with size limit
export function memoize<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  keyGenerator?: (...args: TArgs) => string,
  maxSize: number = 100,
): (...args: TArgs) => TReturn {
  const cache = new Map<string, { value: TReturn; timestamp: number }>();

  return (...args: TArgs): TReturn => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    const cached = cache.get(key);

    if (cached) {
      // Move to end (LRU)
      cache.delete(key);
      cache.set(key, cached);
      return cached.value;
    }

    const result = fn(...args);

    // Evict oldest entries if cache is full
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }

    cache.set(key, { value: result, timestamp: Date.now() });
    return result;
  };
}

// Frame scheduling utility for smooth animations
export function scheduleWork(
  callback: () => void,
  priority: "high" | "normal" | "low" = "normal",
): void {
  const runCallback = () => {
    callback();
  };

  switch (priority) {
    case "high":
      // Run immediately
      runCallback();
      break;
    case "normal":
      // Schedule for next frame
      requestAnimationFrame(runCallback);
      break;
    case "low":
      // Schedule with lower priority
      if ("requestIdleCallback" in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).requestIdleCallback(runCallback);
      } else {
        setTimeout(runCallback, 0);
      }
      break;
  }
}

// Batch DOM updates to prevent layout thrashing
export class BatchProcessor<T> {
  private batch: T[] = [];
  private isScheduled = false;
  private processor: (items: T[]) => void;

  constructor(processor: (items: T[]) => void) {
    this.processor = processor;
  }

  add(item: T): void {
    this.batch.push(item);

    if (!this.isScheduled) {
      this.isScheduled = true;
      requestAnimationFrame(() => {
        const itemsToProcess = [...this.batch];
        this.batch.length = 0;
        this.isScheduled = false;
        this.processor(itemsToProcess);
      });
    }
  }

  flush(): void {
    if (this.batch.length > 0) {
      const itemsToProcess = [...this.batch];
      this.batch.length = 0;
      this.isScheduled = false;
      this.processor(itemsToProcess);
    }
  }
}

// Performance singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();
