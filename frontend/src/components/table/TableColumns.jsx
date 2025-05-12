export const TableColumns = ({ tableColumns = [] }) => {
  return (
    <thead>
      <tr className='bg-gray-300 text-left'>
        {tableColumns.map((column, i) => (
          <th key={i} className={`border p-2 ${column.width || ''}`}>
            {column.title}
          </th>
        ))}
      </tr>
    </thead>
  );
};
