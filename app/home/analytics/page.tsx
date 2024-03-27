export const dynamic = 'force-dynamic';
import { GroupCard } from '@/components/group-card';
import { GroupChart } from '../../../components/bar-chart';
import { getUserGroups, getUsersbyGroup } from '../../../lib/data';
import Totals from '../../../components/Totals';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { fetchOneUserBalanceForGroup } from '@/lib/databaseFunctions/fetchOneUserBalanceForGroup';
import { getUserId } from '@/lib/actions';
import { moneyFormat } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserWJunction } from '@/lib/definititions';

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
      return { name: group.name, shortName: shortName, total: rows[0].lent_amount - rows[0].owed_amount, listOfUsers: listOfUsers, group_id: group.group_id };
    })
  );

  return (
    <div className='mt-4'>
      <Card className="border-none shadow-none">
        <CardHeader className='mb-4'>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
    
        <CardContent className='m-2'>
          <div className="flex justify-center pt-5">
            <GroupChart data={groupBalances}></GroupChart>
          </div>
        </CardContent>
      </Card>
    </div>

     
 
  );
}
