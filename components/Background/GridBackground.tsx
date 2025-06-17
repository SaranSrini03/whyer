// components/GridBackground.tsx
import React from 'react';

interface GridBackgroundProps {
  opacity?: number;
  color?: string;
  strokeWidth?: string;
  size?: number;
  className?: string;
}

const GridBackground: React.FC<GridBackgroundProps> = ({
  opacity = 0.03,
  color = 'fde047', // Default yellow-400 color
  strokeWidth = '0.7',
  size = 60,
  className = '',
}) => {
  const svgData = `%3Csvg width='${size}' height='${size}' viewBox='0 0 ${size} ${size}' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23${color}' stroke-width='${strokeWidth}'%3E%3Cpath d='M0 0h${size}v${size}H0z'/%3E%3C/g%3E%3C/svg%3E`;

  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,${svgData}")`,
      }}
    />
  );
};

export default GridBackground;