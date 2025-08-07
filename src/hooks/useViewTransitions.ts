import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

/**
 * Hook for programmatic navigation with View Transitions API support
 * Falls back to regular navigation if View Transitions aren't supported
 */
export function useViewTransitions() {
  const navigate = useNavigate();

  const transitionTo = useCallback(
    (to: string, options?: { replace?: boolean }) => {
      // Check if View Transitions API is supported
      if (
        typeof document !== "undefined" &&
        "startViewTransition" in document
      ) {
        // Use View Transitions API
        (
          document as unknown as {
            startViewTransition: (callback: () => void) => void;
          }
        ).startViewTransition(() => {
          navigate(to, options);
        });
      } else {
        // Fallback to regular navigation
        navigate(to, options);
      }
    },
    [navigate],
  );

  return { transitionTo };
}

/**
 * Enhanced Link component click handler that uses View Transitions
 */
export function useViewTransitionClick() {
  const { transitionTo } = useViewTransitions();

  const handleClick = useCallback(
    (to: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      transitionTo(to);
    },
    [transitionTo],
  );

  return { handleClick };
}
