import { useEffect, useRef } from 'react';

interface UseFocusTrapOptions {
  /** Whether the focus trap is active */
  isActive: boolean;
  /** Element to focus when trap becomes active */
  initialFocusRef?: React.RefObject<HTMLElement>;
  /** Element to return focus to when trap is deactivated */
  returnFocusRef?: React.RefObject<HTMLElement>;
  /** Optional callback when escape key is pressed */
  onEscape?: () => void;
}

/**
 * Custom hook that implements focus trapping for modals and popovers.
 * Keeps keyboard focus within a container element and handles Escape key.
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  options: UseFocusTrapOptions
) {
  const { isActive, initialFocusRef, returnFocusRef, onEscape } = options;
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) {
      return;
    }

    // Store the previously focused element
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement;

    // Focus the initial element or the first focusable element in the container
    const focusInitialElement = () => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        const firstFocusable = getFocusableElements(containerRef.current!)[0];
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }
    };

    // Small delay to ensure the DOM is ready
    setTimeout(focusInitialElement, 10);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!containerRef.current) return;

      // Handle Escape key
      if (event.key === 'Escape') {
        event.preventDefault();
        if (onEscape) {
          onEscape();
        }
        return;
      }

      // Handle Tab key for focus trapping
      if (event.key === 'Tab') {
        const focusableElements = getFocusableElements(containerRef.current);
        
        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const currentElement = document.activeElement as HTMLElement;

        // If current focus is outside the container, focus the first element
        if (!containerRef.current.contains(currentElement)) {
          event.preventDefault();
          firstElement.focus();
          return;
        }

        // Handle Shift+Tab (backwards)
        if (event.shiftKey) {
          if (currentElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Handle Tab (forwards)
          if (currentElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyDown);

    // Capture the return focus element at effect time to avoid stale ref issues
    const returnElement = returnFocusRef?.current;

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Return focus to the previously focused element or the specified return element
      const elementToFocus = returnElement ?? previouslyFocusedElementRef.current;
      if (elementToFocus && document.contains(elementToFocus)) {
        // Small delay to ensure the popover is fully closed
        setTimeout(() => {
          elementToFocus.focus();
        }, 10);
      }
    };
  }, [isActive, containerRef, initialFocusRef, returnFocusRef, onEscape]);
}

/**
 * Gets all focusable elements within a container.
 * Includes standard focusable elements and those with tabindex >= 0.
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');

  const elements = container.querySelectorAll(focusableSelectors) as NodeListOf<HTMLElement>;
  
  return Array.from(elements).filter(element => {
    // Check if element is visible and not hidden
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      element.offsetParent !== null &&
      !element.hasAttribute('aria-hidden')
    );
  });
}