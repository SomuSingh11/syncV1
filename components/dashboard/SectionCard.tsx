import React from "react";

interface SectionCardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function SectionCard({ title, action, children }: SectionCardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-100 via-slate-50 to-white p-6 rounded-3xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}
