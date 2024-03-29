import { TransactionForm } from "@/components/addTransactions/Form";
import { TransEdit } from "@/components/addTransactions/TransEdit"
import { getNamesOfUsersInAGroup } from "@/lib/transActions/data";
import { getUserId } from '@/lib/actions';
import { TransCrumbs } from "@/components/addTransactions/TransCrumbs";

import {
  getGroupsName,
  verifyGroupId,
  verifyTransId,
  getGroupNameWithTransId,
  fetchUsersFromTransactionId
} from "@/lib/transActions/data";
import GroupCrumbs from "@/components/group-view/breadcrumbs";

export default async function Page({ params }: { params: { id: string } }) {
  const [verifyGroupID, verifyTransID] = await Promise.all([
    verifyGroupId(params.id),
    verifyTransId(params.id),
  ])

  let groupMembers, groupName, userID;

  if (verifyGroupID) {
    try {
      const groupDataPromises = [
        getUserId(),
        getNamesOfUsersInAGroup(params.id),
        getGroupsName(params.id),
      ];


      [userID, groupMembers, groupName] = await Promise.all(groupDataPromises);

      if (!userID) throw new Error("User ID not found");
    } catch (error) {
      console.log(error);
    }
  }
  let getNameTransId, membersOfTrans;
  if (verifyTransID) {
    try {
      const transDataPromises = [
        getGroupNameWithTransId(params.id),
        fetchUsersFromTransactionId(params.id),
      ];
      [getNameTransId, membersOfTrans, userID] = await Promise.all([
        ...transDataPromises,
        getUserId(),
      ]);
      if (!userID) throw new Error("User ID not found");
    } catch (e) {
      console.log("error", e);
    }
  }

  return (
    <>
      {verifyGroupID ? (
        <>
          {/* <TransCrumbs
            name={groupName}
            edit="false"
          /> */}
          <GroupCrumbs
            name={groupName}
            group_id={params.id}
            edit={false}
            type="transaction"
          ></GroupCrumbs>
          <TransactionForm
            groupMembers={groupMembers}
            userID={String(userID)}
          >
          </TransactionForm>
        </>
      ) : (
        <>
          {/* <TransCrumbs
            name={getNameTransId}
            edit="true"
          /> */}
          <GroupCrumbs
            name={getNameTransId}
            group_id={membersOfTrans[0].group_id}
            edit={true}
            type="transaction"
          ></GroupCrumbs>
          <TransEdit
            membersOfTrans={membersOfTrans}
            userID={String(userID)}
          >
          </TransEdit>
        </>
      )}
    </>
  )


}
