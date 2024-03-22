import { TransactionForm } from "@/components/addTransactions/Form";
import { getNamesOfUsersInAGroup } from "@/lib/data";
import { getUserId } from '@/lib/actions';

export default async function Page({ params }: { params: { id: string } }) {

  let userID;
  try {
    userID = await getUserId();
    if (!userID) throw new Error("User ID not found");
    console.log('userID', userID);
  } catch (error) {
    console.log(error);
  }
  const groupMembers = await getNamesOfUsersInAGroup(params.id)
  return <TransactionForm groupMembers={groupMembers} userID={String(userID)}></TransactionForm>;
}
