import { useState, useCallback } from "react";

export interface MapState {
  zoom: number;
  panX: number;
  panY: number;
}

export interface MapStateActions {
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  setPanX: (panX: number) => void;
  setPanY: (panY: number) => void;
  setPan: (panX: number, panY: number) => void;
  resetState: () => void;
}

export interface MapStateConfig {
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
  initialPanX?: number;
  initialPanY?: number;
}

const DEFAULT_CONFIG: Required<MapStateConfig> = {
  minZoom: 1,
  maxZoom: 8,
  initialZoom: 1,
  initialPanX: 0,
  initialPanY: 0,
};

export function useMapState(config: MapStateConfig = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const [zoom, setZoom] = useState(finalConfig.initialZoom);
  const [panX, setPanX] = useState(finalConfig.initialPanX);
  const [panY, setPanY] = useState(finalConfig.initialPanY);

  // Constraint function for pan values
  const constrainPan = useCallback(
    (newPanX: number, newPanY: number, currentZoom: number) => {
      // For horizontal (X): Wrap the pan value to keep within -1 to 1 range
      // This ensures we always stay within the 3-map strip
      let constrainedPanX = newPanX;
      while (constrainedPanX > 1) constrainedPanX -= 2;
      while (constrainedPanX < -1) constrainedPanX += 2;

      // For vertical (Y): Constrain to prevent showing areas beyond map bounds
      if (currentZoom <= 1) {
        // At zoom level 1 or less, always center the map vertically (no gaps)
        return { x: constrainedPanX, y: 0 };
      } else {
        // When zoomed in, calculate maximum allowed pan distance
        // This prevents showing empty space beyond the map bounds
        const maxPanY = (currentZoom - 1) / 2;
        const minPanY = -(currentZoom - 1) / 2;
        const constrainedPanY = Math.max(minPanY, Math.min(maxPanY, newPanY));
        return { x: constrainedPanX, y: constrainedPanY };
      }
    },
    [],
  );

  // Enhanced setter functions that apply constraints
  const setConstrainedPan = useCallback(
    (newPanX: number, newPanY: number) => {
      const constrained = constrainPan(newPanX, newPanY, zoom);
      setPanX(constrained.x);
      setPanY(constrained.y);
    },
    [constrainPan, zoom],
  );

  const setConstrainedZoom = useCallback(
    (newZoom: number | ((prev: number) => number)) => {
      setZoom((prevZoom) => {
        const actualNewZoom =
          typeof newZoom === "function" ? newZoom(prevZoom) : newZoom;
        const constrainedZoom = Math.max(
          finalConfig.minZoom,
          Math.min(finalConfig.maxZoom, actualNewZoom),
        );

        // Apply pan constraints when zoom changes
        if (constrainedZoom <= 1) {
          // When zooming to 1.0 or below, always center the map completely
          setPanX(0);
          setPanY(0);
        } else if (constrainedZoom !== prevZoom) {
          // Apply constraints to current pan values for new zoom level
          const constrained = constrainPan(panX, panY, constrainedZoom);
          setPanX(constrained.x);
          setPanY(constrained.y);
        }

        return constrainedZoom;
      });
    },
    [constrainPan, panX, panY, finalConfig.minZoom, finalConfig.maxZoom],
  );

  const resetState = useCallback(() => {
    setZoom(finalConfig.initialZoom);
    setPanX(finalConfig.initialPanX);
    setPanY(finalConfig.initialPanY);
  }, [
    finalConfig.initialZoom,
    finalConfig.initialPanX,
    finalConfig.initialPanY,
  ]);

  const state: MapState = { zoom, panX, panY };

  const actions: MapStateActions = {
    setZoom: setConstrainedZoom,
    setPanX,
    setPanY,
    setPan: setConstrainedPan,
    resetState,
  };

  return {
    ...state,
    ...actions,
    constrainPan,
    config: finalConfig,
  };
}
