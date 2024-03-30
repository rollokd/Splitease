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
  const balancesArray = await getMyDebtsForAll(userID)
  const balances = await Promise.all(balancesArray.map(async (debt) => {
    return { id: debt.id, name: debt.firstname, total: moneyFormat(debt.owed_amount - debt.lent_amount) };
  }))

  return (
    <>
    <div className="p-5">
      <GroupCrumbs name={'Settle Up Balances'} />
    </div>
    <div className="flex flex-col items-center justify-center p-10">
      <Card>
        <CardHeader>
          <CardTitle>
            Balances
          </CardTitle>
        </CardHeader>
        <div>
          {balances.map((balance, index) => (
            <DashboardCard key={index} name = {balance.name} debt={balance.total} other_id={balance.id} user_id={userID} />
          ))}
        </div>
      </Card>
    </div>
    </>
  );
}