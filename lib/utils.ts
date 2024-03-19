
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { User, UserTransaction, UserWJunction } from "./definititions"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractIds(users: User[] | UserWJunction[] | UserTransaction[]) {
  return users.map((user) => user.id)
}
