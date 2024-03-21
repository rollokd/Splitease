import { fetchUserBalance, getUsersbyGroup } from "@/lib/data";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { prettyMoney } from "@/lib/utils";
import React from "react";

type Props = { group_id: string };

async function GroupBalances({ group_id }: Props) {
  const me = "410544b2-4001-4271-9855-fec4b6a6442a";
  const users = await getUsersbyGroup(group_id);
  const balances = await Promise.all(
    users.map((userId) => fetchUserBalance(userId.user_id, group_id))
  );
  const userBalances = balances.map((bal, i) => {
    return { user: users[i], result: bal };
  });
  const userIcons = userBalances.map((item, index) => (
    <div key={index} className="flex flex-col items-center">
      <UserCircleIcon width={50} height={50} />
      <h1>{item.user.firstname}</h1>
      <p className={item.result < 0 ? "text-red-500" : "text-green-500"}>
        {prettyMoney(item.result)}
      </p>
    </div>
  ));
  return (
    <div className="flex flex-col border-2 border-black rounded-md">
      <div className="text-xl p-2 border-b-2 border-black">Balances</div>
      <div className="flex flex-row p-2 gap-5 overflow-y-auto">{userIcons}</div>
    </div>
  );
}

export default GroupBalances;
