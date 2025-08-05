/// <reference types="vite/client" />

declare module "*.css" {
  const content: string;
  export default content;
}

// Extend HTML attributes to include popover API
declare namespace React {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    popover?: "auto" | "manual" | "hint" | string;
    onToggle?: (event: Event) => void;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ButtonHTMLAttributes<T> {
    popovertarget?: string;
    popovertargetaction?: "toggle" | "show" | "hide";
  }
}

// Toggle event interface
interface PopoverToggleEvent extends Event {
  newState: "open" | "closed";
  oldState: "open" | "closed";
}

// Extend HTMLElement to include popover methods
declare global {
  interface HTMLElement {
    showPopover?(): void;
    hidePopover?(): void;
    togglePopover?(): void;
  }
}
