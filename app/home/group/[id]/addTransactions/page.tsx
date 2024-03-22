import { TransactionForm } from "@/components/addTransactions/Form";
import { getNamesOfUsersInAGroup } from "@/lib/data";

export default async function Page() {
  const groupMembers = await getNamesOfUsersInAGroup()
  return <TransactionForm groupMembers={groupMembers}></TransactionForm>;
}
