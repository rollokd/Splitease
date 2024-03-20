import { prettyMoney } from "@/lib/utils";
import React from "react";

type Props = { id: string; user: string; name: string; amount: number };

const TransactionItem = async (props: Props) => {
  return (
    <div
      className="flex flex-row border-2 justify-between border-blue-500 rounded-md m-1 px-2"
      key={props.id}
    >
      <div>
        <span className="text-sky-500">{props.user}</span> paid for {props.name}
      </div>
      <div>{prettyMoney(props.amount)}</div>
    </div>
  );
};

export default TransactionItem;
