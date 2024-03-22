import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getName } from "@/lib/data";
import { UserWJunction, Junction } from "@/lib/definititions";
const getUsers = (userByGroup: UserWJunction[]) => {
  const firstnames = userByGroup.map((user) => user.firstname);
  // console.log(firstnames);
  return firstnames;
};
type DashboardCard = {
  user_id: string,
  debt: number,
}
export const DashboardCard: React.FC<DashboardCard> = async ({ user_id, debt }) => {

  const name = await getName(user_id);
  
  return (
    <div className="p-1">
      <Card className="w-[350px]">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>{name}</CardTitle>
            <CardDescription>$ {debt}</CardDescription>
          </div>
        </CardHeader>
        {/* <CardContent>
          {listOfUsers.length <= 4
            ? listOfUsers.join(", ")
            : `${listOfUsers.slice(0, 4).join(", ")}...`}
        </CardContent> */}
        {/* <CardFooter className="flex justify-between">
          nothing at the moment
        </CardFooter> */}
      </Card>
    </div>
  );
};