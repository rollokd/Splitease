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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { getTransactionsByGroupAndId } from "@/lib/databaseActions/getTransactionsByGroupId";

type Props = { group_id: string; user_id: string };

const TransactionList = async ({ group_id, user_id }: Props) => {
  const transactions = await getTransactionsByGroupAndId(group_id, user_id);
  console.log(transactions);
  return (
    <Card className="flex-1">
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <CardTitle>Transactions</CardTitle>
          <div className="flex flex-row items-center gap-2">
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
            <Link href={`/home/group/${group_id}/addTransactions`} passHref>
              <Button className="bg-blue-500 w-10" size={"sm"}>
                +
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="overflow-x-auto">
        {transactions.map((transaction, index) => (
          <div key={transaction.id}>
            {index !== 0 && <Separator />}
            <TransactionItem
              key={transaction.trans_id}
              id={transaction.trans_id}
              username={transaction.firstname}
              amount={transaction.amount}
              name={transaction.name}
              user_id={user_id}
              amount_owed={transaction.amount_owed}
              amount_lent={transaction.amount_lent}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
