import { sql } from "@vercel/postgres";
import { GroupCard } from "@/components/ui/group-card";
import { GroupChart } from "@/components/ui/bar-chart";

// export async function gabe () {
//   const userID: string = '9ec739f9-d23b-4410-8f1a-c29e0431e0a6';
//   const groupID: string = '5909a47f-9577-4e96-ad8d-7af0d52c3267';
//   try {
//     // const userTransactions = await fetchUserTransactionsAndGroups();
//     const groupTotals = await fetchGroupTotals(userID, groupID);
//     const userByGroup = await getUsersbyGroup(groupID);

//     // console.log('here sebA userTransactions: ', userTransactions);
//     console.log('here sebA: groupTotals', groupTotals);
//     console.log('here sebA usersbyGroup: ', userByGroup);
//     //loop 
//   } catch (error) {
//     console.error('Error querying the database:', error);
//   }
// }
export default async function  Home() {
  const userID: string = '9ec739f9-d23b-4410-8f1a-c29e0431e0a6';
  const groupID: string = '5909a47f-9577-4e96-ad8d-7af0d52c3267';

  return (
    <>
    <div>
      <GroupChart groupID={groupID} userID={userID} ></GroupChart>
    </div>
    <div>
      <GroupCard groupID={groupID} userID={userID} />
    </div>
    </>
  );
}