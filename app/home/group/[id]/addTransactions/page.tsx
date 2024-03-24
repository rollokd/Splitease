import { TransactionForm } from "@/components/addTransactions/Form";
import { getNamesOfUsersInAGroup } from "@/lib/transActions/data";
import { getUserId } from '@/lib/actions';
import { TransCrumbs } from "@/components/addTransactions/TransCrumbs";
import { getGroupsName, verifyGroupId, verifyTransId } from "@/lib/transActions/data";
export default async function Page({ params }: { params: { id: string } }) {

  let userID;
  try {
    userID = await getUserId();
    if (!userID) throw new Error("User ID not found");
    console.log('userID', userID);
  } catch (error) {
    console.log(error);
  }

  const groupMembers = await getNamesOfUsersInAGroup(params.id);
  const groupName = await getGroupsName(params.id);
  const verifyGroupID = await verifyGroupId(params.id);
  const verifyTransID = await verifyTransId(params.id);
  return (
    <>
      {verifyGroupID && (
        <>
          <TransCrumbs name={groupName} />
          <TransactionForm
            groupMembers={groupMembers}
            userID={String(userID)}
          >
          </TransactionForm>
        </>
      )}
      {verifyTransID && (
        <>
          <TransCrumbs name={groupName} />
          <TransactionEdit
            groupMembers={groupMembers}
            userID={String(userID)}
          >
          </TransactionEdit>
        </>
      )}
    </>
  );
}
