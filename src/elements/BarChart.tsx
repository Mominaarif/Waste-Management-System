"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

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
const chartData = [
  { year: "2014", desktop: 186 },
  { year: "2018", desktop: 305 },
  { year: "2019", desktop: 237 },
  { year: "2020", desktop: 73 },
  { year: "2021", desktop: 209 },
  { year: "2022", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function ComponentBarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className=" text-center">Green House Gas Emissions (Million Tones of Co2 Equivalent)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
          className="h-48"
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 4)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
            
          </BarChart>
        </ChartContainer>
      </CardContent>
      
    </Card>
  )
}


// import React from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";
// // import faker from 'faker';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: "top" as const,
//     },
//     title: {
//       display: true,
//       text: "Chart.js Bar Chart",
//     },
//   },
// };

// const labels = ["2014", "2018", "2019", "2020", "2021", "2022"];

// // { year: "2014", desktop: 186 },
// //   { year: "2018", desktop: 305 },
// //   { year: "2019", desktop: 237 },
// //   { year: "2020", desktop: 73 },
// //   { year: "2021", desktop: 209 },
// //   { year: "2022", desktop: 214 },
// export const data = {
//   labels,
//   datasets: [
//     {
//       label: "Dataset 1",
//       data: [186, 305, 237, 73, 209, 214],
//       backgroundColor: "black",
//     },
//     // {
//     //   label: 'Dataset 2',
//     //   data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//     //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
//     // },
//   ],
// };

// export function App() {
//   return (
//     <>
//       <div>
//         <div>
//           <h1 className=" text-center">
//             Green House Gas Emissions (Million Tones of Co2 Equivalent)
//           </h1>
//         </div>
//         <div className="">
//           <Bar options={options} data={data} className="" />
//         </div>
//       </div>
//     </>
//   );
// }