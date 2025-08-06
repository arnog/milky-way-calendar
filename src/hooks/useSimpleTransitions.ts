import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Simple, reliable page transitions using CSS opacity
 * Works in all browsers with graceful degradation
 */
export function useSimpleTransitions() {
  const navigate = useNavigate();

  const transitionTo = useCallback(
    (to: string, options?: { replace?: boolean }) => {
      // Add fade-out class
      document.body.classList.add('page-fade-out');

      // Navigate after fade-out
      setTimeout(() => {
        navigate(to, options);
        
        // Remove fade-out and add fade-in
        document.body.classList.remove('page-fade-out');
        document.body.classList.add('page-fade-in');
        
        // Clean up fade-in class
        setTimeout(() => {
          document.body.classList.remove('page-fade-in');
        }, 300);
      }, 150);
    },
    [navigate]
  );

  const handleClick = useCallback(
    (to: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      // Only prevent default if we're on the same origin
      if (event.currentTarget.href.startsWith(window.location.origin)) {
        event.preventDefault();
        transitionTo(to);
      }
    },
    [transitionTo]
  );

  return { transitionTo, handleClick };
}