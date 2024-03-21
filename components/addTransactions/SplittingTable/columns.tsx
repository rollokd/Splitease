"use client"


import { ColumnDef } from "@tanstack/react-table";
import { TabledGroup } from "@/lib/definititions";


export const columns: ColumnDef<TabledGroup>[] = [
  {
    accessorKey: "firstname",
    header: "firstname",
  },
  {
    accessorKey: "status",
    header: "status",
  },
  {
    accessorKey: "id",
    header: "id"
  },
  {
    accessorKey: "amount",
    header: "amount"
  },
  {
    accessorKey: "paid",
    header: "paid"
  }
]
