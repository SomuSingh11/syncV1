"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

const chartConfig = {
    projects: {
        label: "Projects",
        color: "hsl(210, 100%, 50%)",
    },
    resources: {
        label: "Resources",
        color: "hsl(150, 100%, 45%)",
    },
} satisfies ChartConfig

export function ResourcesAndProjectsGraph() {
    const [timeRange, setTimeRange] = React.useState("90d")
    const allProjects = useQuery(api.projects.getAll)
    const allResources = useQuery(api.resources.getAll)

    // Generate data for the chart
    const generateChartData = () => {
        if (!allProjects || !allResources) return []

        const data: { date: string; projects: number; resources: number }[] = []
        const endDate = new Date()
        const startDate = new Date()

        // Set start date based on selected time range
        if (timeRange === "90d") {
            startDate.setDate(endDate.getDate() - 90)
        } else if (timeRange === "30d") {
            startDate.setDate(endDate.getDate() - 30)
        } else if (timeRange === "7d") {
            startDate.setDate(endDate.getDate() - 7)
        }

        // Create date intervals - using daily data points
        const datePoints: Date[] = []

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            datePoints.push(new Date(d.getTime())) // Clone the date
        }

        // Count projects and resources registered each day
        datePoints.forEach(date => {
            // Create a date for display that's one day ahead
            const displayDate = new Date(date)
            displayDate.setDate(date.getDate() + 1)
            
            const nextDay = new Date(date)
            nextDay.setDate(date.getDate() + 1)

            // Count projects registered on this specific day
            const projectsCount = allProjects.filter(project => {
                const projectDate = new Date(project.createdAt)
                return projectDate >= date && projectDate < nextDay
            }).length

            // Count resources registered on this specific day
            const resourcesCount = allResources.filter(resource => {
                const resourceDate = new Date(resource.createdAt)
                return resourceDate >= date && resourceDate < nextDay
            }).length

            data.push({
                // Use the display date (one day ahead) for the chart
                date: displayDate.toISOString().split('T')[0],
                projects: projectsCount,
                resources: resourcesCount
            })
        })

        return data
    }

    const chartData = generateChartData()

    return (
        <Card className="w-5/6 gap-1">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Platform Registrations</CardTitle>
                    <CardDescription>
                        Daily registrations of projects and resources
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select time range"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="fillProjects" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="hsl(210, 100%, 50%)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="hsl(210, 100%, 50%)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillResources" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="hsl(150, 100%, 45%)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="hsl(150, 100%, 45%)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="resources"
                            type="monotone"
                            fill="url(#fillResources)"
                            stroke="hsl(150, 100%, 45%)"
                            strokeWidth={2}
                        />
                        <Area
                            dataKey="projects"
                            type="monotone"
                            fill="url(#fillProjects)"
                            stroke="hsl(210, 100%, 50%)"
                            strokeWidth={2}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}