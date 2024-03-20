import { getTransactionsByGroup } from "@/lib/data";
import React from "react";

type Props = { group_id: string };

const transactionList = async ({ group_id }: Props) => {
  const transactions = await getTransactionsByGroup(group_id);
  console.log(transactions);
  return (
    <div>
      <h2>transactionList</h2>
      <ol>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.firstname} paid {transaction.amount} for{" "}
            {transaction.name}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default transactionList;
