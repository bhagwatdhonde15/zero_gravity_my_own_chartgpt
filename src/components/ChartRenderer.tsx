import React, { useState } from 'react';
import { BarChart3, LineChart, PieChart, Download, Check } from 'lucide-react';
import { ChartData } from '../types/chat';

interface ChartRendererProps {
  data: ChartData;
}

const BLUE_COLOR_PALETTE = [
  '#3b82f6', // Electric Blue
  '#60a5fa', // Light Blue
  '#38bdf8', // Cyan Glow
  '#6366f1', // Indigo Blue
  '#0284c7', // Sapphire Blue
  '#06b6d4', // Deep Cyan
];

export const ChartRenderer: React.FC<ChartRendererProps> = ({ data }) => {
  const [activeHoverIndex, setActiveHoverIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const dataset = data.datasets[0] || { label: 'Data', data: [] };
  const values = dataset.data;
  const maxValue = Math.max(...values, 1);

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_chart.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 p-4 sm:p-5 bg-[#0f172a] border border-[#1e3a8a]/60 rounded-2xl shadow-xl space-y-4 font-sans select-none">
      {/* Chart Header */}
      <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30">
            {data.type === 'line' ? (
              <LineChart className="w-4 h-4" />
            ) : data.type === 'pie' || data.type === 'doughnut' ? (
              <PieChart className="w-4 h-4" />
            ) : (
              <BarChart3 className="w-4 h-4" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>{data.title}</span>
              <span className="text-[10px] text-cyan-300 bg-blue-500/20 border border-blue-500/30 px-1.5 py-0.2 rounded font-mono uppercase">
                Zero Gravity Chart
              </span>
            </h4>
            <p className="text-[11px] text-[#94a3b8]">Interactive Data Visualization</p>
          </div>
        </div>

        <button
          onClick={handleExportJSON}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-[#090d16] hover:bg-[#1e293b] border border-[#334155] text-xs text-[#f8fafc] hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Download className="w-3.5 h-3.5" />}
          <span>Export</span>
        </button>
      </div>

      {/* SVG Chart Graphic */}
      <div className="relative pt-2">
        {data.type === 'bar' || data.type === 'area' ? (
          <div className="h-56 w-full flex items-end justify-between space-x-2 pt-6 pb-6 border-b border-[#1e293b]">
            {values.map((val, idx) => {
              const heightPercent = Math.max((val / maxValue) * 100, 5);
              const color = BLUE_COLOR_PALETTE[idx % BLUE_COLOR_PALETTE.length];
              const isHovered = activeHoverIndex === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveHoverIndex(idx)}
                  onMouseLeave={() => setActiveHoverIndex(null)}
                  className="flex-1 flex flex-col items-center gap-2 group relative cursor-pointer"
                >
                  {isHovered && (
                    <div className="absolute -top-10 bg-[#090d16] border border-[#334155] px-2.5 py-1 rounded-lg text-[11px] font-mono text-white shadow-xl z-20 whitespace-nowrap animate-in fade-in duration-150">
                      <span className="font-semibold text-blue-400">{data.labels[idx]}:</span> {val.toLocaleString()}
                    </div>
                  )}

                  <div
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: color
                    }}
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      isHovered ? 'brightness-125 scale-x-105' : 'opacity-90'
                    }`}
                  />
                  <span className="text-[10px] font-mono text-[#94a3b8] truncate w-full text-center group-hover:text-white">
                    {data.labels[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        ) : data.type === 'line' ? (
          <div className="h-56 w-full relative pt-4 pb-6 border-b border-[#1e293b]">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="blueLineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {(() => {
                const points = values.map((v, i) => {
                  const x = (i / (values.length - 1 || 1)) * 480 + 10;
                  const y = 140 - (v / maxValue) * 120;
                  return `${x},${y}`;
                });
                const d = `M ${points.join(' L ')}`;
                const areaD = `${d} L 490,140 L 10,140 Z`;
                return (
                  <>
                    <path d={areaD} fill="url(#blueLineGrad)" />
                    <path d={d} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                    {values.map((v, i) => {
                      const x = (i / (values.length - 1 || 1)) * 480 + 10;
                      const y = 140 - (v / maxValue) * 120;
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="5"
                          fill="#38bdf8"
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="hover:r-7 transition-all cursor-pointer"
                        />
                      );
                    })}
                  </>
                );
              })()}
            </svg>
            <div className="flex justify-between text-[10px] font-mono text-[#94a3b8] mt-2">
              {data.labels.map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-4 flex flex-col sm:flex-row items-center justify-around gap-4 border-b border-[#1e293b]">
            <div className="w-36 h-36 relative flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  const total = values.reduce((a, b) => a + b, 0) || 1;
                  let accumulatedAngle = 0;
                  return values.map((val, idx) => {
                    const percentage = val / total;
                    const strokeDasharray = `${percentage * 283} 283`;
                    const strokeDashoffset = -accumulatedAngle * 283;
                    accumulatedAngle += percentage;
                    const color = BLUE_COLOR_PALETTE[idx % BLUE_COLOR_PALETTE.length];

                    return (
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r="45"
                        fill="transparent"
                        stroke={color}
                        strokeWidth="18"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    );
                  });
                })()}
              </svg>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              {data.labels.map((label, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: BLUE_COLOR_PALETTE[idx % BLUE_COLOR_PALETTE.length] }}
                  />
                  <span className="text-white font-medium">{label}:</span>
                  <span className="text-[#94a3b8]">{values[idx]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
