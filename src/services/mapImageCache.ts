/**
 * Unified Map Image Cache Service
 *
 * Provides centralized caching for all light pollution map images used by
 * both the WorldMap component and the darkSiteWorker. Uses the Cache API
 * for persistent storage with automatic expiration and format selection.
 */

// Cache configuration
export const CACHE_CONFIG = {
  NAME: "milky-way-map-images-v1",
  MAX_AGE_MS: 7 * 24 * 60 * 60 * 1000, // 7 days

  // All available map image formats in order of preference
  IMAGE_OPTIONS: [
    // Grayscale version for Bortle calculations (optimized, smallest size)
    {
      path: "/world2024B-lg-grayscale.png",
      format: "grayscale",
      size: "large",
      priority: 1,
    },

    // Color versions for visual display
    { path: "/world2024B-lg.png", format: "color", size: "large", priority: 2 },
    {
      path: "/world2024B-md.webp",
      format: "color",
      size: "medium",
      priority: 3,
    },
    {
      path: "/world2024B-md.jpg",
      format: "color",
      size: "medium",
      priority: 4,
    },
    {
      path: "/world2024B-sm.webp",
      format: "color",
      size: "small",
      priority: 5,
    },
    { path: "/world2024B-sm.jpg", format: "color", size: "small", priority: 6 },
    {
      path: "/world2024B-xs.webp",
      format: "color",
      size: "xsmall",
      priority: 7,
    },
    {
      path: "/world2024B-xs.jpg",
      format: "color",
      size: "xsmall",
      priority: 8,
    },
  ],

  // Default fallbacks
  DEFAULT_GRAYSCALE: "/world2024B-lg-grayscale.png",
  DEFAULT_COLOR: "/world2024B-md.jpg",
};

export type ImageFormat = "grayscale" | "color";
export type ImageSize = "xsmall" | "small" | "medium" | "large";

export interface CacheableImage {
  path: string;
  format: ImageFormat;
  size: ImageSize;
  priority: number;
}

export interface CachedImageData {
  imageData?: ImageData;
  width: number;
  height: number;
  source: string;
  blob?: Blob;
  objectUrl?: string;
}

/**
 * Map Image Cache Service
 * Handles caching, loading, and format selection for light pollution maps
 */
export class MapImageCacheService {
  private static instance: MapImageCacheService;
  private inMemoryCache = new Map<
    string,
    { data: CachedImageData; timestamp: number }
  >();

  private constructor() {}

  static getInstance(): MapImageCacheService {
    if (!MapImageCacheService.instance) {
      MapImageCacheService.instance = new MapImageCacheService();
    }
    return MapImageCacheService.instance;
  }

  /**
   * Open or create the cache
   */
  private async openCache(): Promise<Cache | null> {
    try {
      return await caches.open(CACHE_CONFIG.NAME);
    } catch {
      console.warn("Cache API not available, falling back to direct fetch");
      return null;
    }
  }

  /**
   * Get cached response or fetch from network
   */
  private async getCachedResponse(url: string): Promise<Response> {
    const cache = await this.openCache();

    if (cache) {
      try {
        const cachedResponse = await cache.match(url);

        if (cachedResponse) {
          // Check if cache is still valid
          const cachedDate = cachedResponse.headers.get("cached-date");
          if (cachedDate) {
            const age = Date.now() - parseInt(cachedDate);
            if (age < CACHE_CONFIG.MAX_AGE_MS) {
              return cachedResponse;
            } else {
              // Cache expired, remove it
              await cache.delete(url);
            }
          }
        }
      } catch (error) {
        console.warn("Error reading from cache:", error);
      }
    }

    // Fetch from network
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Store in cache if available
    if (cache) {
      try {
        // Clone response and add cache timestamp
        const responseToCache = response.clone();
        const headers = new Headers(responseToCache.headers);
        headers.set("cached-date", Date.now().toString());

        const cachedResponse = new Response(responseToCache.body, {
          status: responseToCache.status,
          statusText: responseToCache.statusText,
          headers: headers,
        });

        await cache.put(url, cachedResponse);
      } catch (error) {
        console.warn("Error storing in cache:", error);
      }
    }

    return response;
  }

