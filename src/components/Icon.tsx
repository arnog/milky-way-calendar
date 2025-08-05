import Tooltip from "./Tooltip";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface IconProps {
  name: string;
  title?: string;
  className?: string;
  size?: IconSize;
  baselineOffset?: number;
}

// Size mapping to CSS classes
const sizeToClassName: Record<IconSize, string> = {
  xs: "global-icon-xs",
  sm: "global-icon-sm",
  md: "global-icon-md",
  lg: "global-icon-lg",
  xl: "global-icon-xl",
};

// SVG Icon component with modern tooltip and baseline offset
export const Icon = ({
  name,
  title,
  className = "",
  size = "md", // Default to medium size
  baselineOffset = 0,
}: IconProps) => {
  const style =
    baselineOffset !== 0
      ? { transform: `translateY(${baselineOffset}px)` }
      : undefined;

  // Combine size class with custom className
  const sizeClass = sizeToClassName[size];
  const combinedClassName = className ? `${sizeClass} ${className}` : sizeClass;

  const iconElement = (
    <svg className={combinedClassName} style={style}>
      <use href={`/icons.svg#${name}`} />
    </svg>
  );

  if (title) return <Tooltip content={title}>{iconElement}</Tooltip>;

  return iconElement;
};
