import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { fetchGroupTotals, getUsersbyGroup } from "@/lib/data";
import { Group } from "@/lib/definititions";

interface GroupCardProps {
  groupID: string;
}

const getUsers = (userByGroup: Group[]) => {
  const firstnames = userByGroup.map(user => user.firstname);
  console.log(firstnames);
  return firstnames;
};

export const GroupCard: React.FC<GroupCardProps> = async ({ groupID }) => {
  const groupTotals: number | undefined = await fetchGroupTotals();
  const userByGroup = await getUsersbyGroup(groupID);
  const listOfUsers = getUsers(userByGroup);
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Group Name</CardTitle>
          <CardDescription>$ {groupTotals}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        { listOfUsers.length <= 4 ? listOfUsers.join(', ') : `${listOfUsers.slice(0, 4).join(', ')}...` }
      </CardContent>
      <CardFooter className="flex justify-between">
        nothing at the moment
      </CardFooter>
    </Card>
  )
}