"use client";

export const PerformanceGauge = ({ percentage = 85 }: { percentage?: number }) => {
  const size = 280;
  const center = size / 2;
  const strokeWidth = 16;
  const radius = (size - strokeWidth * 2) / 2;
  
  const circumference = 2 * Math.PI * radius;
  const halfCircumference = circumference / 2;
  
  const progress = (percentage / 100) * halfCircumference;
  const offset = halfCircumference - progress;

  return (
    <div className="relative flex flex-col items-center justify-center pt-8">
      <svg 
        width={size} 
        height={size / 2 + 20} 
        viewBox={`0 0 ${size} ${size / 2 + 20}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b8912e" />
            <stop offset="100%" stopColor="#f5d17a" />
          </linearGradient>
        </defs>
        
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#18181b"
          strokeWidth={strokeWidth}
          strokeDasharray={`${halfCircumference} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(180 ${center} ${center})`}
        />

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${halfCircumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          transform={`rotate(180 ${center} ${center})`}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        <span className="text-7xl font-serif text-white">{percentage}%</span>
      </div>
    </div>
  );
};