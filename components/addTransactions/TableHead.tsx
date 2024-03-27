
export function TableHead() {
  return (
    <thead
      className="[&_tr]:border-b"
    >
      <tr>
        <th
          scope="col"
          className="p-4 align-middle"
        >
          Name
        </th>
        <th
          scope="col"
          className="p-4 align-middle"
        >
          Status
        </th>

        <th
          scope="col"
          className="p-4 align-middle"
        >Amount</th>

      </tr>
    </thead>
  )
}