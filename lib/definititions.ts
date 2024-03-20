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

export type Junction = {
  user_id: string
  group_id: string
}

export type UserWJunction = User & Junction

export interface UserProps {
  userID: string;
  groupID: string;
}

export type UserTransaction = Transaction & User

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
