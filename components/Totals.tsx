import CardTotals from './cardTotals';
import { fetchOwnDashboardData } from '../lib/data';

export default async function Totals() {
  const own = await fetchOwnDashboardData();

  let paidbyMeMoney = (own?.paidbyMe ?? 0) / 1000;
  let myPortionOfBillsMoney = (own?.myPortionOfBills ?? 0) / 1000;
  let totalMoney = (own?.total ?? 0) / 1000;
  return (
    <>
      <div className="flex flex-wrap gap-2 md:gap-4 lg:gap-6">
        <div className="flex-1">
          <CardTotals
            myColor="text-green-500"
            title="Paid By Me"
            amount={paidbyMeMoney}
          />
        </div>
        <div className="flex-1">
          <CardTotals
            myColor="text-red-500"
            title="My Portion"
            amount={myPortionOfBillsMoney}
          />
        </div>
        <div className="flex-1">
          <div className="flex-1">
            <CardTotals myColor="" title="Balance" amount={totalMoney} />
          </div>
        </div>
      </div>
    </>
  );
}
