export const dynamic = "force-dynamic";
import GroupCrumbs from "@/components/group-view/breadcrumbs";
import GroupBalances from "@/components/group-view/group-balances";
import TransactionList from "@/components/group-view/transaction-list";
import { Button } from "@/components/ui/button";
import { getUserId } from "@/lib/actions";
import { getGroupById } from "@/lib/data";
import { Settings, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

type Props = { params: { id: string } };

async function Page({ params }: Props) {
  const group_id = params.id;
  const user_id = await getUserId();
  const group = await getGroupById(group_id);
  if (!user_id) throw new Error("User not found");
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row items-center justify-between p-4">
        <GroupCrumbs name={group?.name} group_id={group_id} />
        <Link href={`/home/edit/${group_id}`} passHref>
          <Button variant={"outline"} size={"icon"}>
            <Settings strokeWidth={1.5} className="h-[1.4rem] w-[1.4rem]" />
          </Button>
        </Link>
      </div>
      <div className="flex flex-col gap-4 px-4">
        <GroupBalances user_id={user_id ?? ""} group_id={group_id} />
        <TransactionList group_id={group_id} user_id={user_id} />
      </div>
      <div className="sticky bottom-0 bg-background p-4 w-full mt-auto">
        <Link href={`${group_id}/settle_up`} passHref>
          <Button className="w-full">Settle Up</Button>
        </Link>
      </div>
    </div>
  );
}

export default Page;
