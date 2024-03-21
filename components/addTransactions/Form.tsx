"use client";
import { useState, useEffect, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { object, z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createTransaction } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/addTransactions/SplittingTable/data-table";
import { columns } from "./SplittingTable/columns";
import { GroupMembers, TableDataType, User, UserWJunction } from "@/lib/definititions";
import { useParams } from "next/navigation";
import { FormFieldContext } from "@/components/ui/form";
import StaticGenerationSearchParamsBailoutProvider from "next/dist/client/components/static-generation-searchparams-bailout-provider";

const formSchemaTransactions = z.object({
  name: z.string().min(3, {
    message: "Username must be at least 3 characters."
  }),
  amount: z.number(),
  date: z.coerce.date()
});

export function TransactionForm({ groupMembers }: { groupMembers: GroupMembers[] }) {
  const [amountInput, setAmountInput] = useState(0);
  const [tableData, setTableData] = useState<TableDataType[]>([]);
  const currentUser = 'abde2287-4cfa-4cc7-b810-dd119df1d039'
  const form = useForm<z.infer<typeof formSchemaTransactions>>({
    resolver: zodResolver(formSchemaTransactions),
  });

  const onSubmit = (values: z.infer<typeof formSchemaTransactions>) => {
    const form_data = new FormData();
    for (let key in values) {
      form_data.append(key, values[key as keyof typeof object]);
    }
    form_data.append('paid_by', currentUser)
    const createTransactionAndData = createTransaction.bind(null, tableData)
    createTransactionAndData(form_data)
  }

  // useEffect(() => {
  //   async function helper() {
  //     console.log("whatever inside");
  //     const data = groupMembers.map((ele) => ({
  //       ...ele,
  //       // amount: amountInput / groupMembers.length
  //       amount: amountInput / groupMembers.length
  //     }));
  //     setTableData(data);
  //   }
  //   helper();
  // });

  useEffect(() => {

    const data = groupMembers.map(member => ({
      ...member,
      amount: amountInput / groupMembers.length
    }))
    setTableData(data);
  }, [amountInput]);

  function increment(index: number) {
    setTableData(currentData =>
      currentData.map((item, idx) => idx === index ? { ...item, amount: item.amount + 1 } : item)
    );
  }
  function decrement(index: number) {
    setTableData(currentData =>
      currentData.map((item, idx) => idx === index ? { ...item, amount: item.amount - 1 } : item)
    );
  }
  return (
    <Form {...form}>
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
                <Input
                  placeholder="type here..."
                  {...field}
                  value={field.value}
                  onChange={(e) => {
                    const newAmount = Number(e.target.value)
                    setAmountInput(newAmount)
                    field.onChange(newAmount)
                  }}
                />
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
                <Input
                  type="date"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is a transactions creation date.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <div className="container mx-auto py-10">
          <DataTable columns={columns} data={tableData} />
        </div> */}
        <div className="container mx-auto py-10">
          <table>
            <thead>
              <tr>
                <th scope="col">name</th>
                <th scope="col">status</th>
                {/* <th scope="col">id</th> */}
                <th scope="col">amount</th>
                <th scope="col">paid</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((ele, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{ele.firstname}</th>
                    <td><button className="toggleButton">will toggle</button></td>
                    {/* <td className="ft-45">{ele.id}</td> */}
                    <td>
                      <button onClick={() => increment(index)}>+</button>
                      {ele.amount}
                      {/* {increment && (
                        let evenParts = amountInput /groupMembers.length
                        let currentValue = evenParts + 1;
                      )} */}
                      <button onClick={() => decrement(index)}>-</button>
                    </td>
                    <td>not yet paid</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>


        <Button type="submit" className="flex flex-row self-center">
          Add Transaction
        </Button>
      </form>
    </Form>
  );
}
