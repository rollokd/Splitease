import { getTransactionsByGroup } from "@/lib/data";
import React from "react";
import TransactionItem from "./transaction-item";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Link from "next/link";

type Props = { group_id: string };

const TransactionList = async ({ group_id }: Props) => {
  const transactions = await getTransactionsByGroup(group_id);
  console.log(transactions);
  return (
    <div className="flex flex-col h-full overflow-x-auto border-2 rounded-md border-black">
      <div className="flex flex-row p-2 sticky top-0 bg-white justify-between items-center border-b-2 border-black">
        <h2 className="text-xl">Transactions</h2>
        <div className="flex flex-row gap-2">
          <Select>
            <SelectTrigger className="w-0.2">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">All</SelectItem>
              <SelectItem value="dark">Settled</SelectItem>
              <SelectItem value="system">Outstanding</SelectItem>
            </SelectContent>
          </Select>
          <Link href={"/addTransactions"} passHref>
            <Button className="bg-blue-500 w-10" size={"sm"}>
              +
            </Button>
          </Link>
        </div>
      </div>
      <div className="pt-1 overflow-x-auto">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.trans_id}
            id={transaction.trans_id}
            user={transaction.firstname}
            amount={transaction.amount}
            name={transaction.name}
          />
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
