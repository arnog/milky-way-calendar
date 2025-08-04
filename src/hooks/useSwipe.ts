import { useState, useMemo, useCallback } from 'react';

export interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export interface SwipeState {
  isDragging: boolean;
  translateX: number;
}

export interface SwipeConfig {
  /** Minimum distance in pixels to trigger a swipe action */
  threshold?: number;
  /** Current index/position for boundary checking */
  currentIndex: number;
  /** Total number of items for boundary checking */
  totalItems: number;
  /** Callback fired when swipe action should change index */
  onSwipe: (direction: 'left' | 'right', newIndex: number) => void;
}

/**
 * Custom hook for handling swipe gestures on touch and mouse devices
 * 
 * Features:
 * - Touch and mouse event support
 * - Adaptive threshold based on device type
 * - Boundary checking to prevent invalid swipes
 * - Real-time drag translation for smooth interactions
 * - Automatic device detection for optimized UX
 * 
 * @param config - Configuration object for swipe behavior
 * @returns Object containing event handlers and current swipe state
 */
export function useSwipe({
  threshold,
  currentIndex,
  totalItems,
  onSwipe
}: SwipeConfig): { handlers: SwipeHandlers; state: SwipeState } {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  // Detect touch device for optimized interaction
  const isTouchDevice = useMemo(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Use adaptive threshold if not provided
  const swipeThreshold = threshold ?? (isTouchDevice ? 30 : 50);

  const handleSwipeEnd = useCallback(() => {
    if (!isDragging) return;
    
    if (Math.abs(translateX) > swipeThreshold) {
      if (translateX > 0 && currentIndex > 0) {
        // Swipe right - go to previous item
        onSwipe('right', currentIndex - 1);
      } else if (translateX < 0 && currentIndex < totalItems - 1) {
        // Swipe left - go to next item
        onSwipe('left', currentIndex + 1);
      }
    }
    
    setIsDragging(false);
    setTranslateX(0);
  }, [isDragging, translateX, swipeThreshold, currentIndex, totalItems, onSwipe]);

  const handlers: SwipeHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      setIsDragging(true);
      setStartX(e.touches[0].clientX);
    },

    onTouchMove: (e: React.TouchEvent) => {
      if (!isDragging) return;
      
      const currentX = e.touches[0].clientX;
      const diffX = currentX - startX;
      setTranslateX(diffX);
    },

    onTouchEnd: handleSwipeEnd,

    onMouseDown: (e: React.MouseEvent) => {
      setIsDragging(true);
      setStartX(e.clientX);
    },

    onMouseMove: (e: React.MouseEvent) => {
      if (!isDragging) return;
      
      const currentX = e.clientX;
      const diffX = currentX - startX;
      setTranslateX(diffX);
    },

    onMouseUp: handleSwipeEnd,

    onMouseLeave: handleSwipeEnd,
  };

  const state: SwipeState = {
    isDragging,
    translateX
  };

  return { handlers, state };
}