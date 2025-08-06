import { useState, useCallback } from "react";

export function useMapState() {
  const [zoom, setZoomRaw] = useState(1);
  const [panX, setPanXRaw] = useState(0);
  const [panY, setPanYRaw] = useState(0);

  const setZoom = useCallback((newZoom: number) => {
    const clampedZoom = Math.min(Math.max(newZoom, 1), 10);
    setZoomRaw(clampedZoom);
  }, []);

  const setPanX = useCallback((newPanX: number) => {
    setPanXRaw(newPanX);
  }, []);

  const setPanY = useCallback((newPanY: number) => {
    setPanYRaw(newPanY);
  }, []);

  const setPan = useCallback((newPanX: number, newPanY: number) => {
    setPanXRaw(newPanX);
    setPanYRaw(newPanY);
  }, []);

  const setZoomAndPan = useCallback(
    (newZoom: number, newPanX: number, newPanY: number) => {
      const clampedZoom = Math.min(Math.max(newZoom, 1), 10);
      setZoomRaw(clampedZoom);
      setPanXRaw(newPanX);
      setPanYRaw(newPanY);
    },
    [],
  );

  return {
    zoom,
    panX,
    panY,
    setZoom,
    setPanX,
    setPanY,
    setPan,
    setZoomAndPan,
  };
}
