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
import GroupCrumbs from '@/components/group-view/breadcrumbs';
import { getTotalDebts } from '@/lib/databaseFunctions/getTotalDebts';
import TotalsPieChart from "@/components/pie-chart";
import TotalsPieChartDark from "@/components/pie-chart-dark";

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
      return { name: group.name, shortName: shortName, total: rows[0].lent_amount - rows[0].owed_amount, listOfUsers: listOfUsers, group_id: group.group_id };
    })
  );

  const totalBalances = await getTotalDebts(userID);
  const pieChartData = [
    {
      name: "Receive",
      value: Number(totalBalances.total_owed_amount)
    },
    {
      name: "Pay",
      value: Number(totalBalances.total_lent_amount)
    },
  ];

  return (
    <>
      <div className='p-5' >
        <GroupCrumbs name={'Analytics'} />
      </div>
      <div className='mt-4'>
        <Card className="border-none shadow-none">
          <CardHeader className='mb-4 ml-4'>
            <CardTitle>Group Balances</CardTitle>
          </CardHeader>
          <CardContent >
            <div className="flex justify-center pt-5 w-full">
              <GroupChart data={groupBalances}></GroupChart>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-none">
          <CardHeader className='mb-4 ml-4'>
            <CardTitle>Group Debts</CardTitle>
          </CardHeader>
          <CardContent >
            <div className="flex justify-center pt-5 w-full block dark:hidden">
              <TotalsPieChart data={pieChartData}></TotalsPieChart>
            </div>
            <div className="flex justify-center pt-5 w-full hidden dark:block">
              <TotalsPieChartDark data={pieChartData}></TotalsPieChartDark>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
