"use client"
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
import { settleUpSplits } from "@/lib/databaseFunctions/settleUpSplits";

export const DashboardCard: React.FC<DashboardCardType> = async ({ name, debt, other_id, user_id }) => {

  const handleSettleClick = () => {
    settleUpSplits(user_id, other_id)
      .then(() => {
      })
      .catch((error) => {
        console.error("Failed to settle splits on client side:", error);
      });
  };

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
              <Button onClick={handleSettleClick} >
                Settle
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};