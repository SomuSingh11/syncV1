"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

interface ProjectTimelineProps {
  departmentId: string;
}

export function ProjectTimelineComponent({ departmentId }: ProjectTimelineProps) {
  const allProjects = useQuery(api.projects.getAll);
  const departmentProjects = useQuery(api.projects.getByDepartment, {
    departmentId: departmentId as Id<"departments">,
  });

  const getMonthlyData = () => {
    const monthlyData = [];
    const currentYear = new Date().getFullYear();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    // Get only months with data to avoid empty bars
    for (let i = 0; i < months.length; i++) {
      const totalCount = allProjects?.filter(project => {
        const projectDate = new Date(project.startDate);
        return projectDate.getMonth() === i && projectDate.getFullYear() === currentYear;
      }).length || 0;
  
      const departmentCount = departmentProjects?.filter(project => {
        const projectDate = new Date(project.startDate);
        return projectDate.getMonth() === i && projectDate.getFullYear() === currentYear;
      }).length || 0;
  
      if (totalCount > 0) {
        monthlyData.push({
          month: months[i],
          total: totalCount,
          department: departmentCount,
        });
      }
    }
  
    return monthlyData;
  };
  
  const chartConfig = {
    total: {
      label: "All Projects",
      color: "hsl(210, 100%, 50%)",
    },
    department: {
      label: "Department Projects",
      color: "hsl(210, 80%, 85%)",
    },
    label: {
      color: "hsl(var(--background))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-1/3">
      <CardHeader>
        <CardTitle>Projects Timeline</CardTitle>
        <CardDescription>Project distribution for {new Date().getFullYear()}</CardDescription>
      </CardHeader>
      <CardContent> 
        <ChartContainer config={chartConfig}>
          <BarChart 
            accessibilityLayer 
            data={getMonthlyData()}
            layout="vertical"
            margin={{ top: 20, right: 50, left: 20, bottom: 20 }}
            barCategoryGap={8}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={false}
            />
            <Bar
              dataKey="total"
              fill="hsl(210, 100%, 50%)"
              radius={4}
            >
              <LabelList
                dataKey="total"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
            <Bar
              dataKey="department"
              fill="hsl(210, 80%, 85%)"
              radius={4}
            >
              <LabelList
                dataKey="department"
                position="insideRight"
                offset={8}
                className="fill-background"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
