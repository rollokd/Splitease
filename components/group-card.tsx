import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchUserBalance, getUsersbyGroup, getNameGroup } from "@/lib/data";
import { UserWJunction, Junction } from "@/lib/definititions";
import { moneyFormat } from "@/lib/utils";

const getUsers = (userByGroup: UserWJunction[]) => {
  const firstnames = userByGroup.map((user) => user.firstname);
  // console.log(firstnames);
  return firstnames;
};
export const GroupCard: React.FC<Junction> = async ({ user_id, group_id }) => {
  const groupTotals = await fetchUserBalance(user_id, group_id);
  const userByGroup = await getUsersbyGroup(group_id);
  const listOfUsers = getUsers(userByGroup || []);
  const groupName = await getNameGroup(user_id, group_id);

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{groupName?.name}</CardTitle>
          <CardDescription>$ {moneyFormat(groupTotals)}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {listOfUsers.length <= 4
          ? listOfUsers.join(", ")
          : `${listOfUsers.slice(0, 4).join(", ")}...`}
      </CardContent>
      {/* <CardFooter className="flex justify-between">
        nothing at the moment
      </CardFooter> */}
    </Card>
  );
};