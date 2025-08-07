import { useNavigate } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";

/**
 * Hook for smooth page transitions using CSS animations
 * More reliable than View Transitions API with better browser support
 */
export function usePageTransitions() {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionTo = useCallback(
    (to: string, options?: { replace?: boolean }) => {
      if (isTransitioning) return; // Prevent multiple transitions

      // Start exit animation
      setIsTransitioning(true);
      document.body.classList.add("page-transitioning-out");

      // Wait for exit animation, then navigate
      setTimeout(() => {
        navigate(to, options);

        // Start enter animation after navigation
        document.body.classList.remove("page-transitioning-out");
        document.body.classList.add("page-transitioning-in");

        // Clean up after enter animation
        setTimeout(() => {
          document.body.classList.remove("page-transitioning-in");
          setIsTransitioning(false);
        }, 300); // Match CSS animation duration
      }, 150); // Half of total transition time
    },
    [navigate, isTransitioning],
  );

  const handleClick = useCallback(
    (to: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      transitionTo(to);
    },
    [transitionTo],
  );

  return { transitionTo, handleClick, isTransitioning };
}

/**
 * Component wrapper that manages page transition classes
 */
export function usePageTransitionClasses() {
  const [transitionClass, setTransitionClass] = useState("");

  useEffect(() => {
    const handleTransitionStart = () => {
      setTransitionClass("page-exit");
    };

    const handleTransitionEnd = () => {
      setTransitionClass("page-enter");
      setTimeout(() => setTransitionClass(""), 300);
    };

    // Listen for custom events from the transition system
    document.addEventListener("page-transition-start", handleTransitionStart);
    document.addEventListener("page-transition-end", handleTransitionEnd);

    return () => {
      document.removeEventListener(
        "page-transition-start",
        handleTransitionStart,
      );
      document.removeEventListener("page-transition-end", handleTransitionEnd);
    };
  }, []);

  return transitionClass;
}
