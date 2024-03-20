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

type Props = { group_id: string };

const TransactionList = async ({ group_id }: Props) => {
  const transactions = await getTransactionsByGroup(group_id);
  // console.log(transactions);
  return (
    <div className="flex flex-col flex-grow border-2 rounded-md border-black">
      <div className="flex flex-row p-2 justify-between items-center border-b-2 border-black">
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
          <Button className="bg-blue-500 w-10" size={"sm"}>
            +
          </Button>
        </div>
      </div>
      <div className="pt-1">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            id={transaction.id}
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
