import { GroupCard } from "../../components/group-card";
import { GroupChart } from "../../components/bar-chart";
import { getUserGroups, fetchUserAndBalance, fetchOwnDashboardData } from "@/lib/data";
import Totals from "../../components/Totals";
import GroupPieChart from "@/components/pie-chart";

export default async function Home() {
  const userID: string = '9ec739f9-d23b-4410-8f1a-c29e0431e0a6';
  // const userID: string = '410544b2-4001-4271-9855-fec4b6a6442a';

  let userGroups = await getUserGroups(userID);
  if (userGroups === undefined) userGroups = [];
  const balances = await Promise.all(userGroups.map(async (group) => {
    let balance = await fetchUserAndBalance(userID, group.group_id);
    if (balance === undefined) balance = 0;
    return { name: group.name, total: balance };
  }));
  console.log('Balances response: ', balances);
  const groups = await Promise.all(userGroups.map(async (group) => {
    // console.log('Group ID: ', group.group_id);
    return { group_id: group.group_id };
  }));

  const pieChartData = await Promise.all(userGroups.map(async (group) => {
    let data = await fetchUserAndBalance(userID, group.group_id);
    if (data === undefined) data = 0;
    return { name: group.name, value: Math.abs(data) };
  }));

  return (
    <>
    <Totals />
    <div>
      {groups.map(group => (
        <GroupCard key={group.group_id} group_id={group.group_id} user_id={userID} />
      ))}
    </div>
    <div className="flex flex-col items-center justify-center">
      <div style={{ width: '80%', height: '100%' }}>
        <GroupChart data={balances}></GroupChart>
      </div>
      <div style={{ width: '100%', height: 400 }}>
        <GroupPieChart data={pieChartData} />
      </div>
    </div>
    </>
  );
}