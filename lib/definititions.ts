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

export type UserTransaction = Transaction & User