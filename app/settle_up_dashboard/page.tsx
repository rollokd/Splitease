import { DashboardCard } from "@/components/settleDashboardCard";
import { getSpecificDebt, getDebts } from "@/lib/data";
import GroupCrumbs from "@/components/group-view/breadcrumbs";

type Props = { params: { id: string } };

export default async function SettleUpDashBoard({ params }: Props) {
  const userID: string = '9ec739f9-d23b-4410-8f1a-c29e0431e0a6';
  // const userID: string = '410544b2-4001-4271-9855-fec4b6a6442a';

  let debts = await getDebts(userID);
  if (debts === undefined) debts = [];
  console.log('Get debts result: ', debts);

  const balances = await Promise.all(debts.map(async (debt) => {
    //Get what that person owes me
    let balance = await getSpecificDebt(userID, debt.paid_by);
    if (balance === undefined) balance = 0;
    return { name: debt.paid_by, total: (balance - Number(debt.sum) ) };
  }));
  console.log('Get balances result: ', balances);

  return (
    <>
    <div className="p-5">
      <GroupCrumbs name={'SettleUp'} />
    </div>
    <div className="flex flex-col items-center justify-center p-10">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Balances
      </h4>
      {balances.map((balance, index) => (
        <DashboardCard key={index} user_id = {balance.name} debt={balance.total} />
      ))}
    </div>
    </>
  );
}