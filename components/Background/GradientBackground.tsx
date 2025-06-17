// components/GradientBackground.tsx
import React from 'react';

interface GradientBackgroundProps {
  gradients?: {
    position: 'top' | 'bottom';
    offsetX?: string;
    offsetY?: string;
    width?: string;
    height?: string;
    fromColor?: string;
    toColor?: string;
    blur?: string;
  }[];
  className?: string;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  gradients = [
    {
      position: 'top',
      offsetX: '-300px',
      offsetY: '-300px',
      width: '800px',
      height: '800px',
      fromColor: 'yellow-900/10',
      toColor: 'yellow-700/5',
      blur: '3xl'
    },
    {
      position: 'bottom',
      offsetX: '-300px',
      offsetY: '-400px',
      width: '700px',
      height: '700px',
      fromColor: 'yellow-800/15',
      toColor: 'yellow-900/10',
      blur: '3xl'
    }
  ],
  className = ''
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {gradients.map((gradient, index) => (
        <div
          key={index}
          className={`absolute ${
            gradient.position === 'top' ? 'top' : 'bottom'
          }-[${gradient.offsetY}] ${
            gradient.position === 'top' ? 'left' : 'right'
          }-[${gradient.offsetX}] w-[${gradient.width}] h-[${gradient.height}] bg-gradient-to-r from-${gradient.fromColor} to-${gradient.toColor} rounded-full blur-${gradient.blur}`}
        />
      ))}
    </div>
  );
};

export default GradientBackground;