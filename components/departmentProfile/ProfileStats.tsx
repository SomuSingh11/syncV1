import { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

interface ProfileStatsProps {
  stats: StatItem[];
}

export const ProfileStats = ({ stats }: ProfileStatsProps) => {
  return (
    <div className="grid grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
