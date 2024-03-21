import React from "react";
import CreateGroupForm from "../../../components/groups/create-form";
import { fetchUsers } from "@/lib/data";

const page = async () => {
  const users = await fetchUsers();
  return <CreateGroupForm users={users} />;
};

export default page;
