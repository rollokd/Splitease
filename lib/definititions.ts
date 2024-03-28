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
//Table type ===> 
export type TabledGroup = {
  id: string
  name: string
  status: boolean
  paid: boolean
}
// transactions ===>
export type GroupUsersBasic = {
  id: string
  firstname: string
}
export type GroupMembers = {
  id: string
  firstname: string
  group_id?: string
  status?: boolean
  user_amount?: number
}
export type EditTransGroupMembers = {
  id: string
  firstname: string
  group_id: string
  user_amount: number
  total_amount: number
  transaction_name: string
  date: Date
  amount: number
  status: boolean
}
export type forNow = {
  amount: number

}
export type SplitTable = {
  amount: number
  user_amount: number
  paid: boolean
  user_id: string
  trans_id: string
  group_id: string
}
export type UserValues = {
  user_id: string
  user_amount: number
  paid: boolean
}
export type TransInsert = {
  trans_id: string
  amount: number
  group_id: string
}
export type TableDataType = GroupMembers & forNow;
export type TableDataTypeExtended = EditTransGroupMembers & {
  manuallyAdjusted: boolean;
  status: boolean;
};
export type RouteParams = {
  id: string
}
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

export type UserTransaction = Transaction & User & { trans_id: string, amount_lent: number, amount_owed: number }

export type GroupBalancesByUser = {
  user_id: string,
  firstname: string,
  lastname: string,
  owed_amount: number,
  lent_amount: number
}

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
  total: number,
  listOfUsers: string[],
  group_id: string,
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
export interface PieChartProps {
  data: DataItem[];
}

export type Name = {
  firstname: string
}

export type Debts = {
  paid_by: string,
  user_id: string,
  sum: number
}

export type DashboardCardType = {
  name: string,
  debt: string,
  other_id: string,
  user_id: string,
}

export type GroupCardType = {
  groupName: string,
  groupTotals: number,
  listOfUsers: string[]
}

export type UserBalancesForGroupType = {
  userID: string,
  groupID: string
}