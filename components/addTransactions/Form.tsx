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
import { GroupMembers, TableDataType, RouteParams } from "@/lib/definititions";
import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { useFormStatus } from "react-dom";
import { useParams } from "next/navigation";
import { TableHead } from "@/components/addTransactions/TableHead";
import {
  increment,
  decrement,
  handleStatusClick,
} from "@/lib/transActions/utils";
import EditDeleteBtn from "@/components/addTransactions/editDeleteBtns";

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
  userID,
}: {
  groupMembers: GroupMembers[];
  userID: string;
}) {
  const [amountInput, setAmountInput] = useState(0);
  const [tableData, setTableData] = useState<TableDataTypeExtended[]>([]);
  const { pending } = useFormStatus();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentGroup = useParams<RouteParams>();

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
    form_data.append("paid_by", String(userID));
    form_data.append("group_id", String(currentGroup.id));

    const createTransactionAndData = createTransaction.bind(null, tableData);
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
          manuallyAdjusted: false,
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
    const participatingMembers = groupMembers.filter(
      (member) => member.status !== false
    );
    const newAmountPerMember = amountInput / participatingMembers.length;

    const data = groupMembers.map((member) => ({
      ...member,
      amount:
        member.status !== false ? Number(newAmountPerMember.toFixed(2)) : 0,
      manuallyAdjusted: false,
    }));

    setTableData(data);
  }, [amountInput, groupMembers]);

  function adjustMemberShare(index: number, adjustAmount: number): void {
    let newData = [...tableData];

    if (newData[index].status) {
      newData[index] = {
        ...newData[index],
        amount: Number((newData[index].amount + adjustAmount).toFixed(2)),
        manuallyAdjusted: true,
      };
    }
    const totalAdjusted = newData
      .filter((member) => member.manuallyAdjusted && member.status)
      .reduce((acc, curr) => acc + curr.amount, 0);
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
    const amountPerUnmodifiedValue = (
      totalAmountLeft / unadjustedMembersCount
    ).toFixed(2);

    newData = newData.map((member) => {
      if (member.status && !member.manuallyAdjusted) {
        return { ...member, amount: Number(amountPerUnmodifiedValue) };
      }
      return member;
    });
    setTableData(newData);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={
          pending
            ? (event) => {
                event.preventDefault();
              }
            : form.handleSubmit(onSubmit)
        }
        className="w-full space-y-8 mt-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction name</FormLabel>
              <FormControl>
                <Input placeholder="input a name of a transaction" {...field} />
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
                  placeholder="input an amount to split"
                  {...field}
                  value={field.value}
                  onChange={(e) => {
                    const newAmount = Number(e.target.value);
                    setAmountInput(newAmount);
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col w-full justify-center">
          <table className="">
            <TableHead />
            <tbody className="[&_tr:last-child]:border-0">
              {tableData.map((ele, index) => {
                return (
                  <tr
                    key={index}
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
                          onClick={() =>
                            handleStatusClick(
                              index,
                              tableData,
                              setTableData,
                              amountInput
                            )
                          }
                          className={`relative px-1 py-1 transition-all ease-in duration-75 ${
                            ele.status
                              ? "bg-gradient-to-br from-slate-700 to-blue-500"
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
                          decrement(index, adjustMemberShare, tableData);
                        }}
                      >
                        -
                      </Button>
                      <div className="mx-1 flex-2 pl-2 pr-3">
                        <Input
                          value={ele.amount}
                          onChange={(e) =>
                            adjustMemberShare(
                              index,
                              Number(e.target.value) - ele.amount
                            )
                          }
                        />
                      </div>

                      <Button
                        size="icon"
                        variant="round"
                        onClick={(e) => {
                          e.preventDefault();
                          increment(index, adjustMemberShare, tableData);
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
          groupId={currentGroup.id}
          text="Add Transaction"
        />
      </form>
    </Form>
  );
}
