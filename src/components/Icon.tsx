import { useState } from "react";

export interface IconProps {
  name: string;
  title?: string;
  className?: string;
  baselineOffset?: number;
}

// SVG Icon component with custom tooltip and baseline offset
export const Icon = ({
  name,
  title,
  className = "",
  baselineOffset = 0,
}: IconProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const style =
    baselineOffset !== 0
      ? {
          transform: `translateY(${baselineOffset}px)`,
        }
      : undefined;

  return (
    <div
      className="global-icon-wrapper"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={() => setShowTooltip(true)}
      onTouchEnd={() => setTimeout(() => setShowTooltip(false), 2000)}
    >
      <svg className={className} style={style}>
        <use href={`/icons.svg#${name}`} />
      </svg>
      {showTooltip && title && (
        <div className="global-tooltip">
          {title}
          <div className="global-tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
};
