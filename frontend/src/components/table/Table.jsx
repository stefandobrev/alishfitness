import { TableColumns } from '.';

export const Table = ({ tableColumns, rows, onRowClick }) => {
  return (
    <div className='mx-4 overflow-auto border border-gray-200'>
      <table className='w-full border-separate border'>
        <TableColumns tableColumns={tableColumns} />
        <tbody>
          {rows.map((row, index) => {
            return (
              <tr
                key={row.id}
                onClick={() => onRowClick(row.id)}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-200'
                } cursor-pointer border-b border-gray-200 transition-colors hover:bg-gray-300`}
              >
                {row.cells.map((cell) => (
                  <td key={cell.id} className='p-2 text-sm'>
                    {cell.text}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
