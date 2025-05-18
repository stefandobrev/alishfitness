import { Pagination } from '@/components/common';
import { Table } from '@/components/table';

export const TableContainer = ({
  activeTab,
  tableRows,
  navigateToEdit,
  totalPrograms,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  sortConfig,
  onSortChange,
}) => {
  const onSort = (columnId) => {
    const existingSort = sortConfig.find((config) => config.key === columnId);

    let newSortConfig;
    if (existingSort) {
      // Cycle sorting states: asc -> desc -> no sorting (remove it)
      if (existingSort.direction === 'asc') {
        // Places latest sorting in front of the sort array
        const newConfig = sortConfig.filter((c) => c.key !== columnId);
        newSortConfig = [{ key: columnId, direction: 'desc' }, ...newConfig];
      } else if (existingSort.direction === 'desc') {
        // Remove sorting
        newSortConfig = sortConfig.filter((c) => c.key !== columnId);
      }
    } else {
      // Add new sorting with 'asc' as the default. Works for multiple columns sort
      newSortConfig = [{ key: columnId, direction: 'asc' }, ...sortConfig];
    }

    onSortChange(newSortConfig);
  };

  const tableColumns = [
    { id: 'title', title: 'Title', width: 'min-w-[200px]', sortable: true },
    { id: 'mode', title: 'Mode', width: 'w-[60px]', sortable: true },
    {
      id: 'assignedUser',
      title: 'Assigned User',
      width: 'w-[400px]',
      sortable: true,
    },
    { id: 'status', title: 'Status', width: 'w-[60px]', sortable: true },
    {
      id: 'activationDate',
      title: 'Activation Date',
      width: 'w-[200px]',
      sortable: true,
    },
    { id: 'action', title: 'Action', width: 'w-[50px]' },
  ];

  return (
    <>
      <div className={`${activeTab !== 'programs' ? 'hidden lg:block' : ''}`}>
        <Table
          tableColumns={tableColumns}
          rows={tableRows}
          onRowClick={navigateToEdit}
          onSort={onSort}
          sortConfig={sortConfig}
        />
        {totalPrograms > itemsPerPage && (
          <div className='my-2 hidden lg:block'>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </>
  );
};
