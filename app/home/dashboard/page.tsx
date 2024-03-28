export const dynamic = 'force-dynamic';
import { GroupCard } from '@/components/group-card';
import { getUserGroups, getUsersbyGroup } from '../../../lib/data';
import Totals from '../../../components/Totals';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getUserId } from '@/lib/actions';
import { fetchOneUserBalanceForGroup } from '@/lib/databaseFunctions/fetchOneUserBalanceForGroup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserWJunction } from '@/lib/definititions';
import { redirect } from 'next/navigation';

const getUsers = (userByGroup: UserWJunction[]) => {
  const firstnames = userByGroup.map((user) => user.firstname);
  return firstnames;
};

export default async function Home() {
  let userID: string | undefined;
  try {
    userID = await getUserId();
  } catch (error) {
    console.error('Failed to fetch userID:', error);
  }
  if (userID === undefined) {
    console.error('Failed to fetch userID');
    redirect('login');
  }

  let userGroups = await getUserGroups(userID);
  if (userGroups === undefined) userGroups = [];
  const groupBalances = await Promise.all(
    userGroups.map(async (group) => {
      let { rows } = await fetchOneUserBalanceForGroup(userID, group.group_id);
      let shortName = group.name;
      if (shortName.length >= 5) {
        shortName = `${shortName.slice(0, 7).replace(/\s$/, '')}..`;
      }
      const userByGroup = await getUsersbyGroup(group.group_id);
      const listOfUsers = getUsers(userByGroup || []);
      return {
        name: group.name,
        shortName: shortName,
        total: rows[0].lent_amount - rows[0].owed_amount,
        listOfUsers: listOfUsers,
        group_id: group.group_id
      };
    })
  );

  return (
    <div className='mt-4 pl-2 pr-2'>
      <Totals userId={userID} />
      <Card className="border-none shadow-none">
        <CardHeader className='mb-4 flex flex-row justify-between items-center'>
          <CardTitle>Groups</CardTitle>
          <div className="flex justify-between items-center transform translate-y-4">
            <Button>
              <Link href="/home/create">Create Group +</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] overflow-y-auto" >
            <div>
              {userID &&
                groupBalances.map((group) => (
                  <Link
                    key={group.group_id}
                    href={`/home/group/${group.group_id}`}
                  >
                    <GroupCard
                      key={group.group_id}
                      groupName={group.name}
                      groupTotals={Number(group.total)}
                      listOfUsers={group.listOfUsers}
                    />
                  </Link>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* <div className='flex justify-center pt-5 mt-5 mb-10'>
        {userID && <GroupChart data={groupBalances}></GroupChart>}
      </div> */}
      <div className="flex justify-center m-4 sticky bg-background bottom-0">
        <Link className="w-full" href={`/home/settle_up_dashboard`}>
          <Button className="w-full">Settle Up Balances </Button>
        </Link>
      </div>
    </div>
  );
}
