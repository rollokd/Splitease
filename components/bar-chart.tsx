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




