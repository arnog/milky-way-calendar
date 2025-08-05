import React, { useRef, useEffect, useId } from "react";
import styles from "./Tooltip.module.css";

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  placement?: "top" | "bottom" | "left" | "right";
  disabled?: boolean;
}

export default function Tooltip({ 
  content, 
  children, 
  placement = "top",
  disabled = false 
}: TooltipProps) {
  const tooltipId = useId();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);

  // Force manual mode for all tooltips since hint mode is unreliable in Chrome
  const popoverType = 'manual';

  useEffect(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    
    if (!trigger || !tooltip || disabled) return;
    
    // Check if the trigger already has popovertarget
    const hasPopoverTarget = trigger.getAttribute('popovertarget');
    
    // We can still show tooltips for buttons with popovertarget,
    // but we need to be more careful about timing and conflicts

    let showTimeout: number;
    let hideTimeout: number;

    const showTooltip = () => {
      clearTimeout(hideTimeout);
      showTimeout = setTimeout(() => {
        try {
          // If the trigger has a popovertarget, check if that popover is already open
          if (hasPopoverTarget) {
            const targetPopover = document.getElementById(hasPopoverTarget);
            if (targetPopover && targetPopover.matches(':popover-open')) {
              // Don't show tooltip if the target popover is already open
              return;
            }
          }
          
          tooltip.showPopover();
          
          // Position tooltip relative to trigger after showing
          setTimeout(() => {
            const triggerRect = trigger.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            let top, left;
            
            switch(placement) {
              case 'top':
                top = triggerRect.top - tooltipRect.height - 8;
                left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                break;
              case 'bottom':
                top = triggerRect.bottom + 8;
                left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                break;
              case 'left':
                top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                left = triggerRect.left - tooltipRect.width - 8;
                break;
              case 'right':
                top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                left = triggerRect.right + 8;
                break;
            }
            
            // Keep tooltip within viewport
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            left = Math.max(8, Math.min(left, viewportWidth - tooltipRect.width - 8));
            top = Math.max(8, Math.min(top, viewportHeight - tooltipRect.height - 8));
            
            tooltip.style.setProperty('position', 'fixed', 'important');
            tooltip.style.setProperty('left', `${left}px`, 'important');
            tooltip.style.setProperty('top', `${top}px`, 'important');
            tooltip.style.setProperty('right', 'auto', 'important');
            tooltip.style.setProperty('bottom', 'auto', 'important');
          }, 10);
        } catch {
          // Ignore if already showing or if there's a conflict
        }
      }, 500); // Small delay for better UX
    };

    const hideTooltip = () => {
      clearTimeout(showTimeout);
      hideTimeout = setTimeout(() => {
        try {
          tooltip.hidePopover();
        } catch {
          // Ignore if already hidden
        }
      }, 100);
    };

    // Mouse events
    trigger.addEventListener('mouseenter', showTooltip);
    trigger.addEventListener('mouseleave', hideTooltip);
    
    // Focus events for keyboard accessibility
    trigger.addEventListener('focus', showTooltip);
    trigger.addEventListener('blur', hideTooltip);

    // If trigger has a popovertarget, hide tooltip when that popover opens
    let targetPopover: HTMLElement | null = null;
    let popoverToggleHandler: ((event: Event) => void) | null = null;
    
    if (hasPopoverTarget) {
      targetPopover = document.getElementById(hasPopoverTarget);
      if (targetPopover) {
        popoverToggleHandler = (event: Event) => {
          const toggleEvent = event as PopoverToggleEvent;
          if (toggleEvent.newState === 'open') {
            // Hide tooltip when target popover opens
            try {
              tooltip.hidePopover();
            } catch {
              // Ignore if already hidden
            }
          }
        };
        targetPopover.addEventListener('toggle', popoverToggleHandler);
      }
    }

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
      trigger.removeEventListener('mouseenter', showTooltip);
      trigger.removeEventListener('mouseleave', hideTooltip);
      trigger.removeEventListener('focus', showTooltip);
      trigger.removeEventListener('blur', hideTooltip);
      
      // Clean up popover toggle listener
      if (targetPopover && popoverToggleHandler) {
        targetPopover.removeEventListener('toggle', popoverToggleHandler);
      }
    };
  }, [disabled, popoverType, placement]);

  if (disabled) {
    return children;
  }

  // Check if the trigger already has popovertarget (avoid conflicts)
  const hasPopoverTarget = children.props.popovertarget;
  
  // Clone the trigger element to add necessary props
  const trigger = React.cloneElement(children, {
    ref: triggerRef,
    'aria-describedby': hasPopoverTarget ? undefined : tooltipId
  });

  return (
    <>
      {trigger}
      <div
        ref={tooltipRef}
        id={tooltipId}
        popover={popoverType}
        role="tooltip"
        className={`${styles.tooltip} ${styles[`tooltip--${placement}`]}`}
        aria-hidden="true"
      >
        {content}
      </div>
    </>
  );
}