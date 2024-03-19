import Totals from './Totals';

import  { OwnDashboard } from '../../lib/data';




export default async function  Home() {
    const own = await OwnDashboard(); 
    console.log('here sebA: ', own);


    return (
      <>
      <div className="flex flex-wrap gap-2 md:gap-4 lg:gap-6">
   <div className="flex-1"><Totals tittle='Own' Total={own}/></div> 
  <div className="flex-1"><Totals /></div>
  <div className="flex-1"><Totals /></div>
</div>

      </>
    );
  }