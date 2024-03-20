import { fetchUserBalance, getUsersbyGroup } from "@/lib/data";
import React from "react";

type Props = { group_id: string };

async function GroupBalances({ group_id }: Props) {
  const users = await getUsersbyGroup(group_id);
  const balances = await Promise.all(
    users.map((userId) => fetchUserBalance(userId.user_id))
  );
  const userBalances = balances.map((bal, i) => {
    return { user: users[i], result: bal };
  });
  const userIcons = userBalances.map((item, index) => (
    <div key={index} className="flex flex-col">
      <h1>{item.user.firstname}</h1>
      <p>{item.result}</p>
    </div>
  ));
  return (
    <div className="flex flex-col border-2 border-black rounded-md">
      <div>Balances</div>
      <div className="flex flex-row gap-5">{userIcons}</div>
    </div>
  );
}

export default GroupBalances;
