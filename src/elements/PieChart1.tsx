"use client";
import React from "react";
import { Bar, BarChart, PieChart, Pie, LabelList } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TrendingUp } from "lucide-react";
// import { Pie, PieChart } from "recharts"

// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
const chartData = [
  { fuelType: "biomass", percent: 275, fill: "#020617" },
  { fuelType: "products", percent: 200, fill: "#1e293b" },
  { fuelType: "oil", percent: 287, fill: "#475569" },
  { fuelType: "motor_gasoline", percent: 173, fill: "#64748b" },
  { fuelType: "natural_gas", percent: 190, fill: "#64748b" },
  { fuelType: "sales", percent: 240, fill: "#cbd5e1" },
  { fuelType: "other", percent: 300, fill: "#f1f5f9" },
];

const chartConfig = {
  percent: {
    label: "percent",
  },
  biomass: {
    label: "Biomass",
    color: "#020617",
  },
  products: {
    label: "Products",
    color: "#1e293b",
  },
  oil: {
    label: "Oil",
    color: "#475569",
  },
  motor_gasoline: {
    label: "Motor Gasoline",
    color: "#64748b",
  },
  natural_gas: {
    label: "Natural Gas",
    color: "#64748b",
  },
  sales: {
    label: "Sales",
    color: "#cbd5e1",
  },
  other: {
    label: "Other",
    color: "#f1f5f9",
  },
} satisfies ChartConfig;
function ComponentPieChart1() {
  return (
    <div className="bg-white">
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className=" text-center">Waste Trucks</CardTitle>
          <CardDescription  className=" text-center">Open Trucks Info</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              {/* <Pie
                data={chartData}
                dataKey="visitors"
                label
                nameKey="browser"
              /> */}

              <Pie
                data={chartData}
                dataKey="percent"
                label
                nameKey="fuelType"
              >
                <LabelList
                  dataKey="fuelType"
                  className="fill-background"
                  stroke="none"
                  fontSize={12}
                  formatter={(value: keyof typeof chartConfig) =>
                    chartConfig[value]?.label
                  }
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default ComponentPieChart1;
