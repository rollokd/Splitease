"use client"


import { ColumnDef } from "@tanstack/react-table";
import { Group } from "@/lib/data";

// export type Group = {
//   firstname: string
//   status: true | false
//   id: string
//   amount: number
// }

export const columns: ColumnDef<Group>[] = [
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
  }
]
