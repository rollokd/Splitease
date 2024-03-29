"use client"
import * as React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardCardType } from "@/lib/definititions";
import { Button } from "./ui/button";
import { settleSplitsDashboard } from "@/lib/serverActions/settleSplitsDashboard";
import { cn } from "@/lib/utils";
import { toast } from 'react-hot-toast';

export const DashboardCard: React.FC<DashboardCardType> = async ({ name, debt, other_id, user_id }) => {

  const handleSettleClick = async () => {
    try {
      await settleSplitsDashboard(user_id, other_id);
      toast.success('Settlement successfully processed', {
        duration: 2000,
      });
    } catch(error) {
      console.error("Failed to settle splits on client side:", error);
      toast.error('Error Settling', {
        duration: 2000,
      });
    };
  };

  const handleClick = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    handleSettleClick();
  };

  return (
    <div className="p-1">
      <Card className="w-[350px]">
        <CardHeader style={{ paddingBottom: '8px', paddingTop: '8px' }}>
          <div className="flex justify-between">
            <CardTitle style={{ margin: '1px' }} >{name}</CardTitle>
            <div className="flex items-center">
              <CardDescription className={cn(
              "mr-5",
              "font-semibold text-green-600",
              Number(debt) < 0 && "text-red-600",
            )} >$ {debt}</CardDescription>
              <div className="flex items-center">
              </div>
              <Button className="w-{18}"
                onClick={(event) => handleClick(event)} >
                {Number(debt) > 0 ? "Receive" : "Pay Now"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};