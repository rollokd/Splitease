import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { fetchUserBalance, getUsersbyGroup, getNameGroup } from "@/lib/data";
import { GroupCardType } from "@/lib/definititions";
import { moneyFormat } from "@/lib/utils";
import { fetchUserBalancesForGroup } from "@/lib/databaseFunctions/fetchUserBalancesForGroup";

export const GroupCard: React.FC<GroupCardType> = async ({
  groupName,
  groupTotals,
  listOfUsers,
}) => {
  //const groupName = await getNameGroup(user_id, group_id);

  function deleteGroup() {
    console.log("delete group");
  }

  return (
    <Card className="mb-2">
      <CardHeader style={{ paddingBottom: "8px", paddingTop: "8px" }}>
        <div className="flex justify-between">
          <CardTitle style={{ margin: "1px" }}>{groupName}</CardTitle>
          <CardDescription style={{ margin: "1px" }}>
            $ {moneyFormat(groupTotals)}{" "}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent style={{ paddingBottom: "8px" }}>
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