  /**
   * Check WebP support
   */
  private supportsWebP(): boolean {
    if (typeof window === "undefined") return false;

    try {
      return (
        document
          .createElement("canvas")
          .toDataURL("image/webp")
          .indexOf("data:image/webp") === 0
      );
    } catch {
      return false;
    }
  }

  /**
   * Get the best available image format based on preferences and cache
   */
  async getBestImagePath(
    format: ImageFormat,
    preferredSize?: ImageSize,
    screenWidth?: number,
  ): Promise<string> {
    const cache = await this.openCache();

    // Filter images by format
    let candidates = CACHE_CONFIG.IMAGE_OPTIONS.filter(
      (opt) => opt.format === format,
    );

    // For color images, consider WebP support and screen size
    if (format === "color") {
      const webpSupported = this.supportsWebP();

      // Filter by WebP support
      if (!webpSupported) {
        candidates = candidates.filter((opt) => !opt.path.includes(".webp"));
      }

      // Auto-select size based on screen width if not specified
      if (!preferredSize && screenWidth) {
        if (screenWidth < 768) {
          preferredSize = "small";
        } else if (screenWidth < 1920) {
          preferredSize = "medium";
        } else {
          preferredSize = "large";
        }
      }

      // Filter by preferred size
      if (preferredSize) {
        const sizeFiltered = candidates.filter(
          (opt) => opt.size === preferredSize,
        );
        if (sizeFiltered.length > 0) {
          candidates = sizeFiltered;
        }
      }
    }

    // Sort by priority
    candidates.sort((a, b) => a.priority - b.priority);

    // Check which images are already cached (prefer cached over network)
    if (cache) {
      for (const option of candidates) {
        try {
          const cachedResponse = await cache.match(option.path);
          if (cachedResponse) {
            const cachedDate = cachedResponse.headers.get("cached-date");
            if (
              cachedDate &&
              Date.now() - parseInt(cachedDate) < CACHE_CONFIG.MAX_AGE_MS
            ) {
              return option.path;
            }
          }
        } catch (error) {
          console.warn(`Error checking cache for ${option.path}:`, error);
        }
      }
    }

    // No cached version available, use best candidate or fallback
    if (candidates.length > 0) {
      return candidates[0].path;
    }

    // Fallback to defaults
    return format === "grayscale"
      ? CACHE_CONFIG.DEFAULT_GRAYSCALE
      : CACHE_CONFIG.DEFAULT_COLOR;
  }

  /**
   * Load image as Blob with caching (for WorldMap component)
   */
  async loadImageAsBlob(
    format: ImageFormat,
    preferredSize?: ImageSize,
    screenWidth?: number,
  ): Promise<{ blob: Blob; objectUrl: string; source: string }> {
    const imagePath = await this.getBestImagePath(
      format,
      preferredSize,
      screenWidth,
    );

    // Check in-memory cache first
    const cacheKey = `blob-${imagePath}`;
    const cached = this.inMemoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_CONFIG.MAX_AGE_MS) {
      const blob = cached.data.blob!;

      // Revoke any previous object URL stored in the cache entry to prevent leaks
      if (cached.data.objectUrl && cached.data.objectUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(cached.data.objectUrl);
        } catch {
          // Ignore URL revocation errors
        }
      }

      // Always mint a fresh object URL from the cached Blob (the old one may have been revoked by the UI)
      const objectUrl = URL.createObjectURL(blob);

      // Update the cache entry with the new URL and timestamp
      cached.data.objectUrl = objectUrl;
      cached.timestamp = Date.now();

