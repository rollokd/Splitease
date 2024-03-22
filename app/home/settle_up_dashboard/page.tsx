import { DashboardCard } from "@/components/settleDashboardCard";
import { getSpecificDebt, getDebts } from "@/lib/data";
import GroupCrumbs from "@/components/group-view/breadcrumbs";
import { Button } from "@/components/ui/button";
import { getUserId } from "@/lib/actions";
import { moneyFormat } from "@/lib/utils";
type Props = { params: { id: string } };
export default async function SettleUpDashBoard({ params }: Props) {
  let userID : string = '';
  try {
    userID = await getUserId() as unknown as string;
    console.log('User ID from dashboard settle up: ', userID);
  } catch (error) {
    console.log(error);
  }
  let debts = await getDebts(userID);
  if (debts === undefined) debts = [];
  // console.log('Get debts result: ', debts);
  const balances = await Promise.all(debts.map(async (debt) => {
    //Get what that person owes me
    let balance = await getSpecificDebt(userID, debt.paid_by);
    if (balance === undefined) balance = 0;
    return { name: debt.paid_by, total: moneyFormat(balance - Number(debt.sum)) };
  }));
  // console.log('Get balances result: ', balances);
  return (
    <>
    <div className="p-5">
      <GroupCrumbs name={'SettleUp'} />
    </div>
    <div className="flex flex-col items-center justify-center p-10">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Balances
      </h4>
      <div>
        {balances.map((balance, index) => (
          <DashboardCard key={index} user_id = {balance.name} debt={balance.total} />
        ))}
      </div>
      <div className="p-5">
        <Button className='bg-green-500'>
          Settle Up
        </Button>
      </div>
    </div>
    </>
  );
}