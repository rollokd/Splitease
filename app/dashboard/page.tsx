import { GroupCard } from '../../components/group-card';
import { GroupChart } from '../../components/bar-chart';
import { getUserGroups, fetchUserBalance } from '@/lib/data';
import Totals from '../../components/Totals';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Home() {
  // const userID: string = '9ec739f9-d23b-4410-8f1a-c29e0431e0a6';
  const userID: string = '410544b2-4001-4271-9855-fec4b6a6442a';
  const groupID: string = '5909a47f-9577-4e96-ad8d-7af0d52c3267';
  let userGroups = await getUserGroups(userID);
  if (userGroups === undefined) userGroups = [];
  const balances = await Promise.all(
    userGroups.map(async (group) => {
      let balance = await fetchUserBalance(userID, group.group_id);
      if (balance === undefined) balance = 0;
      return { name: group.name, total: balance };
    })
  );
  const groups = await Promise.all(
    userGroups.map(async (group) => {
      // console.log('Group ID: ', group.group_id);
      return { group_id: group.group_id };
    })
  );

  return (
    <>
      <Totals />

      <div className="m-4 flex content-end">
  <Button variant="outline">
    <Link href="/create">Create Group +</Link>
  </Button>
</div>
      <div>

       
        {groups.map((group) => (
          <GroupCard
            key={group.group_id}
            group_id={group.group_id}
            user_id={userID}
          />
        ))}
      </div>
      <div>
        <GroupChart data={balances}></GroupChart>
      </div>
     
    </>
  );
}
