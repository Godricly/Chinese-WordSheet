
import React, { useEffect, useState, useMemo } from 'react';
import GridCell from './GridCell';
import { WorksheetConfig, GeminiCharData } from '../types';

interface CharacterRowProps {
  data: GeminiCharData;
  config: WorksheetConfig;
}

interface StrokeData {
  strokes: string[];
  medians: number[][][];
}

const CharacterRow: React.FC<CharacterRowProps> = ({ data, config }) => {
  const [strokeData, setStrokeData] = useState<StrokeData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
    const char = encodeURIComponent(data.char);
    fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${char}.json`)
      .then(res => {
        if (!res.ok) throw new Error("Character data not found");
        return res.json();
      })
      .then(json => setStrokeData(json))
      .catch(err => {
        console.error("Failed to load stroke data", err);
        setError(true);
      });
  }, [data.char]);

  const renderStrokeStep = (visibleCount: number, highlightMode: 'step' | 'full' | 'trace') => {
    if (!strokeData) return null;

    return (
      <svg 
        viewBox="0 0 1024 1024" 
        className="w-[85%] h-[85%]"
        style={{ transform: 'scale(1, -1)' }} 
      >
        <g strokeLinecap="round" strokeLinejoin="round">
          {(highlightMode === 'step') && strokeData.strokes.map((path, i) => (
            <path key={`skeleton-${i}`} d={path} fill="#F1F5F9" />
          ))}

          {strokeData.strokes.slice(0, visibleCount).map((path, i) => {
            let fill = "#000000";
            let opacity = 1;

            if (highlightMode === 'trace') {
              fill = "#000000";
              opacity = 0.15;
            } else if (highlightMode === 'step') {
              const isCurrentStroke = i === visibleCount - 1;
              fill = isCurrentStroke ? "#EF4444" : "#94A3B8"; 
            }

            return (
              <path 
                key={`stroke-${i}`} 
                d={path} 
                fill={fill}
                style={{ opacity }}
              />
            );
          })}
        </g>
      </svg>
    );
  };

  return (
    <div className="flex flex-col mb-12 break-inside-avoid">
      <div className="flex justify-between items-end mb-3 border-b-2 border-slate-100 pb-1 px-1">
        <div className="flex gap-4 items-baseline">
          <span className="text-3xl font-bold text-slate-900 hanzi-font leading-none">{data.char}</span>
          {config.showPinyin && (
            <span className="text-xl font-medium text-slate-500 tracking-tight">{data.pinyin}</span>
          )}
          {config.showMeaning && (
            <span className="text-sm text-slate-400 font-light italic truncate max-w-[200px]">{data.meaning}</span>
          )}
        </div>
        <div className="text-[10px] text-slate-300 font-black uppercase tracking-widest">
          {strokeData ? `${strokeData.strokes.length} Strokes` : error ? 'No Data' : 'Loading...'}
        </div>
      </div>

      <div className="flex flex-wrap border-l border-t" style={{ borderColor: config.gridColor }}>
        
        {/* 1. The Reference Character - Toggle between Font or SVG Path */}
        <GridCell 
          type={config.gridType} 
          color={config.gridColor} 
          size={config.fontSize}
          content={config.useFontForReference ? data.char : undefined}
        >
          {!config.useFontForReference && strokeData && renderStrokeStep(strokeData.strokes.length, 'full')}
        </GridCell>

        {/* 2. Progressive Decomposition (Always SVG Path for accuracy) */}
        {strokeData && config.showStrokeOrder && strokeData.strokes.map((_, index) => (
          <GridCell 
            key={`step-${index}`}
            type={config.gridType} 
            color={config.gridColor} 
            size={config.fontSize}
          >
            {renderStrokeStep(index + 1, 'step')}
          </GridCell>
        ))}

        {/* 3. The Tracing Cell */}
        {strokeData && config.showTracing && (
          <GridCell 
            type={config.gridType} 
            color={config.gridColor} 
            size={config.fontSize}
            content={config.useFontForReference ? data.char : undefined}
            opacity={config.useFontForReference ? 0.15 : 1}
          >
            {!config.useFontForReference && renderStrokeStep(strokeData.strokes.length, 'trace')}
          </GridCell>
        )}

        {/* 4. Empty Practice Boxes */}
        {Array.from({ length: config.gridCount }).map((_, i) => (
          <GridCell 
            key={`empty-${i}`} 
            type={config.gridType} 
            color={config.gridColor} 
            size={config.fontSize} 
          />
        ))}

        {error && (
          <div 
            className="flex-1 p-4 text-sm text-red-400 bg-red-50 italic border-r border-b flex items-center justify-center min-h-[60px]"
            style={{ borderColor: config.gridColor }}
          >
            Stroke sequence unavailable for "{data.char}"
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterRow;
