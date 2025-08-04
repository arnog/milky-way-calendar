/**
 * Tests for the useSwipe custom hook
 * Verifies swipe gesture detection and boundary handling
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSwipe } from '../hooks/useSwipe';

// Mock touch and mouse events
const createTouchEvent = (clientX: number): React.TouchEvent => ({
  touches: [{ clientX }]
} as unknown as React.TouchEvent);

const createMouseEvent = (clientX: number): React.MouseEvent => ({
  clientX
} as unknown as React.MouseEvent);

describe('useSwipe Hook', () => {
  it('should initialize with correct default state', () => {
    const onSwipe = vi.fn();
    const { result } = renderHook(() => useSwipe({
      currentIndex: 0,
      totalItems: 3,
      onSwipe
    }));

    expect(result.current.state.isDragging).toBe(false);
    expect(result.current.state.translateX).toBe(0);
    expect(result.current.handlers).toHaveProperty('onTouchStart');
    expect(result.current.handlers).toHaveProperty('onMouseDown');
  });

  it('should handle touch swipe gestures', () => {
    const onSwipe = vi.fn();
    const { result } = renderHook(() => useSwipe({
      currentIndex: 1,
      totalItems: 3,
      onSwipe,
      threshold: 50
    }));

    // Start touch
    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(100));
    });
    
    expect(result.current.state.isDragging).toBe(true);

    // Move touch (swipe left)
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(40));
    });
    
    expect(result.current.state.translateX).toBe(-60);

    // End touch
    act(() => {
      result.current.handlers.onTouchEnd();
    });
    
    expect(onSwipe).toHaveBeenCalledWith('left', 2);
    expect(result.current.state.isDragging).toBe(false);
    expect(result.current.state.translateX).toBe(0);
  });

  it('should handle mouse swipe gestures', () => {
    const onSwipe = vi.fn();
    const { result } = renderHook(() => useSwipe({
      currentIndex: 1,
      totalItems: 3,
      onSwipe,
      threshold: 50
    }));

    // Start mouse drag
    act(() => {
      result.current.handlers.onMouseDown(createMouseEvent(100));
    });
    
    expect(result.current.state.isDragging).toBe(true);

    // Move mouse (swipe right)
    act(() => {
      result.current.handlers.onMouseMove(createMouseEvent(160));
    });
    
    expect(result.current.state.translateX).toBe(60);

    // End mouse drag
    act(() => {
      result.current.handlers.onMouseUp();
    });
    
    expect(onSwipe).toHaveBeenCalledWith('right', 0);
    expect(result.current.state.isDragging).toBe(false);
    expect(result.current.state.translateX).toBe(0);
  });

  it('should respect boundary conditions', () => {
    const onSwipe = vi.fn();
    const { result } = renderHook(() => useSwipe({
      currentIndex: 0, // At first item
      totalItems: 3,
      onSwipe,
      threshold: 50
    }));

    // Try to swipe right (should not trigger since already at first item)
    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(100));
    });
    
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(160)); // +60 pixels
    });
    
    act(() => {
      result.current.handlers.onTouchEnd();
    });
    
    expect(onSwipe).not.toHaveBeenCalled();
  });

  it('should respect boundary conditions at end', () => {
    const onSwipe = vi.fn();
    const { result } = renderHook(() => useSwipe({
      currentIndex: 2, // At last item
      totalItems: 3,
      onSwipe,
      threshold: 50
    }));

    // Try to swipe left (should not trigger since already at last item)
    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(100));
    });
    
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(40)); // -60 pixels
    });
    
    act(() => {
      result.current.handlers.onTouchEnd();
    });
    
    expect(onSwipe).not.toHaveBeenCalled();
  });

  it('should not trigger swipe if distance is below threshold', () => {
    const onSwipe = vi.fn();
    const { result } = renderHook(() => useSwipe({
      currentIndex: 1,
      totalItems: 3,
      onSwipe,
      threshold: 50
    }));

    // Small swipe that doesn't reach threshold
    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(100));
    });
    
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(130)); // Only 30 pixels
    });
    
    act(() => {
      result.current.handlers.onTouchEnd();
    });
    
    expect(onSwipe).not.toHaveBeenCalled();
  });

  it('should use adaptive threshold when not specified', () => {
    const onSwipe = vi.fn();
    
    // Mock touch device detection
    Object.defineProperty(window, 'ontouchstart', {
      writable: true,
      value: true
    });
    
    const { result } = renderHook(() => useSwipe({
      currentIndex: 1,
      totalItems: 3,
      onSwipe
      // No threshold specified - should use adaptive (30px for touch)
    }));

    // Swipe just above touch threshold (30px) - swipe left to go to next item
    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(100));
    });
    
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(65)); // 100-65 = -35 pixels (swipe left)
    });
    
    act(() => {
      result.current.handlers.onTouchEnd();
    });
    
    expect(onSwipe).toHaveBeenCalledWith('left', 2);
  });
});