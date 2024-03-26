import { TableDataType } from "../definititions";

interface TableDataTypeExtended extends TableDataType {
  manuallyAdjusted?: boolean;
  status?: boolean;
}
type AdjustMemberShareType = (index: number, adjustAmount: number) => void;
type Setter = (value: TableDataTypeExtended[] | ((prevState: TableDataTypeExtended[]) => TableDataTypeExtended[])) => void;

function increment(index: number, fn: AdjustMemberShareType, table: TableDataTypeExtended[]) {
  const incrementAmount = 0.5;
  if (table[index].amount + incrementAmount >= 0) {
    fn(index, incrementAmount);
  }
  else {
    console.log("Cannot increment beyond the total amount");
  }
}

function decrement(index: number, fn: AdjustMemberShareType, table: TableDataTypeExtended[]) {
  const decrementAmount = 0.5;

  if (table[index].amount - decrementAmount >= 0) {
    fn(index, -decrementAmount);
  } else {
    console.log("Cannot decrement below zero, bud");
  }
}

function handleStatusClick(index: number, table: TableDataTypeExtended[], setTable: Setter, amount: number) {
  const newData = [...table];
  newData[index].status = !newData[index].status;

  const participatingMembers = newData.filter(member => member.status);
  const newAmountPerMember = amount / participatingMembers.length;

  newData.forEach((member, idx) => {
    if (member.status) {
      newData[idx].amount = Number(newAmountPerMember.toFixed(2))
    } else {
      newData[idx].amount = 0
    }
  });
  setTable(newData);
}



export {
  increment,
  decrement,
  handleStatusClick
}