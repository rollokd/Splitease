export const dynamic = "force-dynamic";
// import { GroupCard } from '@/components/group-card-test';
import { GroupCard } from "@/components/group-card";
import { GroupChart } from "../../../components/bar-chart";
import {
  getUserGroups,
  fetchUserBalance,
  getUsersbyGroup,
} from "../../../lib/data";
import Totals from "../../../components/Totals";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut, auth } from "@/auth";
import { PowerIcon } from "@heroicons/react/24/outline";
import { getUserId } from "@/lib/actions";
import { moneyFormat } from "@/lib/utils";
import { ModeToggle } from "@/components/themeMode";
import { fetchOneUserBalanceForGroup } from "@/lib/databaseFunctions/fetchOneUserBalanceForGroup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserWJunction } from "@/lib/definititions";
import { redirect } from "next/navigation";



const getUsers = (userByGroup: UserWJunction[]) => {
  const firstnames = userByGroup.map((user) => user.firstname);
  // console.log(firstnames);
  return firstnames;
};

export default async function Home() {
  let userID: string | undefined;
  try {
    userID = await getUserId();
  } catch (error) {
    console.error("Failed to fetch userID:", error);
  }
  if (userID === undefined) {
    console.error("Failed to fetch userID");
    redirect("login");
  }

  let userGroups = await getUserGroups(userID);
  if (userGroups === undefined) userGroups = [];
  const groupBalances = await Promise.all(
    userGroups.map(async (group) => {
      let { rows } = await fetchOneUserBalanceForGroup(userID, group.group_id);

      const userByGroup = await getUsersbyGroup(group.group_id);
      const listOfUsers = getUsers(userByGroup || []);
      return {
        name: group.name,
        total: rows[0].lent_amount - rows[0].owed_amount,
        listOfUsers: listOfUsers,
        group_id: group.group_id,
      };
    })
  );
  console.log("Balances results from dashboard page: ", groupBalances);
  // const groupIDs = await Promise.all(
  //   userGroups.map(async (group) => {
  //     // console.log('Group ID: ', group.group_id);
  //     return { group_id: group.group_id };
  //   })
  // );

  return (
    <div className='mt-4'>
      <Totals userId={userID} />

      
      <div className="m-4 flex justify-end">
        <Button>
          <Link href="/home/create">Create Group +</Link>
        </Button>
      </div>
      <Card className="border-none shadow-none">
        <CardHeader className='mb-4'>
          <CardTitle>Groups</CardTitle>
        </CardHeader>

        <CardContent>
          <div
            style={{
              height: '400px',
              overflowY: 'auto'
              // borderColor: 'var(--card)',
              // borderRadius: '5px',
              // borderStyle: 'ridge',
              // borderWidth: '1px'
            }}
          >
            {userID &&
              groups.map((group) => (
                <Link
                  key={group.group_id}
                  href={`/home/group/${group.group_id}`}
                >
                  <GroupCard
                    key={group.group_id}
                    group_id={group.group_id}
                    user_id={userID}
                  />
                </Link>
              ))}
          </div>
        </CardContent>
        </Card>
        
        <div className="flex justify-center pt-5 mt-5 mb-10">
          <GroupChart data={groupBalances}></GroupChart>
        </div>
        <div className="flex justify-center m-4 pt-1 pb-3 fixed inset-x-0 bottom-0">
          <Link className="w-full" href={`/home/settle_up_dashboard`}>
            <Button className="w-full">Settle Up</Button>
          </Link>
        </div>
      </div>
  );
}
