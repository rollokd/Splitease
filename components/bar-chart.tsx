"use client";
import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { DataBarChart } from "@/lib/definititions";

export const GroupChart: React.FC<{ data: DataBarChart[] }> = ({ data }) => {
  //Calculate maximum value
  const maxValue = Math.round(
    Math.max(...data.map((entry) => Number(entry.total)))
  );
  const minValue = Math.round(
    Math.min(...data.map((entry) => Number(entry.total)))
  );
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
          dataKey="shortName"
          stroke={"#888888"}
          fontSize={12}
          tickLine={true}
          axisLine={true}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={true}
          axisLine={true}
          tickFormatter={(value) => `$${value.toFixed(0)}`}
          domain={[minValue, maxValue]}
        />
        <Bar dataKey="total" radius={[10, 10, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                Number(entry.total) < 0
                  ? "hsl(var(--destructive))"
                  : "hsl(var(--primary))"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
