import { fetchUserBalance, getUsersbyGroup } from "@/lib/data";
import React from "react";

type Props = { group_id: string };

const GroupBalances = async ({ group_id }: Props) => {
  // TODO: fetch all individual balances for the group
  const users = await getUsersbyGroup(group_id);
  const balances = await Promise.all(
    users.map((userId) => {
      return {
        userId: userId,
        balance: fetchUserBalance(userId.user_id),
      };
    })
  );
  return (
    <div className="flex flex-col border-2 border-black rounded-md">
      <div>Balances</div>
      <div className="flex flex-row">
        {balances.map((item, index) => (
          <div key={index} className="flex flex-col">
            <div>{item.userId.firstname}</div>
            <div>{item.balance}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupBalances;
