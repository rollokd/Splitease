export type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export type Group = {
  id: string;
  name: string;
  date: string;
  status: boolean;
};

export type UserGroups = {
  user_id: string;
  group_id: string;
};
