import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

export const TableColumns = ({
  tableColumns = [],
  onSort,
  sortConfig = [],
}) => {
  return (
    <thead>
      <tr className='bg-gray-300 text-left'>
        {tableColumns.map((column, i) => {
          onSort && {};
          const columnSort = sortConfig.find(
            (config) => config.key === column.id,
          );
          const isSortable = column.sortable;
          const isSorted = columnSort !== undefined;
          const direction = columnSort ? columnSort.direction : null;

          return (
            <th
              key={i}
              onClick={isSortable ? () => onSort(column.id) : undefined}
              className={`border p-2 ${column.width || ''} ${isSortable ? 'cursor-pointer hover:bg-gray-200' : ''}`}
            >
              <div className='group flex h-5 items-center'>
                {column.title}
                {isSortable && (
                  <>
                    {/*Checks if sorting is active and the direction.*/}
                    {isSorted ? (
                      direction === 'desc' ? (
                        <ArrowDownIcon className='ml-2 h-4' />
                      ) : (
                        <ArrowUpIcon className='ml-2 h-4' />
                      )
                    ) : (
                      <ArrowDownIcon className='ml-2 h-4 opacity-0 transition-opacity group-hover:opacity-100' />
                    )}
                  </>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
