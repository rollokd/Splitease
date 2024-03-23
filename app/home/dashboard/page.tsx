import { GroupCard } from '@/components/group-card';
import { GroupChart } from '../../../components/bar-chart';
import {
  getUserGroups,
  fetchUserBalance,
  getUserIdFromSession
} from '../../../lib/data';
import Totals from '../../../components/Totals';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { signOut, auth } from '@/auth';
import { PowerIcon } from '@heroicons/react/24/outline';
import { createGroup, getUserId } from '@/lib/actions';
import { moneyFormat } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { ModeToggle } from '@/components/themeMode';
import { YAxis } from "recharts";

export default async function Home() {
  const userID = (await getUserId()) as string;

  let userGroups = await getUserGroups(userID);
  if (userGroups === undefined) userGroups = [];
  const balances = await Promise.all(
    userGroups.map(async (group) => {
      let balance = await fetchUserBalance(userID, group.group_id);
      if (balance === undefined) balance = 0;
      let name = group.name;
      if (name.length >= 5) {
        name = name.slice(0, 5);
      }
      return { name: `${name}...`, total: moneyFormat(balance) };
    })
  );
  console.log('Balances results: ', balances);
  const groups = await Promise.all(
    userGroups.map(async (group) => {
      // console.log('Group ID: ', group.group_id);
      return { group_id: group.group_id };
    })
  );

  //const bears = useStore((state) => state.bears);
  return (
    <>
      <div className="p-4">
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <ModeToggle />
          <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
        <Totals userId={userID} />

      <div className="m-4 flex justify-end">
        <Button variant="outline">
          <Link href="/home/create">Create Group +</Link>
        </Button>
      </div>
      <div style={{ height: "400px", overflowY: "auto", borderColor: "var(--card)", borderRadius: "5px", borderStyle: 'ridge', borderWidth: "1px"}}>
        {userID &&
          groups.map((group) => (
            <Link key={group.group_id} href={`/home/group/${group.group_id}`}>
              <GroupCard
                key={group.group_id}
                group_id={group.group_id}
                user_id={userID}
              />
            </Link>
          ))}
      </div>
      <div className='flex justify-center pt-5'>
        <GroupChart data={balances}></GroupChart>
      </div>
      <div className='flex justify-center m-4 pt-1 pb-3'>
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
