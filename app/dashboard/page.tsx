import Totals from './Totals';

import  { fetchOwnDashboardData  } from '../../lib/data';




export default async function  Home() {
    const own = await fetchOwnDashboardData (); 
    console.log('here sebA: ', own);


    console.log('obj: ', own?.paidbyMe);
    return (
      <>
        <div className="flex flex-wrap gap-2 md:gap-4 lg:gap-6">
          <div className="flex-1">
            <Totals title="Paid By Me" Total={own?.paidbyMe/1000} />
          </div>
          <div className="flex-1">
            <Totals title="My Portion" Total={own?.myPortionOfBills/1000} />
          </div>
          <div className="flex-1">
            <Totals title="Balance" Total={own?.total/1000} />
          </div>
        </div>
      </>
    );
  }