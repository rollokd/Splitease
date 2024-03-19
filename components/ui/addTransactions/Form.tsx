"use client"
import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { object, z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { createTransaction } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/addTransactions/SplittingTable/data-table"
import { getNamesOfUsersInAGroup } from "@/lib/data";
import { columns } from "./SplittingTable/columns"

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  amount: z.coerce.number(),
  date: z.date()

})
type User = {
  firstname: string,
  amount: number,
  id: string
}

export function TransactionForm() {

  const [amountInput, setAmountInput] = useState(0);
  const [tableData, setTableData] = useState<User[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })
  let whoPaid: string[];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const form_data = new FormData();
    for (let key in values) {
      form_data.append(key, values[key as keyof typeof object])
    }
    await createTransaction(form_data, whoPaid)
    console.log(values)
  }


  useEffect(() => {
    async function helper() {
      console.log("whatever inside")
      const value = await getNamesOfUsersInAGroup()
      console.log(" Value: what a thrill ====> ", value)
      whoPaid = [value[0].firstname, value[0].id];
      const data = value.map((ele) => ({
        ...ele,
        amount: amountInput / value.length
      }));
      setTableData(data)
    }
    helper()
  }, [])

  useEffect(() => {
    const data = tableData.map((ele) => ({
      ...ele,
      amount: amountInput / tableData.length
    }));
    setTableData(data)
  }, [amountInput])

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction name</FormLabel>
              <FormControl>
                <Input placeholder="type here..." {...field} />
              </FormControl>
              <FormDescription>
                This is the tag for your transaction.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>amount</FormLabel>
              <FormControl>
                <Input placeholder="type here..." {...field} onChange={(e) => setAmountInput(Number(e.target.value))} />
              </FormControl>
              <FormDescription>
                This is the sum that will be split.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                This is a transactions creation date.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


      </form>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={tableData} />
      </div>
      <Button type="submit" className="flex flex-row self-center">Add Transaction</Button>
    </Form>
  )
}
