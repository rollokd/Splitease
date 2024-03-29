import CardTotals from './cardTotals';
import { fetchOwnDashboardData } from '../lib/data';
import { moneyFormat } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

export default async function Totals({ userId }: { userId: string }) {
  let own;
  try {
    own = await fetchOwnDashboardData(userId);
  } catch (error) {
    console.log("fetchOwnDashboardData:", error);
  }
  let paidbyMeMoney = own?.paidbyMe;
  let myPortionOfBillsMoney = own?.myPortionOfBills;
  let totalMoney = own?.total ?? 0;

  let myTitle;
  let myColor;
  if (Math.sign(totalMoney) === -1) {
    myTitle = "Pay";
    myColor = "text-red-500";
  } else {
    myTitle = "Receive";
    myColor = "text-green-500";
  }

  return (
    <Card className="border-none shadow-none mr-2 ml-2  pt-0">
      <CardHeader className='flex flex-row justify-between'>
        
          <CardTitle>Balances</CardTitle>

          
          <Link href="/home/analytics" className='underline ml-4'>
            <Button variant={'outline'}>
              <BarChart3 className="mr-2" />
              Analytics
            </Button>
          </Link>
        
         
    
        
      </CardHeader>
     
      <CardContent className='pt-0 pb-0'>
      <div className="flex flex-wrap gap-2 md:gap-4 lg:gap-6">
        <div className="flex-1">
          <CardTotals
            myColor="text-green-500"
            title="Collect"
            amount={moneyFormat(paidbyMeMoney)}
          />
        </div>
        <div className="flex-1">
          <CardTotals
            myColor="text-red-500"
            title="Debt"
            amount={moneyFormat(myPortionOfBillsMoney)}
          />
        </div>
        <div className="flex-1">
          <div className="flex-1">
            <CardTotals
              myColor={myColor}
              title={myTitle}
              amount={moneyFormat(totalMoney)}
            />
          </div>
        </div>
      </div>
      </CardContent>
      <CardFooter>
        {/* <Link href="/home/analytics" className="underline ml-4">
          Analytics
        </Link> */}
      </CardFooter>
    </Card>
  );
}
