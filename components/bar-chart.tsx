"use client"
import React from "react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell
} from "recharts"
import { DataBarChart } from "@/lib/definititions"

interface GroupChartProps {
  data: DataBarChart[];
}
export const GroupChart: React.FC<GroupChartProps> = ({data}) => {
  //Calculate maximum value
  const maxValue = Math.max(...data.map(entry => Number(entry.total)));
  const minValue = Math.min(...data.map(entry => Number(entry.total)));
  //Add 10%
  const upperBound = maxValue > 0 ? maxValue * 1.1 : maxValue / 0.9;
  const lowerBound = minValue < 0 ? minValue * 1.1 : minValue / 0.9;
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 20,
        bottom: 10,
      }}
      >
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value.toFixed(2)}`}
          // domain={[lowerBound, upperBound]}
          domain={[minValue, maxValue]}
        />
         <Bar
          dataKey="total"
          radius={[10, 10, 0, 0]}
        >
          {
            data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={Number(entry.total) < 0 ? "#EF4444" : "#10B981"} />
            ))
          }
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}