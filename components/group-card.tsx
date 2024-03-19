import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { fetchGroupTotals, getUsersbyGroup, getNameGroup } from "@/lib/data";
import { Group, UserProps } from "@/lib/definititions";


const getUsers = (userByGroup: Group[]) => {
  const firstnames = userByGroup.map(user => user.firstname);
  // console.log(firstnames);
  return firstnames;
};

export const GroupCard: React.FC<UserProps> = async ({ userID, groupID }) => {
  const groupTotals: number | undefined = await fetchGroupTotals(userID, groupID);
  const userByGroup: Group[] = await getUsersbyGroup(groupID);
  const listOfUsers = getUsers(userByGroup);
  const groupName = await getNameGroup();

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{groupName?.name}</CardTitle>
          <CardDescription>$ {(groupTotals / 1000)}</CardDescription>
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