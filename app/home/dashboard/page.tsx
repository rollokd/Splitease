export const dynamic = 'force-dynamic';
import { GroupCard } from '@/components/group-card-test';
import { GroupChart } from '../../../components/bar-chart';
import { getUserGroups, fetchUserBalance } from '../../../lib/data';
import Totals from '../../../components/Totals';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut, auth } from '@/auth';
import { PowerIcon } from '@heroicons/react/24/outline';
import { getUserId } from '@/lib/actions';
import { moneyFormat } from '@/lib/utils';
import { ModeToggle } from '@/components/themeMode';
import { fetchOneUserBalanceForGroup } from '@/lib/databaseActions/fetchOneUserBalanceForGroup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Home() {
  const userID = (await getUserId()) as string;

  let userGroups = await getUserGroups(userID);
  if (userGroups === undefined) userGroups = [];
  const balances = await Promise.all(
    userGroups.map(async (group) => {
      let { rows } = await fetchOneUserBalanceForGroup(userID, group.group_id);
      let name = group.name;
      if (name.length >= 5) {
        name = `${name.slice(0, 5)}...`;
      }
      return { name: name, total: moneyFormat(rows[0].lent_amount - rows[0].owed_amount) };
    })
  );
  // console.log('Balances results from dashboard page: ', balances);
  const groups = await Promise.all(
    userGroups.map(async (group) => {
      // console.log('Group ID: ', group.group_id);
      return { group_id: group.group_id };
    })
  );

  return (
    <>
      <div className="p-4">
        <div className="mb-2">
            <form
              action={async () => {
                'use server';
                await signOut();
              }}
            >
              <ModeToggle />
              <Button className="ml-4">
                <PowerIcon className="w-4" />{' '}
                <div className="ml-2"> Sign Out</div>{' '}
              </Button>
            </form>
          </div>
          <Totals userId={userID} />

        <div className="m-4 flex justify-end">
          <Button variant="outline">
            <Link href="/home/create">Create Group +</Link>
          </Button>
        </div>
        <div style={{ height: "400px", overflowY: "auto" }}>
          {/* <Card className='m-2'>
            <CardHeader>
              <CardTitle>
                Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userID &&
                groups.map(({ group_id }) => (
                  <Link key={group_id} href={`/home/group/${group_id}`}>
                    <GroupCard
                      key={group_id}
                      group_id={group_id}
                      user_id={userID}
                    />
                  </Link>
                ))}
            </CardContent>
          </Card> */}
          <div>
            {userID &&
              groups.map(({ group_id }) => (
                <Link key={group_id} href={`/home/group/${group_id}`}>
                  <GroupCard
                    key={group_id}
                    group_id={group_id}
                    user_id={userID}
                  />
                </Link>
              ))}
          </div>
        </div>
        <div className='flex justify-center pt-5 mt-5 mb-10'>
          <GroupChart data={balances}></GroupChart>
        </div>
        <div className='flex justify-center m-4 pt-1 pb-3 fixed inset-x-0 bottom-0'>
          <Link className="w-full" href={`/home/settle_up_dashboard`}>
            <Button className='bg-green-500 w-full'>
              Settle Up
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
