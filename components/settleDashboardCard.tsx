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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { DashboardCardType } from "@/lib/definititions";
import { Button } from "./ui/button";

export const DashboardCard: React.FC<DashboardCardType> = async ({ name, debt }) => {
 

  // const name = await getName(user_id);
  // console.log('name: ', typeof name);

  return (
    <div className="p-1">
      <Card className="w-[350px]">
        <CardHeader style={{ paddingBottom: '8px', paddingTop: '8px' }}>
          <div className="flex justify-between">
            <CardTitle style={{ margin: '1px' }} >{name}</CardTitle>
            <div className="flex items-center">
              <CardDescription className="mr-5">$ {debt}</CardDescription>
              <div className="flex items-center">
                {/* <Switch id="settled-switch" />
                <Label htmlFor="settled-switch"></Label> */}
              </div>
              <Button>
                Settle
              </Button>
            </div>
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