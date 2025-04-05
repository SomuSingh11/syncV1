"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

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
} from "@/components/ui/chart"

const chartConfig = {
  conflicts: {
    label: "Conflicts",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function ProjectConflictGraph() {
  const conflicts = useQuery(api.projectConflicts.getAll);

  const getMonthlyConflicts = () => {
    const monthlyData = [];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    for (let i = 0; i < months.length; i++) {
      const conflictCount = conflicts?.filter(conflict => {
        const conflictDate = new Date(conflict?.conflictDetails?.temporalOverlap?.startDate || 0);
        return conflictDate.getMonth() === i && conflict.status === "detected";
      }).length || 0;
  
      monthlyData.push({
        month: months[i],
        conflicts: conflictCount,
      });
    }
    return monthlyData;
  };

  const currentMonthConflicts = conflicts?.filter(c => {
    const date = new Date(c.conflictDetails?.temporalOverlap?.startDate || 0);
    const currentMonth = new Date().getMonth();
    return date.getMonth() === currentMonth && c.status === "detected";
  }).length || 0;

  const lastMonthConflicts = conflicts?.filter(c => {
    const date = new Date(c.conflictDetails?.temporalOverlap?.startDate || 0);
    const lastMonth = new Date().getMonth() - 1;
    return date.getMonth() === lastMonth && c.status === "detected";
  }).length || 0;

  const percentageChange = lastMonthConflicts ? 
    ((currentMonthConflicts - lastMonthConflicts) / lastMonthConflicts) * 100 : 0;

  return (
    <Card className="w-1/3">
      <CardHeader>
        <CardTitle>Project Conflicts</CardTitle>
        <CardDescription>Monthly conflict distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={getMonthlyConflicts()}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="conflicts"
              type="monotone"
              stroke="hsl(210, 100%, 50%)"
              strokeWidth={3}
              connectNulls={true}
              isAnimationActive={true}
              dot={{
                fill: "hsl(210, 100%, 50%)",
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {percentageChange > 0 ? 'Increased' : 'Decreased'} by {Math.abs(percentageChange).toFixed(1)}% this month 
          <TrendingUp className={`h-4 w-4 ${percentageChange > 0 ? 'text-red-500' : 'text-green-500'}`} />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing detected conflicts across all projects
        </div>
      </CardFooter>
    </Card>
  )
}