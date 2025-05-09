export const TableHeadings = ({ tableHeadings = [] }) => {
  return (
    <thead>
      <tr className='bg-gray-300 text-left'>
        {tableHeadings.map((heading, i) => (
          <th key={i} className='border p-2'>
            {heading}
          </th>
        ))}
      </tr>
    </thead>
  );
};
