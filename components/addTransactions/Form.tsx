"use client";
import { useState, useEffect, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { GroupMembers, TableDataType } from "@/lib/definititions";
import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { useFormStatus } from 'react-dom';



interface TableDataTypeExtended extends TableDataType {
  manuallyAdjusted?: boolean;
}


const formSchemaTransactions = z.object({
  name: z.string().min(3, {
    message: "Username must be at least 3 characters."
  }),
  amount: z.number(),
  date: z.coerce.date()
});
type FormValues = z.infer<typeof formSchemaTransactions>;

export function TransactionForm({ groupMembers }: { groupMembers: GroupMembers[] }) {
  const [amountInput, setAmountInput] = useState(0);
  const [tableData, setTableData] = useState<TableDataTypeExtended[]>([]);
  const { pending } = useFormStatus()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const currentUser = 'abde2287-4cfa-4cc7-b810-dd119df1d039'
  const form: UseFormReturn<FormValues> = useForm({
    resolver: zodResolver(formSchemaTransactions),
  });
  const { reset } = form;

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsSubmitting(true)
    const form_data = new FormData();
    let key: keyof typeof values;
    for (key in values) {
      form_data.append(key, String(values[key]));
    }
    form_data.append('paid_by', currentUser)
    const createTransactionAndData = createTransaction.bind(null, tableData)
    try {
      await createTransactionAndData(form_data)
      reset({
        name: '',
        amount: 0,
        date: ''
      })
      setTableData(groupMembers.map(member => ({
        ...member,
        amount: 0,
        manuallyAdjusted: false,
      })));
      setAmountInput(0);
    } catch (e) {
      console.log("errrorrrr...", e)
    } finally {
      setIsSubmitting(false)
    }
  }



  useEffect(() => {
    const data = groupMembers.map(member => ({
      ...member,
      amount: amountInput / groupMembers.length,
      manuallyAdjusted: false,
    }));
    setTableData(data);
  }, [amountInput, groupMembers]);


  function adjustMemberShare(index: number, adjustAmount: number) {
    const newData = [...tableData];

    const adjustedMemberNewAmount = Math.round((newData[index].amount + adjustAmount) * 100) / 100;
    newData[index] = { ...newData[index], amount: adjustedMemberNewAmount, manuallyAdjusted: true };
    const totalAdjusted = newData.filter(member => member.manuallyAdjusted).reduce((acc, curr) => acc + curr.amount, 0)
    const totalAmountLeft = amountInput - totalAdjusted
    const unadjustedMembersCount = newData.filter(member => !member.manuallyAdjusted).length;


    if (totalAmountLeft < 0 || (unadjustedMembersCount > 0 && totalAmountLeft / unadjustedMembersCount < 0.5)) {
      alert("Error: There's insufficient amount of pesos. The whole amount needs to be distributed evenly, don't be cheap.");
      return;
    }


    const amountPerUnmodifiedValue = Math.round((totalAmountLeft / unadjustedMembersCount) * 100) / 100;
    for (let i = 0; i < newData.length; i++) {
      if (!newData[i].manuallyAdjusted) {
        newData[i] = { ...newData[i], amount: amountPerUnmodifiedValue };
      }
    }
    setTableData(newData)

  }


  function increment(index: number) {
    const incrementAmount = 0.5;
    const potentialTotal = tableData.reduce((acc, member, idx) =>
      acc + (idx === index ? member.amount + incrementAmount : member.amount), 0)
    if (potentialTotal <= amountInput) {
      adjustMemberShare(index, incrementAmount)
    } else {
      console.log("Cannot increment beyond the total amount")
    }
  }

  function decrement(index: number) {
    const decrementAmount = 0.5;


    if (tableData[index].amount - decrementAmount >= 0) {
      adjustMemberShare(index, -decrementAmount);
    } else {
      console.log("Cannot decrement below zero, bud");
    }
  }



  return (
    <Form {...form}>
      {/* <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> */}
      <form onSubmit={pending ? (event) => { event.preventDefault() } : form.handleSubmit(onSubmit)} className="space-y-8">
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
              <tr >
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
                    <td ><button className="toggleButton">will toggle</button></td>
                    {/* <td className="ft-45">{ele.id}</td> */}
                    <td >
                      <button type="button" onClick={() => increment(index)}>+</button>
                      {ele.amount}
                      {/* {increment && (
                        let evenParts = amountInput /groupMembers.length
                        let currentValue = evenParts + 1;
                      )} */}
                      <button type="button" onClick={() => decrement(index)}>-</button>
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>


        <Button type="submit" className="flex flex-row self-center" disabled={isSubmitting || pending}>
          {isSubmitting ? 'Submitting...' : 'Add Transaction'}
        </Button>
      </form>
    </Form>
  );
}
