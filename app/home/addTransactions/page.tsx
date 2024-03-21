import { TransactionForm } from "../../../components/addTransactions/Form";
import { getNamesOfUsersInAGroup } from "@/lib/data";
import { useSearchParams } from 'next/navigation'




export default async function Page() {
  // const { id } = useSearchParams();
  const groupMembers = await getNamesOfUsersInAGroup()
  return <TransactionForm groupMembers={groupMembers}></TransactionForm>;
}
