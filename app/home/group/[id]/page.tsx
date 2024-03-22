import GroupCrumbs from "@/components/group-view/breadcrumbs";
import GroupBalances from "@/components/group-view/group-balances";
import TransactionList from "@/components/group-view/transaction-list";
import { Button } from "@/components/ui/button";
import { getUserId } from "@/lib/actions";
import { getGroupById } from "@/lib/data";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type Props = { params: { id: string } };

async function Page({ params }: Props) {
  const group_id = params.id;
  const user_id = await getUserId();
  const group = await getGroupById(group_id);
  return (
    <div className="flex flex-col p-3 gap-3 h-full last:mt-auto">
      <div className="flex flex-row items-center justify-between">
        <GroupCrumbs name={group?.name} group_id={group_id} />
        <Link href={`/home/edit/${group_id}`} passHref>
          <AdjustmentsHorizontalIcon className="w-8" />
        </Link>
      </div>
      {/* <div>Group name: {group?.name}</div> */}
      <GroupBalances user_id={user_id ?? ""} group_id={group_id} />
      <TransactionList group_id={group_id} />
      <Link href="/dashboard" passHref>
        <Button className="bg-green-500 w-full">Settle Up</Button>
      </Link>
    </div>
  );
}

export default Page;
