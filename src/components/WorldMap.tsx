import { useRef, useState, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from "react";
import { flushSync } from "react-dom";
import { Location } from "../types/astronomy";
import { normalizedToCoord } from "../utils/lightPollutionMap";
import { ImageSize, mapImageCache } from "../services/mapImageCache";
import { useMapState } from "../hooks/useMapState";
import { useMapGestures } from "../hooks/useMapGestures";
import { MAP_CONFIG, ZOOM_CONFIG, IMAGE_CONFIG } from "../config/mapConfig";
import { MapCoordinateSystem } from "../utils/mapCoordinates";
import { performanceMonitor } from "../utils/performance";
import ZoomControls from "./ZoomControls";
import MapImage from "./MapImage";
import LocationMarker from "./LocationMarker";
import AdditionalMarkers, { WorldMapMarker } from "./AdditionalMarkers";
import styles from "./WorldMap.module.css";

export interface WorldMapRef {
  getMarkerPositionForPan: (
    normalizedX: number,
    normalizedY: number,
    customPanX: number,
  ) => { x: number; y: number };
  panX: number;
}

interface WorldMapProps {
  location: Location | null;
  onLocationChange: (location: Location, isDragging?: boolean) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  markers?: WorldMapMarker[];
  ref?: React.Ref<WorldMapRef>;
}

// Available map asset tiers (module-scoped for stable identity)
const TIERS = [
  { key: "xsmall" as const, width: 1800 },
  { key: "small" as const, width: 3600 },
  { key: "medium" as const, width: 7200 },
  { key: "large" as const, width: 14400 },
] as const;

const WorldMap = forwardRef<WorldMapRef, WorldMapProps>(function WorldMap({
  location,
  onLocationChange,
  onDragStart,
  onDragEnd,
  markers = [],
}, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isZooming, setIsZooming] = useState(false);
  const previousObjectUrlRef = useRef<string | null>(null);
  const zoomTimeoutRef = useRef<number | null>(null);

  // rAF batching for wheel zoom
  const wheelDeltaRef = useRef(0);
  const wheelPosRef = useRef<{ x: number; y: number } | null>(null);
  const wheelRafIdRef = useRef<number | null>(null);

  const [imageTier, setImageTier] = useState<ImageSize | null>(null);

  // Map state management
  const { zoom, panX, panY, setPan, setZoomAndPan } = useMapState();

  // Create coordinate system for transformations
  const coordinateSystem = useMemo(() => {
    return new MapCoordinateSystem(zoom, panX, panY, containerRef);
  }, [zoom, panX, panY]);

  // Centralized helpers: always apply constraints in one place
  const applyZoomPan = useCallback(
    (z: number, px: number, py: number) => {
      const constrained = coordinateSystem.constrainPan(px, py, z);
      flushSync(() => {
        setZoomAndPan(z, constrained.x, constrained.y);
      });
    },
    [coordinateSystem, setZoomAndPan],
  );

  const setPanConstrained = useCallback(
    (px: number, py: number) => {
      const constrained = coordinateSystem.constrainPan(px, py, zoom);
      flushSync(() => {
        setPan(constrained.x, constrained.y);
      });
    },
    [coordinateSystem, zoom, setPan],
  );

  // Track loading state to prevent concurrent image loads
  const isLoadingRef = useRef(false);

  // Only show the "Loading map" overlay when we have no image yet
  const isInitialImageLoading = isImageLoading && !imageSrc;

  // Load cached image with automatic format selection and performance monitoring
  const loadCachedImage = useCallback(async (tierKey: ImageSize) => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    // const t0 = performance.now();
    // Use a unique key per invocation to avoid collisions with StrictMode/double effects
    const measurementKey = `image-loading:${Date.now()}:${Math.random().toString(36).slice(2)}`;
    performanceMonitor.startMeasurement(measurementKey, { tier: tierKey });

    try {
      setIsImageLoading(true);

      const { objectUrl } = await mapImageCache.loadImageAsBlob(
        "color",
        tierKey,
      );

      // Pre-decode before swapping to avoid layout jank
      try {
        const img = new Image();
        img.src = objectUrl;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof (img as any).decode === "function") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (img as any).decode();
        }
      } catch {
        // Ignore decode errors
      }

      // Swap src, then defer revocation of the previous blob URL by 2 rAFs
      const prevUrl = previousObjectUrlRef.current;
      setImageSrc(objectUrl);
      previousObjectUrlRef.current = objectUrl;
      if (prevUrl?.startsWith("blob:")) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            URL.revokeObjectURL(prevUrl);
          });
        });
      }
    } catch (err) {
      console.error("Failed to load cached map image:", err);
      setImageSrc("/world2024B-md.jpg");
      previousObjectUrlRef.current = null;
    } finally {
      setIsImageLoading(false);
      isLoadingRef.current = false;
      performanceMonitor.endMeasurement(measurementKey);
    }
  }, []);

  // Convert screen coordinates to normalized coordinates using coordinate system
  const screenToNormalized = useCallback(
    (screenX: number, screenY: number): { x: number; y: number } => {
      return coordinateSystem.screenToNormalized(screenX, screenY);
    },
    [coordinateSystem],
  );

  // Zoom handler with performance monitoring
  const handleZoom = useCallback(
    (delta: number, centerX?: number, centerY?: number) => {
      performanceMonitor.startMeasurement("zoom-operation", {
        delta,
        hasCenter: centerX !== undefined && centerY !== undefined,
      });

      const currentZoom = zoom;
      const newZoom = Math.max(
        ZOOM_CONFIG.MIN,
        Math.min(ZOOM_CONFIG.MAX, currentZoom + delta),
      );

      if (newZoom !== currentZoom) {
        // Set zooming state to disable transitions
        setIsZooming(true);

        // Clear any existing zoom timeout
        if (zoomTimeoutRef.current) {
          clearTimeout(zoomTimeoutRef.current);
        }

        // Calculate pan adjustments if zooming around a specific point
        if (centerX !== undefined && centerY !== undefined && newZoom > 1) {
          // Lock zoom to keep the point under cursor fixed (analytic, matches MapImage transform)
          const before = coordinateSystem.screenToNormalized(centerX, centerY);
          const container = containerRef.current;
          if (container) {
            const rect = container.getBoundingClientRect();
            const mouseRelX = (centerX - rect.left) / rect.width; // 0..1
            const mouseRelY = (centerY - rect.top) / rect.height; // 0..1

            // Using rX = 0.5 + z*(nx - 0.5 + panX)  and  rY = 0.5 + z*(ny - 0.5) + panY
            const panXAfter = (mouseRelX - 0.5) / newZoom - (before.x - 0.5);
            const panYAfter = mouseRelY - 0.5 - newZoom * (before.y - 0.5);

            // Constrain pan after zoom to avoid gaps and keep wrapping consistent
            // Apply constrained zoom+pan centrally
            applyZoomPan(newZoom, panXAfter, panYAfter);
          } else {
            applyZoomPan(newZoom, panX, panY);
          }
        } else {
          applyZoomPan(newZoom, panX, panY);
        }

        // Re-enable transitions after a short delay
        zoomTimeoutRef.current = setTimeout(() => {
          setIsZooming(false);
        }, 50);
      }

      performanceMonitor.endMeasurement("zoom-operation");
    },
    [zoom, panX, panY, applyZoomPan, coordinateSystem],
  );


  // Memoized coordinate systems for different pan offsets
  const coordinateSystems = useMemo(
    () => ({
      primary: coordinateSystem,
      left: new MapCoordinateSystem(zoom, panX - 1, panY, containerRef),
      right: new MapCoordinateSystem(zoom, panX + 1, panY, containerRef),
    }),
    [coordinateSystem, zoom, panX, panY],
  );

  // Optimized marker position calculator with memoization
  const getMarkerPositionForPan = useCallback(
    (
      normalizedX: number,
      normalizedY: number,
      customPanX: number,
    ): { x: number; y: number } => {
      // Use pre-computed coordinate systems for common offsets
      if (customPanX === panX) {
        return coordinateSystems.primary.getMarkerPosition(
          normalizedX,
          normalizedY,
        );
      } else if (customPanX === panX - 1) {
        return coordinateSystems.left.getMarkerPosition(
          normalizedX,
          normalizedY,
        );
      } else if (customPanX === panX + 1) {
        return coordinateSystems.right.getMarkerPosition(
          normalizedX,
          normalizedY,
        );
      }

      // Fallback for custom offsets (rare case)
      const tempCoordSystem = new MapCoordinateSystem(
        zoom,
        customPanX,
        panY,
        containerRef,
      );
      return tempCoordSystem.getMarkerPosition(normalizedX, normalizedY);
    },
    [coordinateSystems, panX, zoom, panY],
  );

  // Gesture handlers using the hook
  const {
    isDragging,
    isPanning,
    handleMouseDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useMapGestures({
    containerRef,
    zoom,
    panX,
    panY,
    currentLocation: location,
    setPan: setPanConstrained,
    onZoom: handleZoom,
    onLocationChange,
    onDragStart,
    onDragEnd,
    screenToNormalized,
    normalizedToCoord,
    getMarkerPositionForPan,
    config: {
      zoomSpeed: ZOOM_CONFIG.SPEED,
      dragThreshold: MAP_CONFIG.gestures.DRAG_THRESHOLD,
    },
  });

  // Expose functions to parent component via ref
  useImperativeHandle(ref, () => ({
    getMarkerPositionForPan,
    panX,
  }), [getMarkerPositionForPan, panX]);

  // Load cached image on mount and when the DPR-adjusted container width crosses a bucket
  // Load when DPR-adjusted container width * zoom suggests a new asset tier
  useEffect(() => {
    const computeTier = () => {
      const node = containerRef.current;
      if (!node) return null;

      const cssWidth = node.clientWidth; // only the container
      if (!cssWidth) {
        return null; // ignore transient zero widths
      }

      const dpr =
        typeof window !== "undefined" && window.devicePixelRatio
          ? window.devicePixelRatio
          : 1;

      const effective = cssWidth * dpr * Math.max(1, zoom);

      // Bias toward a lower tier at base zoom to save bandwidth on modest viewports
      const DOWNSHIFT = 0.85;
      const target = effective * DOWNSHIFT;

      const tier =
        TIERS.find((t) => t.width >= target) ?? TIERS[TIERS.length - 1];
      const chosen = tier.key;
      return chosen as ImageSize;
    };

    let debounceId: number | null = null;

    const maybeLoad = () => {
      const tier = computeTier();
      if (!tier) return; // wait until container has a non-zero width
      if (tier !== imageTier) {
        if (debounceId) clearTimeout(debounceId);
        debounceId = setTimeout(() => {
          setImageTier(tier);
          loadCachedImage(tier);
        }, 120) as unknown as number;
      }
    };
    // initial (defer to next frame so layout has settled)
    if (containerRef.current) requestAnimationFrame(maybeLoad);

    // resize listener
    const onResize = () => {
      if (debounceId) clearTimeout(debounceId);
      debounceId = setTimeout(
        maybeLoad,
        IMAGE_CONFIG.RESIZE_DEBOUNCE_MS,
      ) as unknown as number;
    };

    window.addEventListener("resize", onResize);

    // ResizeObserver for container size changes
    const container = containerRef.current;
    let ro: ResizeObserver | null = null;
    if (container && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        const w = containerRef.current?.clientWidth ?? 0;
        if (w === 0) return; // ignore transient zero widths
        if (debounceId) clearTimeout(debounceId);
        debounceId = setTimeout(
          maybeLoad,
          IMAGE_CONFIG.RESIZE_DEBOUNCE_MS,
        ) as unknown as number;
      });
      ro.observe(container);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (debounceId) clearTimeout(debounceId);
      if (ro) {
        ro.disconnect();
      }
      // existing cleanup you already had:
      if (zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
    };
  }, [loadCachedImage, imageTier, zoom]);

  // Prefetch the next tier in the background to reduce visible loading when zooming in
  useEffect(() => {
    if (!imageTier) return;
    const order = TIERS.map((t) => t.key);
    const idx = order.indexOf(imageTier);
    const next = order[idx + 1];
    if (next) {
      // Fire and forget
      mapImageCache.prefetchImage("color", next);
    }
  }, [imageTier]);

  // Revoke the current blob URL only on component unmount to avoid breaking in-flight images
  useEffect(() => {
    return () => {
      if (previousObjectUrlRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(previousObjectUrlRef.current);
      }
    };
  }, []);

  // Add native wheel event listener to prevent page scrolling with rAF batching
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const delta =
        -event.deltaY * ZOOM_CONFIG.SPEED * ZOOM_CONFIG.WHEEL_SPEED_MULTIPLIER;

      // Accumulate deltas and update last mouse position
      wheelDeltaRef.current += delta;
      wheelPosRef.current = { x: event.clientX, y: event.clientY };

      // Schedule one rAF to apply the accumulated delta
      if (wheelRafIdRef.current == null) {
        wheelRafIdRef.current = requestAnimationFrame(() => {
          wheelRafIdRef.current = null;
          const d = wheelDeltaRef.current;
          const pos = wheelPosRef.current;
          if (d !== 0 && pos) {
            handleZoom(d, pos.x, pos.y);
          }
          wheelDeltaRef.current = 0;
          wheelPosRef.current = null;
        });
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", onWheel);
      if (wheelRafIdRef.current != null)
        cancelAnimationFrame(wheelRafIdRef.current);
      wheelRafIdRef.current = null;
      wheelDeltaRef.current = 0;
      wheelPosRef.current = null;
    };
  }, [handleZoom]);

  // Prevent iOS Safari page zoom during pinch gestures inside the map container.
  // Safari dispatches non-standard `gesture*` events when two-finger pinching.
  // We call preventDefault() on those events to keep the pinch zoom behavior
  // localized to the map (so the page itself does not zoom).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prevent = (e: Event) => {
      e.preventDefault();
    };

    const opts = { passive: false } as AddEventListenerOptions;
    // These events are only fired by Safari
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    el.addEventListener("gesturestart", prevent, opts as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    el.addEventListener("gesturechange", prevent, opts as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    el.addEventListener("gestureend", prevent, opts as any);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      el.removeEventListener("gesturestart", prevent as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      el.removeEventListener("gesturechange", prevent as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      el.removeEventListener("gestureend", prevent as any);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Loading state - checkerboard pattern */}
      {isInitialImageLoading && <div className={styles.loadingOverlay} />}

      {/* Zoom controls */}
      <ZoomControls
        zoom={zoom}
        minZoom={ZOOM_CONFIG.MIN}
        maxZoom={ZOOM_CONFIG.MAX}
        zoomSpeed={ZOOM_CONFIG.SPEED}
        onZoom={handleZoom}
        isVisible={!isInitialImageLoading}
      />

      {/* Map images */}
      <MapImage
        src={imageSrc}
        alt="World map showing light pollution"
        zoom={zoom}
        panX={panX}
        panY={panY}
        panOffset={0}
        currentLocation={location}
        isDragging={isDragging}
        isPanning={isPanning}
        isZooming={isZooming}
        isImageLoading={isInitialImageLoading}
        containerRef={containerRef}
        getMarkerPositionForPan={getMarkerPositionForPan}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      <MapImage
        src={imageSrc}
        alt="World map showing light pollution (left wrap)"
        zoom={zoom}
        panX={panX}
        panY={panY}
        panOffset={-1}
        currentLocation={location}
        isDragging={isDragging}
        isPanning={isPanning}
        isZooming={isZooming}
        isImageLoading={isInitialImageLoading}
        containerRef={containerRef}
        getMarkerPositionForPan={getMarkerPositionForPan}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      <MapImage
        src={imageSrc}
        alt="World map showing light pollution (right wrap)"
        zoom={zoom}
        panX={panX}
        panY={panY}
        panOffset={1}
        currentLocation={location}
        isDragging={isDragging}
        isPanning={isPanning}
        isZooming={isZooming}
        isImageLoading={isInitialImageLoading}
        containerRef={containerRef}
        getMarkerPositionForPan={getMarkerPositionForPan}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Location marker */}
      <LocationMarker
        location={location}
        panX={panX}
        getMarkerPositionForPan={getMarkerPositionForPan}
      />

      {/* Additional markers */}
      <AdditionalMarkers
        markers={markers}
        panX={panX}
        getMarkerPositionForPan={getMarkerPositionForPan}
      />
    </div>
  );
});

export default WorldMap;
