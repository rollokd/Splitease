export const dynamic = "force-dynamic"
import { DashboardCard } from "@/components/settleDashboardCard";
import { getSpecificDebt, getDebts } from "@/lib/data";
import GroupCrumbs from "@/components/group-view/breadcrumbs";
import { Button } from "@/components/ui/button";
import { getUserId } from "@/lib/actions";
import { moneyFormat } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getMyDebtsForAll } from "@/lib/databaseFunctions/getMyDebtsForAll";

export default async function SettleUpDashBoard() {

  const userID = (await getUserId()) as string;
  // console.log('User ID from dashboard settle up: ', userID);
  const balancesArray = await getMyDebtsForAll(userID)
  const balances = await Promise.all(balancesArray.map(async (debt) => {
    return { id: debt.id, name: debt.firstname, total: moneyFormat(debt.owed_amount - debt.lent_amount) };
  }))

  const filteredBalances = balances.filter(debt => {
    if (Number(debt.total) != 0) {
      return true 
    }
  })
  // console.log('Get filteredBalances result: ', filteredBalances);

  return (
    <>
    <div className="p-5">
      <GroupCrumbs name={'SettleUp'} />
    </div>
    <div className="flex flex-col items-center justify-center p-10">
      {/* <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Balances
      </h4> */}
      <Card>
        <CardHeader>
          <CardTitle>
            Balances
          </CardTitle>
          {/* <CardDescription>
            per person
          </CardDescription> */}
        </CardHeader>
        <div>
          {filteredBalances.map((balance, index) => (
            <DashboardCard key={index} name = {balance.name} debt={balance.total} other_id={balance.id} user_id={userID} />
          ))}
        </div>
      </Card>
      {/* <div className="p-5">
        <Button className='bg-green-500'>
          Settle Up
        </Button>
      </div> */}
    </div>
    </>
  );
}