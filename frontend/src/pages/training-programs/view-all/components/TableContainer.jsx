import { useState } from 'react';

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
}) => {
  const [sortConfig, setSortConfig] = useState([]);

  const onSort = (columnId) => {
    setSortConfig((prevConfig) => {
      const existingSort = prevConfig.find((config) => config.key === columnId);

      if (existingSort) {
        // Cycle sorting states: asc -> desc -> no sorting (remove it)
        if (existingSort.direction === 'asc') {
          return prevConfig.map((config) =>
            config.key === columnId ? { ...config, direction: 'desc' } : config,
          );
        } else if (existingSort.direction === 'desc') {
          // Remove sorting
          return prevConfig.filter((config) => config.key !== columnId);
        }
      } else {
        // Add new sorting with 'asc' as the default. Works for multiple columns sort
        return [...prevConfig, { key: columnId, direction: 'asc' }];
      }
      return prevConfig;
    });
  };

  console.log({ sortConfig });

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
