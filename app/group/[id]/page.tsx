import GroupBalances from "@/components/group-view/group-balances/group-balances";
import TransactionList from "@/components/group-view/transaction-list";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getGroupById, getUsersbyGroup } from "@/lib/data";

type Props = { params: { id: string } };

const Page = async ({ params }: Props) => {
  const group_id = params.id;
  const group = await getGroupById(group_id);
  // const users = await getUsersbyGroup(group_id);
  return (
    <div className="flex flex-col p-3 gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{group.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>Group name: {group?.name}</div>
      <GroupBalances group_id={group_id} />
      <TransactionList group_id={group_id} />
    </div>
  );
};

export default Page;
