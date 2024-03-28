import { cn, prettyMoney } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { fetchUserBalancesForGroup } from "@/lib/databaseFunctions/fetchUserBalancesForGroup";

type Props = { user_id: string; group_id: string };

async function GroupBalances({ user_id, group_id }: Props) {
  const { rows } = await fetchUserBalancesForGroup(group_id);

  return (
    <Card className="border-none">
      <CardHeader className="sticky top-0 bg-card rounded-lg z-10">
        <CardTitle className="flex items-center">Balances</CardTitle>
      </CardHeader>
      {/* <Separator className="mb-2" /> */}
      <CardContent className="p-6 px-4 grid grid-rows-1 grid-flow-col gap-3 grid-cols-max auto-cols-[minmax(80px,1fr)] overflow-x-auto">
        {rows.map((balance, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center"
          >
            <Avatar>
              <AvatarFallback>
                {`${balance.firstname} ${balance.lastname}`
                  .match(/\b(\w)/g)
                  ?.join("") ?? "N/A"}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-lg text-muted-foreground">
              {balance.firstname}
            </h3>
            <p
              className={cn(
                "text-primary font-semibold pt-1 text-nowrap",
                balance.lent_amount - balance.owed_amount < 0 &&
                  "text-destructive"
              )}
            >
              {prettyMoney(balance.lent_amount - balance.owed_amount)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default GroupBalances;
