import CardTotals from './cardTotals';
import { fetchOwnDashboardData } from '../lib/data';
import { moneyFormat } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import Link from 'next/link';

export default async function Totals({ userId }: { userId: string }) {
  let own;
  try {
    own = await fetchOwnDashboardData(userId);
  } catch (error) {
    console.log('fetchOwnDashboardData:', error);
  }
  let paidbyMeMoney = own?.paidbyMe;
  let myPortionOfBillsMoney = own?.myPortionOfBills;
  let totalMoney = own?.total;

  return (
    <Card className="border-none shadow-none">
      <CardHeader className='mb-4'>
        <CardTitle>Balances</CardTitle>
      </CardHeader>
     
      <CardContent className='m-2'>
      <div className="flex flex-wrap gap-2 md:gap-4 lg:gap-6">
        <div className="flex-1">
          <CardTotals
            myColor="text-green-500"
            title="Owed/Collect"
            amount={moneyFormat(paidbyMeMoney)}
          />
        </div>
        <div className="flex-1">
          <CardTotals
            myColor="text-red-500"
            title="Owe/Debt"
            amount={moneyFormat(myPortionOfBillsMoney)}
          />
        </div>
        <div className="flex-1">
          <div className="flex-1">
            <CardTotals
              myColor=""
              title="+ Get - Pay "
              amount={moneyFormat(totalMoney)}
            />
          </div>
        </div>
      </div>
      </CardContent>
      {/* <CardFooter>
        <Link href="/home/analytics" className='underline ml-4'>Analytics</Link>
      </CardFooter>  */}
    </Card>
  );
}
