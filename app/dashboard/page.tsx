import { GroupCard } from "../../components/group-card";
import { GroupChart } from "../../components/bar-chart";
import { getUserGroups, fetchUserAndBalance, fetchOwnDashboardData } from "@/lib/data";
import Totals from "../../components/Totals";
import GroupPieChart from "@/components/pie-chart";

export default async function Home() {
  const userID: string = '9ec739f9-d23b-4410-8f1a-c29e0431e0a6';
  // const userID: string = '410544b2-4001-4271-9855-fec4b6a6442a';
  const groupID: string = '5909a47f-9577-4e96-ad8d-7af0d52c3267';
  let userGroups = await getUserGroups(userID);
  if (userGroups === undefined) userGroups = [];
  const balances = await Promise.all(userGroups.map(async (group) => {
    let balance = await fetchUserAndBalance(userID, group.group_id);
    if (balance === undefined) balance = 0;
    return { name: group.name, total: balance };
  }));
  const groups = await Promise.all(userGroups.map(async (group) => {
    // console.log('Group ID: ', group.group_id);
    return { group_id: group.group_id };
  }));

  // const own = await fetchOwnDashboardData();
  // let paidbyMeMoney = (own?.paidbyMe ?? 0) / 1000;
  // let myPortionOfBillsMoney = (own?.myPortionOfBills ?? 0) / 1000;
  // let totalMoney = (own?.total ?? 0) / 1000;
  // const pieChartData = [
  //   {
  //   name: 'paidbyMeMoney',
  //   value: paidbyMeMoney
  //   },
  //   {
  //   name: 'totalMoney',
  //   value: totalMoney
  //   }
  // ]

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
    <div>
      <GroupChart data={balances}></GroupChart>
    </div>
    <div style={{ width: '100%', height: 400 }}>
      <GroupPieChart data={pieChartData} />
    </div>
    </>
  );
}