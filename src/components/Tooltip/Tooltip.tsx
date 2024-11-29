import React, { useState } from "react";
import "./tooltip.css";

const CustomTooltip = ({
  tooltipContent,
  children,
}: {
  tooltipContent: string | null;
  children: React.ReactNode;
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setTooltipPosition({
      x: e.clientX + 5, // Add offset to position tooltip 5px to the right
      y: e.clientY - 35, // Add offset to position tooltip 35px above
    });
  };

  // Ensure we correctly return JSX
  return tooltipContent ? (
    <div className="tooltip" onMouseMove={handleMouseMove}>
      <span
        className="tooltiptext"
        style={{
          top: `${tooltipPosition.y}px`,
          left: `${tooltipPosition.x}px`,
        }}
      >
        {tooltipContent}
      </span>
      {children}
    </div>
  ) : (
    <>{children}</> // Wrap children in a React Fragment to return them properly
  );
};

export default CustomTooltip;
