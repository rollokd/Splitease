export type Group = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  user_id: string;
  group_id: string;
};

export type User = {
  id: string
  firstname: string
  lastname: string
  email: string
  password: string
}
export type Junction = {
  user_id: string
  group_id: string
}
export type UserWJunction = User & Junction

export type Field = {
  columnID: number;
  dataTypeID: number;
  dataTypeModifier: number;
  dataTypeSize: number;
  format: string;
  name: string;
  tableID: number;
};

export type UserPaid = {
  command: string;
  fields: Field[];
  rowAsArray: boolean;
  rowCount: number;
  rows: Array<{ total_amount: string }>;
  viaNeonFetch: boolean;
};

export type SplitToPay = {
  command: string;
  fields: Field[];
  rowAsArray: false;
  rowCount: number;
  rows: Array<{ total_user_amount: string }>;
  viaNeonFetch: boolean;
};

export interface UserProps {
  userID: string;
  groupID: string;
}