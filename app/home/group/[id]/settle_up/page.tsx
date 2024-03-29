export const dynamic = "force-dynamic";
import GroupCrumbs from "@/components/group-view/breadcrumbs";
import SettleCard from "@/components/group-view/settle-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUserId } from "@/lib/actions";
import { getGroupById } from "@/lib/data";
import { getMyDebtsForGroup } from "@/lib/databaseFunctions/getMyDebtsForGroup";
import Link from "next/link";

type Props = { params: { id: string } };

const SettleUp = async ({ params }: Props) => {
  const group_id = params.id;
  console.log("group_id", group_id);
  const [user_id, group] = await Promise.all([
    getUserId(),
    getGroupById(group_id),
  ]);

  if (!user_id) throw new Error("User not found");

  const debts = await getMyDebtsForGroup(user_id, group_id);
  return (
    <div className="flex flex-col p-3 gap-3">
      <GroupCrumbs name={group?.name} group_id={group_id} type={"settle"} />
      <Card className="border-none">
        <CardHeader>
          <CardTitle>{group?.name}</CardTitle>
        </CardHeader>
        {/* <Separator /> */}
        <CardContent>
          {debts.map((debt, index) => (
            <SettleCard
              key={index}
              debt={debt}
              user_id={user_id}
              index={index}
              group_id={group_id}
            />
          ))}
        </CardContent>
        <CardFooter className="justify-center p-3">
          <Link href={`/home/group/${group_id}`}>
            <Button>Back to group</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SettleUp;
