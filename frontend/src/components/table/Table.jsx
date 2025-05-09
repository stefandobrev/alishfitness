import { TableHeadings } from '../common';

export const Table = ({ columns, rows, onRowClick }) => {
  console.log({ columns, rows });

  return (
    <div className='mx-4 overflow-hidden border border-gray-200'>
      <table className='w-full border-separate border'>
        <TableHeadings tableHeadings={columns} />
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
