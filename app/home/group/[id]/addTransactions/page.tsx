import { TransactionForm } from "@/components/addTransactions/Form";
import { TransEdit } from "@/components/addTransactions/TransEdit"
import { getNamesOfUsersInAGroup } from "@/lib/transActions/data";
import { getUserId } from '@/lib/actions';
import { TransCrumbs } from "@/components/addTransactions/TransCrumbs";
import { getGroupsName, verifyGroupId, verifyTransId, getGroupNameWithTransId } from "@/lib/transActions/data";
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
  const getNameTransId = await getGroupNameWithTransId(params.id)
  console.log(getNameTransId)
  return (
    <>
      {verifyGroupID && (
        <>
          <TransCrumbs
            name={groupName}
            edit="false"
          />
          <TransactionForm
            groupMembers={groupMembers}
            userID={String(userID)}
          >
          </TransactionForm>
        </>
      )}
      {verifyTransID && (
        <>
          <TransCrumbs
            name={getNameTransId}
            edit="true"
          />
          <TransEdit
          // transMembers={transMembers}
          // userID={String(userID)}
          >
          </TransEdit>
        </>
      )}
    </>
  );
}
