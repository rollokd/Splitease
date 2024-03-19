import { sql } from "@vercel/postgres";
import { GroupCard } from "@/components/ui/group-card";
import { GroupChart } from "@/components/ui/bar-chart";

export default async function  Home() {
  const userID: string = '9ec739f9-d23b-4410-8f1a-c29e0431e0a6';
  const groupID: string = '5909a47f-9577-4e96-ad8d-7af0d52c3267';

  return (
    <>
    <div>
      <GroupChart></GroupChart>
    </div>
    <div>
      <GroupCard groupID={groupID} userID={userID} />
    </div>
    </>
  );
}