"use client";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createTransaction } from "@/lib/transActions/actions";
import { Input } from "@/components/ui/input";
import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { TableHead } from "./TableHead";
import { increment, decrement, handleStatusClick } from "@/lib/transActions/utils";

const formSchemaTransactions = z.object({
  name: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  amount: z.number(),
  date: z.coerce.date(),
});
type FormValues = z.infer<typeof formSchemaTransactions>;

export function TransEdit(
  {
    membersOfTrans
  }: {
    membersOfTrans: any
  }
) {

  const form: UseFormReturn<FormValues> = useForm({
    resolver: zodResolver(formSchemaTransactions),
  });

  const currentTransName = membersOfTrans[0].transaction_name;
  const totalAmount = membersOfTrans[0].total_amount;
  const isoDateString = membersOfTrans[0].date;
  const date = new Date(isoDateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  const formattedDate = `${year}-${month}-${day}`;


  return (
    <Form {...form}>
      <form className="space-y-8 mt-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction name</FormLabel>
              <FormControl>
                <Input placeholder="type here..." {...field}
                  defaultValue={currentTransName}
                // onChange={(e) => {
                //   const newName = e.target.value;
                // }}
                />
              </FormControl>
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
                  defaultValue={totalAmount / 100}
                // onChange={(e) => {
                //   const newAmount = Number(e.target.value);
                //   // setAmountInput(newAmount);
                //   // field.onChange(newAmount);
                // }}

                />
              </FormControl>
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
                  defaultValue={formattedDate}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <table>
            <TableHead />
            <tbody className="[&_tr:last-child]:border-0">
              {membersOfTrans.map((ele: any, index: number) => {
                return (
                  <tr key={index}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted text-left"
                  >
                    <th
                      scope="row"
                      className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                    >
                      {ele.firstname}
                    </th>
                    <td
                      className=" pl-6 align-middle [&:has([role=checkbox])]:pr-0"
                    >
                      <button
                        type="button"
                        className="relative inline-flex items-center justify-center overflow-hidden  text-sm font-large text-gray-900 rounded-lg group bg-gradient-to-br from-slate-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none"
                      >
                        <span
                        // onClick={() => handleStatusClick(index, tableData, setTableData, amountInput)}
                        // className={`relative px-1 py-1 transition-all ease-in duration-75 ${ele.status ? "bg-gradient-to-br from-slate-700 to-blue-500" : "bg-slate-300 dark:bg-gray-900"
                        //   } rounded-md group-hover:bg-opacity-0`}
                        >

                        </span>
                      </button>
                    </td>

                    <td
                      className="flex flex-row  py-4 pl-2 align-middle pr-0"
                    >

                      <button
                        type="button"
                        // onClick={() => increment(index, adjustMemberShare, tableData)}
                        className="relative inline-flex items-center justify-center mt-3 p-.5 mb-3 overflow-hidden text-sm font-medium text-black rounded-lg group bg-gradient-to-br from-black to-slate-700"
                      >
                        <span className="relative px-2  py-1.2 transition-all ease-in duration-75 bg-white">
                          +
                        </span>
                      </button>
                      <div className="mx-1 flex-2 pl-2 pr-3">
                        <input
                          className="w-[4rem] mt-3 text-center bg-slate-100"
                          defaultValue={ele.user_amount / 100}
                          onChange={(e) => adjustMemberShare(index, Number(e.target.value) - ele.amount)}>
                        </input>
                      </div>

                      <button
                        type="button"
                        // onClick={() => decrement(index, adjustMemberShare, tableData)}
                        className="relative inline-flex  mr-3 items-center justify-center mt-3 p-.5 mb-3 overflow-hidden text-sm font-medium text-black rounded-lg group bg-gradient-to-br from-black to-slate-700"
                      >
                        <span className="relative px-[.6rem] py-1.2 transition-all ease-in duration-75 bg-white">
                          -
                        </span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <Button
          type="submit"
        >
          Submit Changes
        </Button>
      </form>
    </Form >

  )
}