import { getTransactionsByGroup } from "@/lib/data";
import React from "react";

type Props = { group_id: string };

const transactionList = async ({ group_id }: Props) => {
  const transactions = await getTransactionsByGroup(group_id);
  console.log(transactions);
  return (
    <>
      <div>transactionList</div>
      <ol>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.firstname} paid {transaction.amount} for{" "}
            {transaction.name}
          </li>
        ))}
      </ol>
    </>
  );
};

export default transactionList;
