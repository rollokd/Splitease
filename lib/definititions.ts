export type Group = {
  id: string
  name: string
  date: Date
  status: boolean
}

export type Transaction = {
  id: string
  group_id: string
  name: string
  amount: number
  paid_by: string
  status: boolean
  date: Date
}

export type User = {
  id: string
  firstname: string
  lastname: string
  email: string
  password: string
}
// transactions ===>
export type GroupMembers = {
  id: string
  firstname: string
  group_id: string
}
export type forNow = {
  amount: number
}
export type SplitTable = {
  user_amount: number
  paid: boolean
  trans_id: string
}
export type TableDataType = GroupMembers & forNow;
export type Split = TableDataType & SplitTable;
//<=== transactions

export type Junction = {
  user_id: string
  group_id: string
}

export type UserWJunction = User & Junction

export interface UserProps {
  userID: string;
  groupID: string;
}

export type UserTransaction = Transaction & User & {trans_id: string}

export interface Own {
  paidbyMe: number;
  myPortionOfBills: number;
  total: number;
} 

export type GroupMember = {
  id: string;
  firstname: string;
  lastname: string;
  group_id: string;
  name: string;
};

export type DataBarChart = {
  name: string,
  total: number
}

type SqlField = {
  columnID: number;
  dataTypeID: number;
  dataTypeModifier: number;
  dataTypeSize: number;
  format: string;
  name: string;
  tableID: number;
};
type SqlResult<T> = {
  command: string;
  fields: SqlField[];
  rowAsArray: boolean;
  rowCount: number;
  rows: T[];
  viaNeonFetch: boolean;
};
type UserPaidRow = {
  total_amount: string | null;
};
type SplitToPayRow = {
  total_user_amount: string | null;
};

export type UserPaidResult = SqlResult<UserPaidRow>;
export type SplitToPayResult = SqlResult<SplitToPayRow>;

export interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}
export interface DataItem {
  name: string;
  value: number;
}
export interface GroupPieChartProps {
  data: DataItem[];
}

export type Name = {
  firstname: string
}