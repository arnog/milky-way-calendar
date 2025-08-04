import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFocusTrap } from '../hooks/useFocusTrap';

// Mock DOM elements for testing
class MockHTMLElement {
  private _focusable: boolean;
  public tagName: string;
  public children: MockHTMLElement[] = [];
  public offsetParent: Element | null = null;

  constructor(tagName: string, focusable = false, visible = true) {
    this.tagName = tagName;
    this._focusable = focusable;
    this.offsetParent = visible ? ({} as Element) : null;
  }

  focus = vi.fn();
  contains = vi.fn((element: Element) => this.children.includes(element as unknown as MockHTMLElement));
  querySelectorAll = vi.fn(() => this.children.filter(child => child._focusable));
  hasAttribute = vi.fn(() => false);
}

// Mock window.getComputedStyle
const mockGetComputedStyle = vi.fn(() => ({
  display: 'block',
  visibility: 'visible'
}));

Object.defineProperty(window, 'getComputedStyle', {
  value: mockGetComputedStyle
});

describe('useFocusTrap', () => {
  let container: MockHTMLElement;
  let firstFocusable: MockHTMLElement;
  let secondFocusable: MockHTMLElement;
  let initialFocusElement: MockHTMLElement;
  let returnFocusElement: MockHTMLElement;
  let keydownListener: ((event: KeyboardEvent) => void) | null = null;

  beforeEach(() => {
    // Create mock DOM structure
    container = new MockHTMLElement('div');
    firstFocusable = new MockHTMLElement('button', true);
    secondFocusable = new MockHTMLElement('input', true);
    initialFocusElement = new MockHTMLElement('input', true);
    returnFocusElement = new MockHTMLElement('button', true);

    container.children = [firstFocusable, secondFocusable];

    // Mock document methods
    const originalAddEventListener = document.addEventListener;
    document.addEventListener = vi.fn((event: string, listener: EventListener) => {
      if (event === 'keydown') {
        keydownListener = listener as (event: KeyboardEvent) => void;
      }
      return originalAddEventListener.call(document, event, listener);
    });

    document.removeEventListener = vi.fn();
    
    // Mock document.activeElement
    Object.defineProperty(document, 'activeElement', {
      value: returnFocusElement,
      writable: true,
      configurable: true
    });

    // Mock document.contains
    document.contains = vi.fn(() => true);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    keydownListener = null;
  });

  it('should focus the initial element when activated', () => {
    const containerRef = { current: container as unknown as HTMLElement };
    const initialFocusRef = { current: initialFocusElement as unknown as HTMLElement };

    renderHook(() => useFocusTrap(containerRef, {
      isActive: true,
      initialFocusRef,
    }));

    // Fast-forward timers to trigger the setTimeout
    vi.advanceTimersByTime(20);

    expect(initialFocusElement.focus).toHaveBeenCalled();
  });

  it('should focus the first focusable element when no initial focus ref is provided', () => {
    const containerRef = { current: container as unknown as HTMLElement };

    renderHook(() => useFocusTrap(containerRef, {
      isActive: true,
    }));

    // Fast-forward timers to trigger the setTimeout
    vi.advanceTimersByTime(20);

    expect(firstFocusable.focus).toHaveBeenCalled();
  });

  it('should handle Escape key press', () => {
    const onEscape = vi.fn();
    const containerRef = { current: container as unknown as HTMLElement };

    renderHook(() => useFocusTrap(containerRef, {
      isActive: true,
      onEscape,
    }));

    // Simulate Escape key press
    if (keydownListener) {
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      escapeEvent.preventDefault = vi.fn();
      keydownListener(escapeEvent);
    }

    expect(onEscape).toHaveBeenCalled();
  });

  it('should trap focus within container on Tab key', () => {
    const containerRef = { current: container as unknown as HTMLElement };
    
    // Mock activeElement to be the second focusable element
    Object.defineProperty(document, 'activeElement', {
      value: secondFocusable,
      writable: true
    });

    renderHook(() => useFocusTrap(containerRef, {
      isActive: true,
    }));

    // Simulate Tab key press (should wrap to first element)
    if (keydownListener) {
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      tabEvent.preventDefault = vi.fn();
      keydownListener(tabEvent);
    }

    expect(firstFocusable.focus).toHaveBeenCalled();
  });

  it('should handle Shift+Tab to move backwards', () => {
    const containerRef = { current: container as unknown as HTMLElement };
    
    // Mock activeElement to be the first focusable element
    Object.defineProperty(document, 'activeElement', {
      value: firstFocusable,
      writable: true
    });

    renderHook(() => useFocusTrap(containerRef, {
      isActive: true,
    }));

    // Simulate Shift+Tab key press (should wrap to last element)
    if (keydownListener) {
      const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
      shiftTabEvent.preventDefault = vi.fn();
      keydownListener(shiftTabEvent);
    }

    expect(secondFocusable.focus).toHaveBeenCalled();
  });

  it('should return focus to the return element when deactivated', () => {
    const containerRef = { current: container as unknown as HTMLElement };
    const returnFocusRef = { current: returnFocusElement as unknown as HTMLElement };

    const { rerender } = renderHook(
      ({ isActive }) => useFocusTrap(containerRef, {
        isActive,
        returnFocusRef,
      }),
      { initialProps: { isActive: true } }
    );

    // Deactivate the focus trap
    rerender({ isActive: false });

    // Fast-forward timers to trigger the setTimeout in cleanup
    vi.advanceTimersByTime(20);

    expect(returnFocusElement.focus).toHaveBeenCalled();
  });

  it('should not activate when isActive is false', () => {
    const containerRef = { current: container as unknown as HTMLElement };
    const initialFocusRef = { current: initialFocusElement as unknown as HTMLElement };

    renderHook(() => useFocusTrap(containerRef, {
      isActive: false,
      initialFocusRef,
    }));

    // Fast-forward timers
    vi.advanceTimersByTime(20);

    expect(initialFocusElement.focus).not.toHaveBeenCalled();
    expect(document.addEventListener).not.toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should focus first element when current focus is outside container', () => {
    const containerRef = { current: container as unknown as HTMLElement };
    const outsideElement = new MockHTMLElement('button', true);
    
    // Mock container.contains to return false for outside element
    container.contains = vi.fn((element) => element !== (outsideElement as unknown as Element));
    
    // Mock activeElement to be outside the container
    Object.defineProperty(document, 'activeElement', {
      value: outsideElement,
      writable: true
    });

    renderHook(() => useFocusTrap(containerRef, {
      isActive: true,
    }));

    // Simulate Tab key press
    if (keydownListener) {
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      tabEvent.preventDefault = vi.fn();
      keydownListener(tabEvent);
    }

    expect(firstFocusable.focus).toHaveBeenCalled();
  });
});