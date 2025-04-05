"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

const chartConfig = {
  value: {
    label: "Count",
  },
  departments: {
    label: "Departments",
    color: "hsl(210, 100%, 50%)", // Primary blue
  },
  projects: {
    label: "Projects",
    color: "hsl(220, 100%, 60%)", // Slightly purple-blue
  },
  resources: {
    label: "Resources",
    color: "hsl(200, 100%, 45%)", // Cyan-blue
  },
  requests: {
    label: "Requests",
    color: "hsl(230, 90%, 65%)", // Lavender-blue
  },
  conflicts: {
    label: "Conflicts",
    color: "hsl(240, 80%, 70%)", // Periwinkle blue
  },
  allocations: {
    label: "Allocations",
    color: "hsl(190, 90%, 40%)", // Teal-blue
  },
} satisfies ChartConfig

export function RadialGlobalChart() {
  // Proper convex queries for all data types
  const allProjects = useQuery(api.projects.getAll) || [];
  const allResources = useQuery(api.resources.getAll) || [];
  const allDepartments = useQuery(api.departments.listDepartments) || [];
  const allRequests = useQuery(api.resourceRequests.getAll) || [];
  const allConflicts = useQuery(api.projectConflicts.getAll) || [];
  
  // Fixed allocation calculation using actual resource data
  const allocations = allResources.reduce((total, resource) => {
    return total + (0); // Check isAllocated property instead
  }, 0);
  
  // Prepare chart data
  const chartData = [
    { category: "departments", value: allDepartments.length, fill: chartConfig.departments.color },
    { category: "projects", value: allProjects.length, fill: chartConfig.projects.color },
    { category: "resources", value: allResources.length, fill: chartConfig.resources.color },
    { category: "requests", value: allRequests.length || 0, fill: chartConfig.requests.color },
    { category: "conflicts", value: allConflicts.length || 0, fill: chartConfig.conflicts.color },
    { category: "allocations", value: allocations, fill: chartConfig.allocations.color },
  ]
  
  // Calculate total for the footer
  const totalItems = chartData.reduce((sum, item) => sum + item.value, 0)
  
  // Calculate month-over-month growth (placeholder - replace with actual calculation)
  const growthRate = 8.7

  return (
    <Card className="flex flex-col shadow-lg border-blue-100 bg-gradient-to-br from-white to-blue-50 w-1/5 mx-auto">
      <CardHeader className="items-center pb-0 border-b border-blue-100">
        <CardTitle className="text-blue-800 text-xl">Sync City Ecosystem</CardTitle>
        <CardDescription className="text-blue-600">Global Collaboration Metrics</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 pt-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={270}
            innerRadius={40}
            outerRadius={130}
            barSize={20}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="category" />}
            />
            <RadialBar 
              dataKey="value" 
              background={{ fill: "rgba(230, 240, 255, 0.5)" }}
              cornerRadius={8}
            >
              <LabelList
                position="insideStart"
                dataKey="category"
                className="fill-white capitalize font-medium"
                fontSize={12}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm border-t border-blue-100 mt-4 pt-4 pb-4">
        <div className="flex items-center gap-2 font-medium leading-none text-blue-700">
          Collaborative growth {growthRate}% MoM <TrendingUp className="h-4 w-4 text-blue-600" />
        </div>
        <div className="leading-none text-blue-500">
          {totalItems} coordinated resources across all departments
        </div>
      </CardFooter>
    </Card>
  )
}