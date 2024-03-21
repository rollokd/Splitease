import { GroupMembers, GroupUsersBasic } from "@/lib/definititions";
import { TransactionForm } from "../../components/addTransactions/Form";
import { getNamesOfUsersInAGroup } from "@/lib/data";




export default async function Page() {
  const groupMembers: GroupMembers[] = await getNamesOfUsersInAGroup()
  return <TransactionForm groupMembers={groupMembers}></TransactionForm>;
}
