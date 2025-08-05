/**
 * Tests for the unified map image cache service
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MapImageCacheService, CACHE_CONFIG } from '../services/mapImageCache';

// Mock global objects for testing
const mockCache = {
  match: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  keys: vi.fn(),
};

const mockCaches = {
  open: vi.fn().mockResolvedValue(mockCache),
};

const mockCanvas = {
  getContext: vi.fn().mockReturnValue({
    drawImage: vi.fn(),
    getImageData: vi.fn().mockReturnValue({
      data: new Uint8ClampedArray([10, 10, 10, 255]), // Mock grayscale data
      width: 1,
      height: 1,
    }),
  }),
  width: 0,
  height: 0,
};

// Setup global mocks
Object.defineProperty(globalThis, 'caches', {
  value: mockCaches,
  writable: true,
});

Object.defineProperty(globalThis, 'fetch', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(globalThis, 'createImageBitmap', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(globalThis, 'URL', {
  value: {
    createObjectURL: vi.fn().mockReturnValue('blob:mock-url'),
    revokeObjectURL: vi.fn(),
  },
  writable: true,
});

Object.defineProperty(globalThis, 'OffscreenCanvas', {
  value: function OffscreenCanvas() {
    return mockCanvas;
  },
  writable: true,
});

describe('MapImageCacheService', () => {
  let cacheService: MapImageCacheService;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    
    // Get fresh instance
    cacheService = MapImageCacheService.getInstance();
  });

  describe('Configuration', () => {
    it('should have correct cache name matching unified system', () => {
      expect(CACHE_CONFIG.NAME).toBe('milky-way-map-images-v1');
    });

    it('should include both grayscale and color image options', () => {
      const grayscaleOptions = CACHE_CONFIG.IMAGE_OPTIONS.filter(opt => opt.format === 'grayscale');
      const colorOptions = CACHE_CONFIG.IMAGE_OPTIONS.filter(opt => opt.format === 'color');
      
      expect(grayscaleOptions.length).toBeGreaterThan(0);
      expect(colorOptions.length).toBeGreaterThan(0);
    });

    it('should have grayscale as highest priority for calculations', () => {
      const grayscaleOption = CACHE_CONFIG.IMAGE_OPTIONS.find(opt => opt.format === 'grayscale');
      expect(grayscaleOption?.priority).toBe(1);
    });
  });

  describe('getBestImagePath', () => {
    it('should prioritize cached images over network', async () => {
      // Mock cached response
      const mockResponse = new Response('', {
        headers: { 'cached-date': Date.now().toString() },
      });
      
      mockCache.match.mockResolvedValueOnce(mockResponse);

      const imagePath = await cacheService.getBestImagePath('grayscale');
      
      expect(imagePath).toBe('/world2024B-lg-grayscale.png');
      expect(mockCache.match).toHaveBeenCalled();
    });

    it('should fall back to default when no cached version available', async () => {
      mockCache.match.mockResolvedValue(null);

      const imagePath = await cacheService.getBestImagePath('grayscale');
      
      expect(imagePath).toBe(CACHE_CONFIG.DEFAULT_GRAYSCALE);
    });

    it('should filter by format correctly', async () => {
      mockCache.match.mockResolvedValue(null);

      const grayscalePath = await cacheService.getBestImagePath('grayscale');
      const colorPath = await cacheService.getBestImagePath('color');
      
      expect(grayscalePath).toBe(CACHE_CONFIG.DEFAULT_GRAYSCALE);
      // Color path returns highest priority color image when none cached, not DEFAULT_COLOR
      expect(colorPath).toBe('/world2024B-lg.png');
    });
  });

  describe('loadImageAsBlob', () => {
    it('should load image and create object URL', async () => {
      const mockBlob = new Blob(['mock image data']);
      const mockResponse = new Response(mockBlob);
      
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);
      mockCache.match.mockResolvedValue(null);

      const result = await cacheService.loadImageAsBlob('color');
      
      expect(result.objectUrl).toBe('blob:mock-url');
      expect(result.source).toContain('world2024B');
      expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  describe('loadImageAsData', () => {
    it('should load image and return ImageData', async () => {
      const mockBlob = new Blob(['mock image data']);
      const mockResponse = new Response(mockBlob);
      const mockImageBitmap = { width: 100, height: 50 };
      
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);
      (globalThis.createImageBitmap as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockImageBitmap);
      mockCache.match.mockResolvedValue(null);

      const result = await cacheService.loadImageAsData('grayscale');
      
      expect(result.width).toBe(100);
      expect(result.height).toBe(50);
      expect(result.imageData).toBeDefined();
      expect(result.source).toContain('grayscale');
    });
  });

  describe('clearCache', () => {
    it('should clear all cached images', async () => {
      mockCache.keys.mockResolvedValue([]);
      
      const result = await cacheService.clearCache();
      
      expect(result).toBe(true);
      expect(mockCache.delete).toHaveBeenCalledTimes(CACHE_CONFIG.IMAGE_OPTIONS.length);
    });

    it('should handle cache API errors gracefully', async () => {
      mockCaches.open.mockRejectedValueOnce(new Error('Cache API not available'));
      
      const result = await cacheService.clearCache();
      
      // When cache API fails, the service still returns true because it clears in-memory cache
      expect(result).toBe(true);
    });
  });

  describe('getCacheInfo', () => {
    it('should return cache statistics', async () => {
      const mockKeys = [
        { url: 'https://example.com/world2024B-lg-grayscale.png' },
        { url: 'https://example.com/world2024B-md.jpg' },
      ];
      
      const mockResponse = new Response(new Blob(['test'], { type: 'image/png' }));
      
      mockCache.keys.mockResolvedValue(mockKeys);
      mockCache.match.mockResolvedValue(mockResponse);

      const info = await cacheService.getCacheInfo();
      
      expect(info.persistentCacheEntries).toBe(2);
      expect(info.totalSize).toBeGreaterThan(0);
    });
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = MapImageCacheService.getInstance();
      const instance2 = MapImageCacheService.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });
});