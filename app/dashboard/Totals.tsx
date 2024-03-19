import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import  { fetchOwnDashboardData  } from '../../lib/data';


export default async function Totals() {

  const svgIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="h-4 w-4 text-muted-foreground"
    >
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );

  const own = await fetchOwnDashboardData (); 
  console.log('here sebA: ', own);


  console.log('obj: ', own?.paidbyMe);
// extract component gabe :)
  return (
    <>

<div className="flex flex-wrap gap-2 md:gap-4 lg:gap-6">
          <div className="flex-1">
          <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-500">Paid By Me</CardTitle>
          {svgIcon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${own?.paidbyMe/1000}</div>
          <p className="text-xs text-muted-foreground">
          3106eb8a-3288-4b62-a077-3b24bd640d9a
          </p>
        </CardContent>
      </Card>
            
          </div>
          <div className="flex-1">
          <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-500">My Portion</CardTitle>
          {svgIcon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$-{own?.myPortionOfBills/1000}</div>
          <p className="text-xs text-muted-foreground">
          3106eb8a-3288-4b62-a077-3b24bd640d9a
          </p>
        </CardContent>
      </Card>
          </div>
          <div className="flex-1">
          <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
          {svgIcon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$27</div>
          <p className="text-xs text-muted-foreground">
          3106eb8a-3288-4b62-a077-3b24bd640d9a
          </p>
        </CardContent>
      </Card>
          </div>
        </div>






    </>
  );
}
