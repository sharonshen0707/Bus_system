import React, { useState } from 'react';
import { DelayTrendPoint, ReportCategory } from '../types';

// Delay Trend multi-line chart
interface LineChartProps {
  data: DelayTrendPoint[];
}

export function DelayTrendLineChart({ data }: LineChartProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const width = 500;
  const height = 180;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max value on Y axis is 40 (mins)
  const maxY = 40;

  // Helper points calculators
  const getX = (index: number) => paddingLeft + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => height - paddingBottom - (val / maxY) * chartHeight;

  // Build svg paths for the 3 lines (132, 172, 9025A)
  const linePath132 = data.map((d, idx) => `${getX(idx)},${getY(d.route132)}`).join(' L ');
  const linePath172 = data.map((d, idx) => `${getX(idx)},${getY(d.route172)}`).join(' L ');
  const linePath9025A = data.map((d, idx) => `${getX(idx)},${getY(d.route9025A)}`).join(' L ');

  return (
    <div className="relative w-full h-[180px] bg-transparent rounded-xl select-none group/chart">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        {/* Horizontal grid lines and Y-axis text */}
        {[0, 10, 20, 30, 40].map((val) => {
          const y = getY(val);
          return (
            <g key={val} className="opacity-40">
              <line 
                x1={paddingLeft} 
                y1={y} 
                x2={width - paddingRight} 
                y2={y} 
                stroke="#334155" 
                strokeWidth="1" 
                strokeDasharray="4,4" 
              />
              <text 
                x={paddingLeft - 8} 
                y={y + 3} 
                textAnchor="end" 
                className="text-[9px] font-bold font-mono fill-slate-500"
              >
                {val}分
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((d, idx) => {
          const x = getX(idx);
          return (
            <text
              key={idx}
              x={x}
              y={height - 6}
              textAnchor="middle"
              className="text-[9.5px] font-semibold font-mono fill-slate-500"
            >
              {d.time}
            </text>
          );
        })}

        {/* The 3 Lines with standard styles and drop-shadow glow */}
        {/* Line 132 in Emerald (Green) */}
        <path
          d={`M ${linePath132}`}
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 hover:stroke-emerald-400"
        />

        {/* Line 172 in Blue */}
        <path
          d={`M ${linePath172}`}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 hover:stroke-blue-400"
        />

        {/* Line 9025A in Golden Amber */}
        <path
          d={`M ${linePath9025A}`}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 hover:stroke-amber-400"
        />

        {/* Interactive hover guides and overlay sensors */}
        {data.map((d, idx) => {
          const x = getX(idx);
          const isHovered = activeIdx === idx;

          return (
            <g key={idx}>
              {/* Vertical guideline */}
              {isHovered && (
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={height - paddingBottom}
                  stroke="#475569"
                  strokeWidth="1.2"
                  strokeDasharray="2,2"
                />
              )}

              {/* Data points for 132 */}
              <circle
                cx={x}
                cy={getY(d.route132)}
                r={isHovered ? "4.5" : "3"}
                fill="#10b981"
                stroke="#16191f"
                strokeWidth="1.5"
                className="transition-all shadow-md"
              />

              {/* Data points for 172 */}
              <circle
                cx={x}
                cy={getY(d.route172)}
                r={isHovered ? "4.5" : "3"}
                fill="#3b82f6"
                stroke="#16191f"
                strokeWidth="1.5"
                className="transition-all shadow-md"
              />

              {/* Data points for 9025A */}
              <circle
                cx={x}
                cy={getY(d.route9025A)}
                r={isHovered ? "4.5" : "3"}
                fill="#f59e0b"
                stroke="#16191f"
                strokeWidth="1.5"
                className="transition-all shadow-md"
              />

              {/* Invisible interactive hover rect bar */}
              <rect
                x={x - (chartWidth / (data.length - 1)) / 2}
                y={paddingTop}
                width={chartWidth / (data.length - 1)}
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
              />
            </g>
          );
        })}
      </svg>

      {/* Embedded Tooltip Overlay on hovered data-point to match screenshot density */}
      {activeIdx !== null && (
        <div className="absolute top-1/2 left-[50%] translate-x-[-50%] translate-y-[-115%] bg-[#1d222b] border border-slate-700/60 shadow-xl p-2.5 rounded-xl text-white text-[10px] w-36 pointer-events-none z-10">
          <div className="font-extrabold pb-1 border-b border-slate-800 font-mono tracking-wider text-slate-300">
            🕛 時間: {data[activeIdx].time}
          </div>
          <div className="space-y-1 pt-1 font-bold">
            <div className="flex items-center justify-between text-emerald-300">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                132 路
              </span>
              <span>{data[activeIdx].route132} 分鐘</span>
            </div>
            <div className="flex items-center justify-between text-blue-300">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                172 路
              </span>
              <span>{data[activeIdx].route172} 分鐘</span>
            </div>
            <div className="flex items-center justify-between text-amber-300">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                9025A 路
              </span>
              <span>{data[activeIdx].route9025A} 分鐘</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Circular Donut breakdown of reports
interface DonutCategory {
  label: ReportCategory;
  count: number;
  color: string;
}

interface DonutProps {
  categories: DonutCategory[];
  totalReports: number;
}

export function ReportsDonutChart({ categories, totalReports }: DonutProps) {
  // SVG size variables
  const size = 150;
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 justify-around py-2 w-full text-slate-300">
      {/* Absolute center label indicator */}
      <div className="relative w-[150px] h-[150px] flex items-center justify-center">
        <svg width={size} height={size} className="transform rotate-[-90] w-full h-full scale-95">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
          />
          {categories.map((cat, idx) => {
            const percentage = (cat.count / totalReports) * 100;
            const strokeLength = (percentage / 100) * circumference;
            const strokeOffset = currentOffset;
            currentOffset += strokeLength;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={cat.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
                strokeDashoffset={-strokeOffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out hover:opacity-90"
              />
            );
          })}
        </svg>
        
        {/* Absolute center details label */}
        <div className="absolute text-center select-none">
          <div className="text-2xl font-black text-white tracking-tight font-mono">
            {totalReports}
          </div>
          <div className="text-[10px] font-bold text-slate-500 tracking-widest mt-0.5">總回報數</div>
        </div>
      </div>

      {/* Styled label metrics matching page 3 graph sidebar */}
      <div className="space-y-1.5 flex-1 w-full max-w-xs">
        {categories.map((cat, idx) => {
          const pct = ((cat.count / totalReports) * 100).toFixed(1);
          return (
            <div key={idx} className="flex items-center justify-between text-xs font-semibold group/legend p-1 hover:bg-[#1d222b] rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full transition-transform group-hover/legend:scale-125"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-slate-300 font-bold">{cat.label}</span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-white font-bold">{cat.count} 件</span>
                <span className="text-slate-500 text-[11px] font-semibold">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
