export const dynamic = "force-dynamic";
import GroupCrumbs from "@/components/group-view/breadcrumbs";
import GroupBalances from "@/components/group-view/group-balances";
import TransactionList from "@/components/group-view/transaction-list";
import { Button } from "@/components/ui/button";
import { getUserId } from "@/lib/actions";
import { getGroupById } from "@/lib/data";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";

type Props = { params: { id: string } };

async function Page({ params }: Props) {
  const group_id = params.id;
  const user_id = await getUserId();
  const group = await getGroupById(group_id);
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="px-3 pt-3 flex flex-col gap-3 h-full">
        <div className="flex flex-row items-center justify-between">
          <GroupCrumbs name={group?.name} group_id={group_id} />
          <Link href={`/home/edit/${group_id}`} passHref>
            <SlidersHorizontal className="h-6 w-6" />
          </Link>
        </div>
        <GroupBalances user_id={user_id ?? ""} group_id={group_id} />
        <TransactionList group_id={group_id} user_id={user_id} />
      </div>
      <div className="sticky bottom-0 bg-background p-3">
        <Link href={`${group_id}/settle_up`} passHref>
          <Button className="bg-green-500 w-full">Settle Up</Button>
        </Link>
      </div>
    </div>
  );
}

export default Page;
