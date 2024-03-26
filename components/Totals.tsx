import CardTotals from './cardTotals';
import { fetchOwnDashboardData } from '../lib/data';
import { moneyFormat } from '@/lib/utils';

export default async function Totals({ userId }: { userId: string }) {
  let own;
  try {
    own = await fetchOwnDashboardData(userId);
    
  } catch (error) {
    console.log('fetchOwnDashboardData:', error);
    
  }

  let paidbyMeMoney = own?.paidbyMe;
  let myPortionOfBillsMoney = own?.myPortionOfBills;
  // let totalMoney = (own?.total ?? 0) / 100;
  let totalMoney = own?.total;
  return (
    <>
      <div className="flex flex-wrap gap-2 md:gap-4 lg:gap-6">
        <div className="flex-1">
          <CardTotals
            myColor="text-green-500"
            title="Owed"
            amount={moneyFormat(paidbyMeMoney)}
          />
        </div>
        <div className="flex-1">
          <CardTotals
            myColor="text-red-500"
            title="Owe"
            amount={moneyFormat(myPortionOfBillsMoney)}
          />
        </div>
        <div className="flex-1">
          <div className="flex-1">
            <CardTotals
              myColor=""
              title="Total"
              amount={moneyFormat(totalMoney)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
