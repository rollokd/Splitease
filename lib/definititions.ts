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
  group_id: string
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

export type UserTransaction = Transaction & User

