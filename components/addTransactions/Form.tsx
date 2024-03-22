"use client";
import { useState, useEffect } from "react";
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
import { useParams } from "next/navigation";

interface TableDataTypeExtended extends TableDataType {
  manuallyAdjusted?: boolean;
  status?: boolean;
}

const formSchemaTransactions = z.object({
  name: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  amount: z.number(),
  date: z.coerce.date(),
});
type FormValues = z.infer<typeof formSchemaTransactions>;

export function TransactionForm({
  groupMembers,
  userID
}: {
  groupMembers: GroupMembers[],
  userID: string
}) {
  const [amountInput, setAmountInput] = useState(0);
  const [tableData, setTableData] = useState<TableDataTypeExtended[]>([]);
  const { pending } = useFormStatus()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [overMark, setOverMark] = useState(false)


  const currentGroup = useParams()

  const form: UseFormReturn<FormValues> = useForm({
    resolver: zodResolver(formSchemaTransactions),
  });
  const { reset } = form;


  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsSubmitting(true);
    const form_data = new FormData();
    let key: keyof typeof values;
    for (key in values) {
      form_data.append(key, String(values[key]));
    }
    form_data.append('paid_by', String(userID))
    form_data.append('group_id', String(currentGroup.id))

    const createTransactionAndData = createTransaction.bind(null, tableData)
    try {
      await createTransactionAndData(form_data);
      reset({
        name: "",
        amount: 0,
        date: new Date(),
      });
      setTableData(
        groupMembers.map((member) => ({
          ...member,
          amount: 0,
          manuallyAdjusted: false
        }))
      );
      setAmountInput(0);
    } catch (e) {
      console.log("errrorrrr...", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const participatingMembers = groupMembers.filter(member => member.status !== false);
    const newAmountPerMember = amountInput / participatingMembers.length;

    const data = groupMembers.map((member) => (
      {
        ...member,
        amount: member.status !== false ? newAmountPerMember : 0,
        manuallyAdjusted: false
      }
    ));

    setTableData(data);
  }, [amountInput, groupMembers]);

  function handleClick(index: number) {
    const newData = [...tableData];
    newData[index].status = !newData[index].status;

    const participatingMembers = newData.filter(member => member.status);
    const newAmountPerMember = amountInput / participatingMembers.length;

    newData.forEach((member, idx) => {
      if (member.status) {
        newData[idx].amount = Number(newAmountPerMember.toFixed(2))
      } else {
        newData[idx].amount = 0
      }
    });

    setTableData(newData);
  }

  function adjustMemberShare(index: number, adjustAmount: number) {
    let newData = [...tableData];

    if (newData[index].status) {
      newData[index] = {
        ...newData[index],
        amount: Number((newData[index].amount + adjustAmount).toFixed(2)),
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


    const amountPerUnmodifiedValue = (totalAmountLeft / unadjustedMembersCount);

    newData = newData.map(member => {
      if (member.status && !member.manuallyAdjusted) {
        return { ...member, amount: Number(amountPerUnmodifiedValue.toFixed(2)) };
      }
      return member;
    });
    setTableData(newData);
  }

  function increment(index: number) {
    const incrementAmount = 0.5;
    if (tableData[index].amount + incrementAmount >= 0) {
      adjustMemberShare(index, incrementAmount);
    }
    else {
      console.log("Cannot increment beyond the total amount");
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
      <form
        onSubmit={
          pending
            ? (event) => {
              event.preventDefault();
            }
            : form.handleSubmit(onSubmit)
        }
        className="space-y-8"
      >
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
                    const newAmount = Number(e.target.value);
                    setAmountInput(newAmount);
                    field.onChange(newAmount);
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
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split("T")[0]
                      : field.value
                  }
                />
              </FormControl>
              <FormDescription>
                This is a transactions creation date.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="container mx-auto py-10">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th scope="col" className="px-4 py-2 text-left">
                  name
                </th>
                <th scope="col" className="px-4 py-2 text-left">
                  status
                </th>
                {/* <th scope="col">id</th> */}
                <th scope="col" className="px-4 py-2 text-left">amount</th>
                {/* <th scope="col" className="px-4 py-2 text-left">paid</th> */}
              </tr>
            </thead>
            <tbody className="mt-2">
              {tableData.map((ele, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{ele.firstname}</th>
                    <td className="px-4 py-2">
                      <button
                        // onClick={() => setParticipates(false)}
                        type="button"
                        className="relative inline-flex items-center justify-center p-3 mb-1 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-slate-600 to-blue-500 group-hover:from-slate-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                      >
                        <span
                          onClick={() => handleClick(index)}
                          className="relative px-1 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">

                        </span>
                      </button>
                    </td>

                    <td className="flex flex-row px-2 py-2">

                      <button
                        type="button"
                        onClick={() => increment(index)}
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-slate-600 to-blue-500 group-hover:from-slate-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                      >
                        <span className="relative px-3 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                          +
                        </span>
                      </button>
                      <div className="mx-1 flex-2 pl-2 pr-3">{ele.amount}</div>

                      <button
                        type="button"
                        onClick={() => decrement(index)}
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-large text-gray-900 rounded-lg group bg-gradient-to-br from-slate-600 to-blue-500 group-hover:from-slate-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                      >
                        <span className="relative px-3 py-1.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                          -
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Button
          type="submit"
          className="flex flex-row self-center"
          disabled={isSubmitting || pending}
        >
          {isSubmitting ? "Submitting..." : "Add Transaction"}
        </Button>
      </form>
    </Form>
  );
}
