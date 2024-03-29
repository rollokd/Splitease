"use client";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "./button";
import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "../../lib/actions";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Label } from "./label";
import { Input } from "./input";
import Link from "next/link";

export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  return (
    <>
      <form action={dispatch} className="w-[300px] space-y-3">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={4}
              />
            </div>

            <Button className="w-full">Login</Button>

            <div className="mt-1 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="sign" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  );
}
