"use client";
import { useState } from "react";
// import { Bell, MessageSquare, Settings } from "lucide-react";
import { Bell , MessageSquare , Settings} from "lucide-react";

// import ResourceForm from "@/components/dashboard/ResourceFrom";
// import { SingleDoughnut } from "@/components/dashboard/SingleDoughnut";
import { Router } from "next/router";
import MyResourcesDialog from "@/components/dashboard/MyResourcesDialog";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { StatCard } from "@/components/dashboard/StatCard";
import ResourceForm from "@/components/dashboard/ResourceForm";
import { SingleDoughnut } from "@/components/dashboard/SingleDoughnut";
// import { DoughnutChart } from '@/components/ui/doughnut-chart';

export default function DashboardPage() {
  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);
  const [isMyResourcesOpen, setIsMyResourcesOpen] = useState(false);
  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Department Section */}
        <SectionCard title="Department">
          <div className="flex gap-4">
            <StatCard
              icon={
                <svg
                  className="w-6 h-6 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 17H4V12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 7H15V12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              value="500"
              label="Registered"
              trend="+"
              trendValue="4% (30 days)"
              bgColor="bg-green-100"
              textColor="text-green-500"
            />

            <StatCard
              icon={
                <svg
                  className="w-6 h-6 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M7 17V13.5V10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 17V7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 17V13.5V10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              value="357"
              label="Collaborating"
              trend="+"
              trendValue="4% (30 days)"
              bgColor="bg-blue-100"
              textColor="text-blue-500"
            />
          </div>
        </SectionCard>

        {/* Resources Section */}
        {/* Resources Section */}
        <SectionCard
          title="Resources"
          action={
            <div className="flex gap-2">
              <button
                // onClick={() => Router.push('/resources')}
                onClick={() => setIsMyResourcesOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 hover:cursor-pointer transition-colors flex items-center gap-2 text-sm"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6H20M4 12H20M4 18H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                My Resources
              </button>
              <button
                onClick={() => setIsResourceFormOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 hover:cursor-pointer transition-colors flex items-center gap-2 text-sm"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add Resource
              </button>
            </div>
          }
        >
          <div className="flex gap-4">
            <StatCard
              icon={
                <svg
                  className="w-6 h-6 text-purple-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 13.2L8.45455 18.6L21 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              value="540K"
              label="Registered"
              trend="+"
              trendValue="4% (30 days)"
              bgColor="bg-purple-100"
              textColor="text-purple-500"
            />
            <StatCard
              icon={
                <svg
                  className="w-6 h-6 text-orange-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 9L12 16L5 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              value="252K"
              label="Requested"
              trend="+"
              trendValue="4% (30 days)"
              bgColor="bg-orange-100"
              textColor="text-orange-500"
            />
            <StatCard
              icon={
                <svg
                  className="w-6 h-6 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 15L12 8L19 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              value="200K"
              label="Shared"
              trend="+"
              trendValue="4% (30 days)"
              bgColor="bg-green-100"
              textColor="text-green-500"
            />
          </div>
        </SectionCard>
        <ResourceForm
          isOpen={isResourceFormOpen}
          onClose={() => setIsResourceFormOpen(false)}
        />
        <MyResourcesDialog
        
          isOpen={isMyResourcesOpen}
          onClose={() => setIsMyResourcesOpen(false)}
        />
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Department Statistics</h2>
          </div>
          <div className="h-64 flex justify-around items-center">
            <SingleDoughnut
              percentage={81}
              label="Collaborating Departments"
              color="#ef4444"
              size={120}
            />
            <SingleDoughnut
              percentage={21}
              label="Resources Shared"
              color="#22c55e"
              size={120}
            />
            <SingleDoughnut
              percentage={20}
              label="Conflicting Projects"
              color="#93c5fd"
              size={120}
            />
          </div>
        </div>

        {/* Projects Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Projects</h2>
            <button className="text-blue-500 flex items-center gap-2">
              <span>Save Report</span>
              <span>↓</span>
            </button>
          </div>
          {/* Placeholder for actual chart implementation */}
          <div className="h-64 bg-blue-50 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
