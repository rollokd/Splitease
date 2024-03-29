import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { GroupCardType } from '@/lib/definititions';
import { moneyFormat } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const GroupCard: React.FC<GroupCardType> = async ({
  groupName,
  groupTotals,
  listOfUsers,
}) => {

  return (
    <Card className="mb-2">
      <CardHeader style={{ paddingBottom: '8px', paddingTop: '8px' }}>
        <div className="flex justify-between">
          <CardTitle className="text-xl font-medium tracking-wide" style={{ margin: '1px' }}>{groupName}</CardTitle>
          <CardDescription className={cn(
              "min-w-20 text-right font-semibold text-green-500",
              Number(groupTotals) < 0 && "text-red-500"
            )} style={{ margin: '1px' }}>
            $ {moneyFormat(groupTotals)}{' '}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent style={{ paddingBottom: '8px' }}>
        {listOfUsers.length <= 5
          ? listOfUsers.join(', ')
          : `${listOfUsers.slice(0, 5).join(', ')}...`}
      </CardContent>
    </Card>
  );
};
