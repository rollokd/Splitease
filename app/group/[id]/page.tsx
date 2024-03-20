import GroupCrumbs from "@/components/group-view/breadcrumbs";
import GroupBalances from "@/components/group-view/group-balances";
import TransactionList from "@/components/group-view/transaction-list";
import { Button } from "@/components/ui/button";
import { getGroupById } from "@/lib/data";
import Link from "next/link";

type Props = { params: { id: string } };

async function Page({ params }: Props) {
  const group_id = params.id;
  const group = await getGroupById(group_id);
  return (
    <div className="flex flex-col p-3 gap-3 h-full last:mt-auto">
      <GroupCrumbs name={group?.name} />
      <div>Group name: {group?.name}</div>
      <GroupBalances group_id={group_id} />
      <TransactionList group_id={group_id} />
      <Link href="/dashboard" passHref>
        <Button className="bg-green-500 w-full">Settle Up</Button>
      </Link>
    </div>
  );
}

export default Page;
