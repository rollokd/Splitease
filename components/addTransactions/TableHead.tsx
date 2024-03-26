
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
          name
        </th>
        <th
          scope="col"
          className="p-4 align-middle"
        >
          status
        </th>

        <th
          scope="col"
          className="p-4 align-middle"
        >amount</th>

      </tr>
    </thead>
  )
}