"use client";

interface SingleDoughnutProps {
  percentage: number;
  label: string;
  color: string;
  size?: number;
}

export function SingleDoughnut({
  percentage,
  label,
  color,
  size = 96, // default size of 96px (w-24 h-24)
}: SingleDoughnutProps) {
  return (
    <div className="text-center w-40">
      <div className="relative mx-auto" style={{ width: size, height: size }}>
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#f1f1f1"
            strokeWidth="12"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={`${percentage * 2.51} 251`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold">{percentage}%</span>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600 px-2">{label}</div>
    </div>
  );
}
