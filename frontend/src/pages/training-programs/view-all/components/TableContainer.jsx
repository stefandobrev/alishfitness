import { Pagination } from '@/components/common';
import { Table } from '@/components/table';

export const TableContainer = ({
  activeTab,
  tableHeadings,
  tableRows,
  navigateToEdit,
  totalPrograms,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
}) => {
  return (
    <>
      <div className={`${activeTab !== 'programs' ? 'hidden lg:block' : ''}`}>
        <Table
          columns={tableHeadings}
          rows={tableRows}
          onRowClick={navigateToEdit}
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