      return { blob, objectUrl, source: cached.data.source };
    }

    // Get cached or fresh response
    const response = await this.getCachedResponse(imagePath);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    // Store in in-memory cache
    this.inMemoryCache.set(cacheKey, {
      data: {
        blob,
        objectUrl,
        source: imagePath,
        width: 0, // Not needed for blob cache
        height: 0,
      },
      timestamp: Date.now(),
    });

    return { blob, objectUrl, source: imagePath };
  }

  /**
   * Prefetch a specific tier into both the persistent cache and the in-memory blob cache.
   * Does not create an object URL to avoid unnecessary memory pressure.
   */
  async prefetchImage(format: ImageFormat, size: ImageSize): Promise<void> {
    try {
      const imagePath = await this.getBestImagePath(format, size);
      // Ensure it exists in the persistent Cache (or fetch it)
      const response = await this.getCachedResponse(imagePath);
      const blob = await response.blob();

      // Warm the in-memory blob cache (no objectUrl creation here)
      const cacheKey = `blob-${imagePath}`;
      const entry = this.inMemoryCache.get(cacheKey);
      if (entry) {
        entry.data.blob = blob;
        entry.data.source = imagePath;
        // Defensive: if the cache entry held an objectUrl, revoke and clear it
        if (entry.data.objectUrl?.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(entry.data.objectUrl);
          } catch {
            // Ignore URL revocation errors
          }
          entry.data.objectUrl = undefined;
        }
        entry.timestamp = Date.now();
      } else {
        this.inMemoryCache.set(cacheKey, {
          data: { blob, source: imagePath, width: 0, height: 0 },
          timestamp: Date.now(),
        });
      }
    } catch {
      // Prefetch is best-effort; ignore failures and fall back to normal load
    }
  }

  /**
   * Load image as ImageData with caching (for darkSiteWorker)
   */
  async loadImageAsData(
    format: ImageFormat,
    preferredSize?: ImageSize,
  ): Promise<CachedImageData> {
    const imagePath = await this.getBestImagePath(format, preferredSize);

    // Check in-memory cache first
    const cacheKey = `data-${imagePath}`;
    const cached = this.inMemoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_CONFIG.MAX_AGE_MS) {
      return cached.data;
    }

    try {
      // Get cached or fresh response
      const response = await this.getCachedResponse(imagePath);
      const blob = await response.blob();

      // Use OffscreenCanvas in worker context, regular Canvas otherwise
      let canvas: OffscreenCanvas | HTMLCanvasElement;
      let ctx:
        | OffscreenCanvasRenderingContext2D
        | CanvasRenderingContext2D
        | null;

      if (typeof OffscreenCanvas !== "undefined") {
        canvas = new OffscreenCanvas(1, 1);
        ctx = canvas.getContext("2d");
      } else {
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
      }

      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      const imageBitmap = await createImageBitmap(blob);

      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      ctx.drawImage(imageBitmap, 0, 0);

      const imageData = ctx.getImageData(
        0,
        0,
        imageBitmap.width,
        imageBitmap.height,
      );

      const result: CachedImageData = {
        imageData,
        width: imageBitmap.width,
        height: imageBitmap.height,
        source: imagePath,
      };

      // Store in in-memory cache
      this.inMemoryCache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      throw new Error(`Failed to load image as data: ${error}`);
    }
  }

  /**
   * Clear all cached images
   */
  async clearCache(): Promise<boolean> {
    try {
      const cache = await this.openCache();
      if (cache) {
        for (const option of CACHE_CONFIG.IMAGE_OPTIONS) {
          await cache.delete(option.path);
        }
      }

      // Clear in-memory cache
      this.inMemoryCache.clear();

      return true;
    } catch (error) {
      console.warn("Error clearing image cache:", error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheInfo(): Promise<{
    inMemoryEntries: number;
    persistentCacheEntries: number;
    totalSize?: number;
  }> {
    const inMemoryEntries = this.inMemoryCache.size;
    let persistentCacheEntries = 0;
    let totalSize = 0;

    try {
      const cache = await this.openCache();
      if (cache) {
        const keys = await cache.keys();
        persistentCacheEntries = keys.length;

        // Calculate total size (approximate)
        for (const request of keys) {
          try {
            const response = await cache.match(request);
            if (response) {
              const blob = await response.blob();
              totalSize += blob.size;
            }
          } catch {
            // Ignore errors for individual entries
          }
        }
      }
    } catch (error) {
      console.warn("Error getting cache info:", error);
    }

    return {
      inMemoryEntries,
      persistentCacheEntries,
      totalSize: totalSize > 0 ? totalSize : undefined,
    };
  }
}

// Export singleton instance
export const mapImageCache = MapImageCacheService.getInstance();
