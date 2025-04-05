import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  trend: string;
  trendValue: string;
  bgColor: string;
  textColor: string;
}

export function StatCard({
  icon,
  value,
  label,
  trend,
  trendValue,
  bgColor,
  textColor,
}: StatCardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-100/90 via-slate-50/80 to-white rounded-2xl p-4 shadow-sm flex-1 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className={`${bgColor} p-3 rounded-full`}>{icon}</div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className={`${textColor} text-xs mt-1 flex items-center gap-1`}>
            <span>{trend}</span>
            <span>{trendValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
