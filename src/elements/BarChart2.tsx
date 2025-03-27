"use client"

import { Footprints, Waves } from "lucide-react"
import { Bar, BarChart, XAxis } from "recharts"

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
const chartData = [
  { year: "2015", running: 450, swimming: 300 },
  { year: "2016", running: 380, swimming: 420 },
  { year: "2017", running: 520, swimming: 120 },
  { year: "2018", running: 140, swimming: 550 },
  { year: "2019", running: 600, swimming: 350 },
  { year: "2020", running: 480, swimming: 400 },
]

const chartConfig = {
  running: {
    label: "Total Solid Waste",
    color: "black",
  },
  swimming: {
    label: "Total Tons Recycling",
    color: "#334155",
  },
} satisfies ChartConfig

export function ComponentBarChart2() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className=" text-center">Waste & Recycling</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 4)}

            />
            <Bar
              dataKey="running"
              stackId="a"
              fill="var(--color-running)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="swimming"
              stackId="a"
              fill="var(--color-swimming)"
              radius={[4, 4, 0, 0]}
            />
           <ChartTooltip
              content={<ChartTooltipContent hideIndicator hideLabel />}
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
