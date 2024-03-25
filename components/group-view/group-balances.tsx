import { cn, prettyMoney } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { fetchUserBalancesForGroup } from "@/lib/databaseActions/fetchUserBalancesForGroup";

type Props = { user_id: string; group_id: string };

async function GroupBalances({ user_id, group_id }: Props) {
  const { rows } = await fetchUserBalancesForGroup(group_id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="h-9 flex items-center">Balances</CardTitle>
      </CardHeader>
      <Separator className="mb-2" />
      <CardContent className="grid grid-rows-1 grid-flow-col gap-6 grid-cols-max auto-cols-[minmax(80px,1fr)] overflow-x-auto">
        {rows.map((balance) => (
          <div
            key={balance.user_id}
            className="flex flex-col items-center justify-center"
          >
            <Avatar>
              <AvatarFallback>
                {`${balance.firstname} ${balance.lastname}`
                  .match(/\b(\w)/g)
                  ?.join("") ?? "N/A"}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-muted-foreground">{balance.firstname}</h3>
            <p
              className={cn(
                "text-green-600 font-semibold pt-1 text-nowrap",
                balance.lent_amount - balance.owed_amount < 0 && "text-red-600"
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
