import { TransactionForm } from '@/components/addTransactions/Form';
import { TransEdit } from '@/components/addTransactions/TransEdit';
import { getNamesOfUsersInAGroup } from '@/lib/transActions/data';
import { getUserId } from '@/lib/actions';
import { TransCrumbs } from '@/components/addTransactions/TransCrumbs';
import {
  getGroupsName,
  verifyGroupId,
  verifyTransId,
  getGroupNameWithTransId,
  fetchUsersFromTransactionId,
} from '@/lib/transActions/data';
import { GroupMembers } from '@/lib/definititions';

export default async function Page({ params }: { params: { id: string } }) {
  const verifyGroupID = await verifyGroupId(params.id);
  const verifyTransID = await verifyTransId(params.id);
  let groupMembers: GroupMembers[] = [];
  let groupName, userID;
  if (verifyGroupID) {
    try {
      userID = await getUserId();
      console.log('eyeD', userID);
      if (!userID) throw new Error('User ID not found');
    } catch (error) {
      console.log(error);
    }

    groupMembers = await getNamesOfUsersInAGroup(params.id);
    groupName = await getGroupsName(params.id);
  }
  let getNameTransId, membersOfTrans;
  if (verifyTransID) {
    try {
      getNameTransId = await getGroupNameWithTransId(params.id);
      membersOfTrans = await fetchUsersFromTransactionId(params.id);
      userID = await getUserId();
      if (!userID) throw new Error('User ID not found');
    } catch (e) {
      console.log('error', e);
    }
  }

  return (
    <>
      {verifyGroupID ? (
        <>
          <TransCrumbs name={groupName} edit='false' />
          <TransactionForm
            groupMembers={groupMembers}
            userID={String(userID)}
          ></TransactionForm>
        </>
      ) : (
        <>
          <TransCrumbs name={getNameTransId} edit='true' />
          <TransEdit
            membersOfTrans={membersOfTrans}
            userID={String(userID)}
          ></TransEdit>
        </>
      )}
    </>
  );
}
