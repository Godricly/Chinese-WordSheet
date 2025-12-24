
import React from 'react';
import { GridType } from '../types';

interface GridCellProps {
  type: GridType;
  color: string;
  size: number;
  content?: string;
  opacity?: number;
  children?: React.ReactNode;
}

const GridCell: React.FC<GridCellProps> = ({ type, color, size, content, opacity = 1, children }) => {
  const halfSize = size / 2;
  
  return (
    <div 
      className="relative overflow-hidden flex items-center justify-center bg-white border-r border-b"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        borderColor: color,
        borderWidth: '0.5px' 
      }}
    >
      {/* Grid Lines */}
      {type !== 'none' && (
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          style={{ stroke: color, strokeWidth: '0.5', strokeDasharray: '2 2' }}
        >
          {/* Horizontal line */}
          <line x1="0" y1={halfSize} x2={size} y2={halfSize} />
          {/* Vertical line */}
          <line x1={halfSize} y1="0" x2={halfSize} y2={size} />
          
          {type === 'mi' && (
            <>
              {/* Diagonals */}
              <line x1="0" y1="0" x2={size} y2={size} />
              <line x1={size} y1="0" x2="0" y2={size} />
            </>
          )}
        </svg>
      )}

      {/* Content Rendering (Tracing or Solid) */}
      {content && (
        <span 
          className="hanzi-font z-10 select-none pointer-events-none" 
          style={{ 
            fontSize: `${size * 0.8}px`, 
            color: 'black', 
            opacity: opacity 
          }}
        >
          {content}
        </span>
      )}
      
      {/* Dynamic Children (SVG Strokes) */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default GridCell;
