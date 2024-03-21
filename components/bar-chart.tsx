"use client"
import React from "react"
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis } from "recharts"
import { DataBarChart } from "@/lib/definititions"
interface GroupChartProps {
  data: DataBarChart[];
}
export const GroupChart: React.FC<GroupChartProps> = ({data}) => {
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
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[10, 10, 10, 10]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}




