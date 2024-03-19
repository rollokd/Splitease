import * as React from "react"
 
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function GroupCard() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Group Name</CardTitle>
          <CardDescription>$ Money</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        List of Group Members 
      </CardContent>
      <CardFooter className="flex justify-between">
        nothing at the moment
      </CardFooter>
    </Card>
  )
}