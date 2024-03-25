
// import { increment, decrement } from "@/lib/transActions/utils";

import { GroupMembers } from "@/lib/definititions"

export function TransEdit(
  {
    membersOfTrans
  }: {
    membersOfTrans: any
  }
) {
  // const [tableData, setTableData] = useState([])

  return (
    <>
      {membersOfTrans.map((ele, index) => {
        return (
          <div key={index}>

            <p>{ele.firstname}</p>
            <p>{ele.user_amount}</p>

          </div>

        )
      })}
    </>
  )
}