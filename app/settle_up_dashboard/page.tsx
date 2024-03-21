import { DashboardCard } from "@/components/settleDashboardCard";
import { getSpecificDebt, getDebts } from "@/lib/data";

export default async function Home() {
  const userID: string = '9ec739f9-d23b-4410-8f1a-c29e0431e0a6';
  // const userID: string = '410544b2-4001-4271-9855-fec4b6a6442a';
  const groupID: string = '5909a47f-9577-4e96-ad8d-7af0d52c3267';

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
    <div>
      {balances.map((balance, index) => (
        <DashboardCard key={index} name = {balance.name} debt={balance.total} />
      ))}
    </div>
    </>
  );
}