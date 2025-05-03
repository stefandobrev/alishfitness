export const TableHeadings = ({ tableHeadings = [] }) => {
  return (
    <thead>
      <tr className='bg-gray-200'>
        {tableHeadings.map((heading, i) => (
          <th key={i} className='border p-2 text-center'>
            {heading}
          </th>
        ))}
      </tr>
    </thead>
  );
};
