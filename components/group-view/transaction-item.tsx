"use client";
import { prettyMoney } from "@/lib/utils";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Button } from "../ui/button";
import { deleteTransaction } from "@/lib/actions";

type Props = { id: string; user: string; name: string; amount: number };

const TransactionItem = (props: Props) => {
  return (
    <div
      className="flex flex-row border-2 justify-between border-blue-500 rounded-md m-2 px-2 py-1"
      key={props.id}
    >
      <div className="flex flex-col">
        <div className="text-sky-500">{props.user}</div>
        <div>{props.name}</div>
      </div>
      <div className="flex flex-row items-center gap-2">
        {prettyMoney(props.amount)}
        <Button variant={"outline"} size={"sm"}>
          <PencilIcon width={20} height={20} />
        </Button>
        <Button
          className="bg-red-600"
          size={"sm"}
          onClick={async (e) => {
            e.preventDefault();
            await deleteTransaction(props.id);
          }}
        >
          <TrashIcon width={20} height={20} />
        </Button>
      </div>
    </div>
  );
};

export default TransactionItem;
