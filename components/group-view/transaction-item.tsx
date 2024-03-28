"use client";
import { cn, prettyMoney } from "@/lib/utils";
import { Ellipsis, EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import React, { useMemo } from "react";
import { Button } from "../ui/button";
import { deleteTransaction } from "@/lib/actions";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";

type Props = {
  id: string;
  username: string;
  name: string;
  amount: number;
  user_id: string;
  amount_owed: number;
  amount_lent: number;
};

const TransactionItem = (props: Props) => {
  const isSettled = useMemo(
    () => props.amount_owed === 0 && props.amount_lent === 0,
    [props.amount_lent, props.amount_owed]
  );
  const isOwed = useMemo(() => props.amount_owed > 0, [props.amount_owed]);

  const transactionText = useMemo(() => {
    if (props.amount_owed === 0 && props.amount_lent === 0) return "Settled up";
    if (props.amount_lent > 0) return prettyMoney(props.amount_lent);

    return prettyMoney(props.amount_owed);
  }, [props.amount_lent, props.amount_owed]);
  return (
    <div className="flex flex-row justify-between rounded-md p-2">
      <div className="flex flex-col">
        <div>{props.name}</div>
        <div className="text-muted-foreground">
          {props.username} paid {prettyMoney(props.amount)}
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="text-right">
          {!isSettled && (
            <p className="text-xs">{isOwed ? "You borrowed" : "You lent"}</p>
          )}
          <p
            className={cn(
              "font-semibold text-primary",
              isOwed && "text-destructive",
              isSettled && "text-muted-foreground"
            )}
          >
            {transactionText}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical className="w-6 h-6" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="p-1">Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/home/group/${props.id}/addTransactions`} passHref>
              <DropdownMenuItem className="gap-2">
                <Pencil className="h-4" /> Edit
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="text-red-600 gap-2"
              onSelect={async (e) => {
                e.preventDefault();
                await deleteTransaction(props.id);
              }}
            >
              <Trash2 className="h-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TransactionItem;
