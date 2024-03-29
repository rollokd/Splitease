import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { capitalizeFirstLetter } from "@/lib/utils";

import React from "react";

type Props = {
  name: string;
  group_id?: string;
  type?: "settle" | "edit" | "transaction" | null;
  edit?: boolean;
};

const GroupCrumbs = ({ name, group_id, type, edit }: Props) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-lg">
        <BreadcrumbItem>
          <BreadcrumbLink href="/home/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {type ? (
            <BreadcrumbLink href={`/home/group/${group_id}`}>
              {name}
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{name}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {type && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {type === "transaction"
                  ? edit
                    ? "Edit Transaction"
                    : "Add Transaction"
                  : `${capitalizeFirstLetter(type)} Group`}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default GroupCrumbs;
