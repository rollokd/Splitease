"use client";
import { prettyMoney } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { GroupBalancesByUser } from "@/lib/definititions";
import { Separator } from "../ui/separator";
import { settleUp } from "@/lib/serverActions/settleSplitsActions";

type Props = {
  debt: GroupBalancesByUser;
  index: number;
  user_id: string;
  group_id: string;
};

const SettleCard = ({ debt, index, user_id, group_id }: Props) => {
  const [paid, setPaid] = useState(false);
  return (
    <div key={index}>
      {index !== 0 && <Separator />}
      <div className="flex flex-row justify-between items-center m-3">
        {paid ? (
          <div className="text-sky-500">Paid {debt.firstname}</div>
        ) : debt.lent_amount - debt.owed_amount < 0 ? (
          <>
            <div>
              You owe {debt.firstname}{" "}
              <span className="text-destructive">
                {prettyMoney(debt.lent_amount - debt.owed_amount)}
              </span>
            </div>
            <Button
              className="text-lg"
              size={"sm"}
              onClick={async (e) => {
                e.preventDefault();
                const resp = await settleUp(user_id, debt.user_id, group_id);
                console.log("resp", resp);
                if (resp == "success") setPaid(true);
              }}
            >
              Pay Now
            </Button>
          </>
        ) : (
          <>
            <div>
              {debt.firstname} owes you{" "}
              <span className="text-primary">
                {prettyMoney(debt.lent_amount - debt.owed_amount)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SettleCard;
