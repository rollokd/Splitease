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
import { getTransactionsByGroupAndId } from "@/lib/databaseFunctions/getTransactionsByGroupId";

type Props = { group_id: string; user_id: string };

const TransactionList = async ({ group_id, user_id }: Props) => {
  const transactions = await getTransactionsByGroupAndId(group_id, user_id);
  return (
    <Card className="flex flex-col h-full border-none">
      <CardHeader className="sticky top-0 bg-card rounded-lg">
        <div className="flex flex-row justify-between items-center">
          <CardTitle>Transactions</CardTitle>
          <div className="flex flex-row items-center gap-2">
            {/* <Select>
              <SelectTrigger className="w-0.2">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="settled">Settled</SelectItem>
                <SelectItem value="outstanding">Outstanding</SelectItem>
              </SelectContent>
            </Select> */}
            <Link href={`/home/group/${group_id}/addTransactions`} passHref>
              <Button
                className="bg-primary text-primary-foreground"
                size={"sm"}
              >
                Add +
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col overflow-y-auto">
        {transactions.map((transaction, index) => (
          <TransactionItem
            key={index}
            id={transaction.trans_id}
            username={transaction.firstname}
            amount={transaction.amount}
            name={transaction.name}
            user_id={user_id}
            amount_owed={transaction.amount_owed}
            amount_lent={transaction.amount_lent}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
