"use client";
import { useState, useEffect, useDebugValue } from "react";
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
import { EditTransGroupMembers, TableDataType } from "@/lib/definititions";
import { updateTransaction } from "@/lib/transActions/actions";
import { Input } from "@/components/ui/input";
import { useFormStatus } from 'react-dom';
import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { TableHead } from "./TableHead";
import { increment, decrement, handleStatusClick } from "@/lib/transActions/utils";
import { useParams } from "next/navigation";

interface TableDataTypeExtended extends EditTransGroupMembers {
  manuallyAdjusted: boolean;
  status: boolean;
}
const formSchemaTransactions = z.object({
  name: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  amount: z.number(),
  date: z.coerce.date()
});
type FormValues = z.infer<typeof formSchemaTransactions>;

export function TransEdit(
  {
    membersOfTrans,
    userID
  }: {
    membersOfTrans: EditTransGroupMembers[],
    userID: string
  }
) {
  console.log("members", membersOfTrans)
  const currentTrans = useParams();
  const currentDate = membersOfTrans[0].date;
  const day = String(currentDate.getUTCDate()).padStart(2, '0');
  const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
  const year = currentDate.getUTCFullYear();
  const formattedDate = `${year}-${month}-${day}`;

  const [amountInput, setAmountInput] = useState(membersOfTrans[0].total_amount);
  const [tableData, setTableData] = useState<TableDataTypeExtended[]>([])

  const [name, setName] = useState<string>(membersOfTrans[0].transaction_name)
  const [date, setDate] = useState<typeof date>(new Date(membersOfTrans[0].date))
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { pending } = useFormStatus()
  // const { register, setValue, handleSubmit } = useForm<FormValues>()

  const form: UseFormReturn<FormValues> = useForm({
    resolver: zodResolver(formSchemaTransactions),
    defaultValues: {
      name: membersOfTrans[0].transaction_name,
      date: formattedDate,
      amount: membersOfTrans[0].total_amount / 100
    }
  });


  const onSubmit: SubmitHandler<FormValues> = async (values) => {

    console.log("current table ", tableData)
    // setIsSubmitting(true);

    const form_data = new FormData();
    let key: keyof typeof values;
    for (key in values) {
      form_data.append(key, String(values[key]));
    }
    form_data.append('paid_by', String(userID))
    console.log(tableData.map(ele => console.log("table data adjustedAMount", ele.manuallyAdjusted, "status ===>", ele.status)))
    console.log("form_data", form_data)
    console.log("form_data ======> ", form_data)
    // try {
    //   await updateTransaction(currentTrans.id, form_data, tableData);
    // } catch (e) {
    //   console.log("errrorrrr...", e);
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  useEffect(() => {
    const participatingMembers = membersOfTrans.filter(member => member.status !== false);
    const newAmountPerMember = amountInput / participatingMembers.length;


    const newData = membersOfTrans.map(member => ({
      ...member,
      transaction_name: name,
      total_amount: amountInput,
      // user_amount: member.status !== false ? Number(newAmountPerMember.toFixed(2)) : member.user_amount,
      user_amount: Number(newAmountPerMember.toFixed(2)),
      date: date,
      manuallyAdjusted: false
    }));

    setTableData(newData);


  }, [amountInput, name, date, membersOfTrans]);

  // function adjustMemberShare(index: number, newAmount: number): void {
  //   let newData = [...tableData];

  //   if (newData[index].status) {
  //     newData[index] = {
  //       ...newData[index],
  //       user_amount: Number(newAmount.toFixed(2)),
  //       manuallyAdjusted: true
  //     };
  //   }

  //   setTableData(newData);
  // }
  function adjustMemberShare(index: number, adjustAmount: number): void {
    let newData = [...tableData];

    if (newData[index].status) {
      newData[index] = {
        ...newData[index],
        user_amount: Number(adjustAmount.toFixed(2)),
        manuallyAdjusted: true
      };
    }
    const totalAdjusted = newData.filter(member => member.manuallyAdjusted && member.status).reduce((acc, curr) => acc + curr.amount, 0)
    const totalAmountLeft = amountInput - totalAdjusted
    const participatingMembers = newData.filter(member => member.status);
    const unadjustedMembersCount = participatingMembers.filter(member => !member.manuallyAdjusted).length;

    if (
      totalAmountLeft < 0 ||
      (unadjustedMembersCount > 0 &&
        totalAmountLeft / unadjustedMembersCount < 0.5)
    ) {
      alert(
        "Error: There's insufficient amount. The whole amount needs to be distributed."
      );
      return;
    }
    const amountPerUnmodifiedValue = (totalAmountLeft / unadjustedMembersCount).toFixed(2);

    newData = newData.map(member => {
      if (member.status && !member.manuallyAdjusted) {
        return { ...member, user_amount: Number(amountPerUnmodifiedValue) };
      }
      return member;
    });
    setTableData(newData);
  }





  return (
    <Form {...form}>
      <form className="space-y-8 mt-5"
        onSubmit={
          pending
            ? (event) => {
              event.preventDefault();
            }
            : form.handleSubmit(onSubmit)
        }
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction name</FormLabel>
              <FormControl>
                <Input placeholder="type here..." {...field}
                  onChange={(e) => {
                    const newName = String(e.target.value);
                    setName(newName)
                    field.onChange(newName)
                  }}
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

                  onChange={(e) => {
                    const newAmount = Number(e.target.value);
                    setAmountInput(newAmount)
                    field.onChange(newAmount)
                  }}

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
                  {...field}
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split("T")[0]
                      : field.value
                  }
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setDate(newDate)
                    field.onChange(newDate)
                  }}

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
              {tableData.map((ele: any, index: number) => {
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
                          onClick={() => handleStatusClick(index, tableData, setTableData, amountInput)}
                          className={`relative px-1 py-1 transition-all ease-in duration-75 ${ele.status ? "bg-gradient-to-br from-slate-700 to-blue-500" : "bg-slate-300 dark:bg-gray-900"
                            } rounded-md group-hover:bg-opacity-0`}
                        >

                        </span>
                      </button>
                    </td>

                    <td
                      className="flex flex-row  py-4 pl-2 align-middle pr-0"
                    >

                      <button
                        type="button"
                        onClick={() => decrement(index, adjustMemberShare, tableData)}
                        className="relative inline-flex  mr-3 items-center justify-center mt-3 p-.5 mb-3 overflow-hidden text-sm font-medium text-black rounded-lg group bg-gradient-to-br from-black to-slate-700"
                      >
                        <span className="relative px-[.6rem] py-1.2 transition-all ease-in duration-75 bg-white">
                          -
                        </span>
                      </button>
                      <div className="mx-1 flex-2 pl-2 pr-3">
                        <input
                          className="w-[4rem] mt-3 text-center bg-slate-100"
                          value={(ele.user_amount / 100).toFixed(2)}
                          onChange={(e) =>

                            adjustMemberShare(index, Number(e.target.value))}
                        >

                        </input>
                      </div>
                      <button
                        type="button"
                        onClick={() => increment(index, adjustMemberShare, tableData)}
                        className="relative inline-flex items-center justify-center mt-3 p-.5 mb-3 overflow-hidden text-sm font-medium text-black rounded-lg group bg-gradient-to-br from-black to-slate-700"
                      >
                        <span className="relative px-2  py-1.2 transition-all ease-in duration-75 bg-white">
                          +
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
          variant={"sticky"}
          disabled={isSubmitting || pending}
        >
          {isSubmitting ? "Submitting..." : "Submit Changes"}
        </Button>
      </form>
    </Form >

  )
}