"use client";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  EditTransGroupMembers,
  TableDataTypeExtended,
  RouteParams,
} from "@/lib/definititions";
import { updateTransaction } from "@/lib/transActions/actions";
import { Input } from "@/components/ui/input";
import { useFormStatus } from "react-dom";
import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { TableHead } from "./TableHead";
import { useParams } from "next/navigation";
import EditDeleteBtn from "@/components/addTransactions/editDeleteBtns";

const formSchemaTransactions = z.object({
  name: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  amount: z.number(),
  date: z.coerce.date(),
});
type FormValues = z.infer<typeof formSchemaTransactions>;

export function TransEdit({
  membersOfTrans,
  userID,
}: {
  membersOfTrans: EditTransGroupMembers[];
  userID: string;
}) {
  const { id } = useParams<RouteParams>();
  const currentDate = membersOfTrans[0].date;
  const day = String(currentDate.getUTCDate()).padStart(2, "0");
  const month = String(currentDate.getUTCMonth() + 1).padStart(2, "0");
  const year = currentDate.getUTCFullYear();
  const formattedDate = `${year}-${month}-${day}`;

  const [amountInput, setAmountInput] = useState(
    membersOfTrans[0].total_amount / 100
  );
  const [tableData, setTableData] = useState<TableDataTypeExtended[]>([]);

  const [name, setName] = useState<string>(membersOfTrans[0].transaction_name);
  const [date, setDate] = useState<Date>(membersOfTrans[0].date);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { pending } = useFormStatus();
  const [amountChanged, setAmountChanged] = useState(false);

  // useEffect(() => {
  //   console.log("before 2")
  //   const idSet = new Set(tableData.map(ele => ele.id));
  //   if (idSet.size !== tableData.length) {
  //     console.log("Duplicate IDs detected in tableData");
  //   } else {
  //     console.log("there's no duplicate data")
  //   }
  // }, [tableData]);

  useEffect(() => {
    const newData = membersOfTrans.map((member) => ({
      ...member,
      transaction_name: name,
      total_amount: amountInput,
      user_amount:
        member.status !== false && !amountChanged
          ? member.user_amount / 100
          : 0,
      manuallyAdjusted: false,
      status: member.status,
    }));

    if (amountChanged) {
      redistributeAmount(newData);
    }
    setTableData(newData);
  }, [amountInput, name, date, membersOfTrans, amountChanged]);

  const form: UseFormReturn<FormValues> = useForm({
    resolver: zodResolver(formSchemaTransactions),
    defaultValues: {
      name: membersOfTrans[0].transaction_name,
      date: new Date(formattedDate),
      amount: membersOfTrans[0].total_amount / 100,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsSubmitting(true);

    const form_data = new FormData();
    let key: keyof typeof values;
    for (key in values) {
      form_data.append(key, String(values[key]));
    }
    form_data.append("paid_by", String(userID));
    try {
      await updateTransaction(id, form_data, tableData);
    } catch (e) {
      console.log("errrorrrr...", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  function redistributeAmount(data: TableDataTypeExtended[]) {
    const participatingMembers = data.filter((member) => member.status);
    const newAmountPerMember = amountInput / participatingMembers.length;

    data.forEach((member) => {
      if (member.status && !member.manuallyAdjusted) {
        member.user_amount = Number(newAmountPerMember.toFixed(2));
      } else if (!member.status) {
        member.user_amount = 0;
      }
    });
    setTableData(data);
  }

  function adjustMemberShare(index: number, adjustAmount: number): void {
    let newData = [...tableData];

    if (newData[index].status) {
      newData[index] = {
        ...newData[index],
        user_amount: Number(
          (newData[index].user_amount + adjustAmount).toFixed(2)
        ),
        manuallyAdjusted: true,
      };
    }
    const totalAdjusted = newData
      .filter((member) => member.manuallyAdjusted && member.status)
      .reduce((acc, curr) => acc + curr.user_amount, 0);

    const totalAmountLeft = amountInput - totalAdjusted;
    const participatingMembers = newData.filter((member) => member.status);
    const unadjustedMembersCount = participatingMembers.filter(
      (member) => !member.manuallyAdjusted
    ).length;

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
    const amountPerUnmodifiedValue = Number(
      totalAmountLeft / unadjustedMembersCount
    );

    newData = newData.map((member) => {
      if (member.status && !member.manuallyAdjusted) {
        return { ...member, user_amount: amountPerUnmodifiedValue };
      }
      return member;
    });

    setTableData(newData);
  }

  function handleStatusClick(index: number) {
    const newData = [...tableData];
    newData[index].status = !newData[index].status;
    redistributeAmount(newData);
    setTableData(newData);
  }

  function decrement(index: number) {
    const decrementAmount = 0.5;
    if (tableData[index].user_amount - decrementAmount >= 0) {
      adjustMemberShare(index, -decrementAmount);
    } else {
      console.log("Cannot decrement below zero, bud");
    }
  }

  function increment(index: number) {
    const incrementAmount = 0.5;
    if (Number(tableData[index].user_amount) + incrementAmount >= 0) {
      adjustMemberShare(index, incrementAmount);
    } else {
      console.log("Cannot increment beyond the total amount");
    }
  }

  return (
    <Form {...form}>
      <form
        className="w-full space-y-8 mt-5"
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
                <Input
                  placeholder="type here..."
                  {...field}
                  onChange={(e) => {
                    const newName = String(e.target.value);
                    setName(newName);
                    field.onChange(newName);
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
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="input an amount"
                  {...field}
                  value={field.value}
                  onChange={(e) => {
                    const newAmount = Number(e.target.value);
                    setAmountInput(newAmount);
                    setAmountChanged(true);
                    field.onChange(newAmount);
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
              <FormLabel>Date</FormLabel>
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
                    setDate(newDate);
                    field.onChange(newDate);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col w-full justify-center">
          <table className=" ">
            <TableHead />
            <tbody className="[&_tr:last-child]:border-0">
              {tableData.map((ele: EditTransGroupMembers, index: number) => {
                return (
                  <tr
                    key={`trans-${ele.id}`}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted text-left"
                  >
                    <th
                      scope="row"
                      className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                    >
                      {ele.firstname}
                    </th>
                    <td className=" pl-6 align-middle [&:has([role=checkbox])]:pr-0">
                      <button
                        type="button"
                        className="relative inline-flex items-center justify-center overflow-hidden  text-sm font-large text-gray-900 rounded-lg group bg-gradient-to-br from-slate-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none"
                      >
                        <span
                          onClick={() => handleStatusClick(index)}
                          className={`relative px-1 py-1 transition-all ease-in duration-75 ${
                            ele.status
                              ? "bg-gradient-to-br from-slate-700 to-primary"
                              : "bg-slate-300 dark:bg-gray-900"
                          } rounded-md group-hover:bg-opacity-0`}
                        ></span>
                      </button>
                    </td>

                    <td className="flex flex-row  py-4 pl-2 align-middle pr-0">
                      <Button
                        size="icon"
                        variant="round"
                        onClick={(e) => {
                          e.preventDefault();
                          decrement(index);
                        }}
                      >
                        -
                      </Button>
                      <div className="mx-1 flex-2 pl-2 pr-3">
                        <Input
                          value={ele.user_amount.toFixed(2)}
                          onChange={(e) => {
                            adjustMemberShare(index, Number(e.target.value));
                          }}
                        />
                      </div>
                      <Button
                        size="icon"
                        variant="round"
                        onClick={(e) => {
                          e.preventDefault();
                          increment(index);
                        }}
                      >
                        +
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <EditDeleteBtn
          isSubmitting={isSubmitting}
          pending={pending}
          groupId={membersOfTrans[0].group_id}
          text="Submit Changes"
        />
      </form>
    </Form>
  );
}
