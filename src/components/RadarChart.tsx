import React from 'react';
import { TopicPerformance } from '../types/exam';

interface RadarChartProps {
  data: TopicPerformance[];
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, size = 320 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-xs">
        لا توجد بيانات محاور كافية للرسم البياني
      </div>
    );
  }

  // Ensure at least 3 points for a valid radar polygon, or clone if fewer
  const chartItems = data.length < 3 
    ? [...data, ...data].slice(0, 3) 
    : data;

  const totalPoints = chartItems.length;
  const center = size / 2;
  const radius = center - 40;
  const angleStep = (Math.PI * 2) / totalPoints;

  // Concentric polygon levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = radius * Math.min(1, Math.max(0, value / 100));
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const dataPoints = chartItems.map((item, idx) => getCoordinates(item.percentage, idx));
  const polygonPath = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background web rings */}
        {levels.map((level, lvlIdx) => {
          const ringPoints = chartItems.map((_, idx) => {
            const angle = idx * angleStep - Math.PI / 2;
            const r = radius * level;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(' ');

          return (
            <polygon
              key={lvlIdx}
              points={ringPoints}
              fill={lvlIdx === levels.length - 1 ? '#f8fafc' : 'none'}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray={lvlIdx < levels.length - 1 ? '2 2' : 'none'}
            />
          );
        })}

        {/* Spoke lines */}
        {chartItems.map((_, idx) => {
          const angle = idx * angleStep - Math.PI / 2;
          const endX = center + radius * Math.cos(angle);
          const endY = center + radius * Math.sin(angle);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={endX}
              y2={endY}
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={polygonPath}
          fill="rgba(99, 102, 241, 0.25)"
          stroke="#4f46e5"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Data point dots */}
        {dataPoints.map((point, idx) => (
          <circle
            key={idx}
            cx={point.x}
            cy={point.y}
            r="4.5"
            fill="#4f46e5"
            stroke="#ffffff"
            strokeWidth="2"
          />
        ))}

        {/* Axis Labels */}
        {chartItems.map((item, idx) => {
          const angle = idx * angleStep - Math.PI / 2;
          const labelDist = radius + 22;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);

          return (
            <g key={idx}>
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[11px] font-medium fill-slate-700"
              >
                {item.topic.length > 14 ? item.topic.substring(0, 14) + '...' : item.topic}
              </text>
              <text
                x={lx}
                y={ly + 12}
                textAnchor="middle"
                className="text-[10px] font-mono fill-indigo-600 font-semibold tabular-nums"
              >
                {item.percentage}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
