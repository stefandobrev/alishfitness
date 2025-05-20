import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

import { Heading, TableContainer } from './components';
import { fetchTrainingProgramData, deleteProgram } from './helpersViewAll';
import { MobileTabs } from '@/components/buttons';
import { useInfiniteScrollWindow, useTitle } from '@/hooks';
import { ConfirmationModal, NoDataDiv, Spinner } from '@/components/common';
import { snakeToCamel, toUtcMidnightDateString } from '@/utils';
import { formatRows } from './utils';
import { isMobile } from '@/common/constants';

const INITIAL_OFFSET = 0;
const ITEMS_PER_PAGE = 10;
export const defaultViewAllFilters = {
  searchQuery: '',
  filterMode: null,
  filterUser: null,
  filterStatus: null,
  filterStartDate: null,
  filterEndDate: null,
  sortConfig: [],
};
const defaultPagination = {
  offset: INITIAL_OFFSET,
  hasMore: true,
  loadMore: false,
};

export const ViewAllPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('programs');
  const [filters, setFilters] = useState(defaultViewAllFilters);
  const [pagination, setPagination] = useState(defaultPagination);
  const [trainingProgramsData, setTrainingProgramsData] = useState([]);
  const [totalPrograms, setTotalPrograms] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useTitle('All Programs');
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1);
    setPagination(defaultPagination);
    loadTrainingProgramsData();
  }, [filters]);

  useEffect(() => {
    if (pagination.loadMore) {
      loadTrainingProgramsData(pagination.offset);
    }
  }, [pagination.loadMore, pagination.offset]);

  // Infinite scroll for window hook
  useInfiniteScrollWindow({ pagination, setPagination });

  const loadTrainingProgramsData = async (offset) => {
    const currentOffset = offset ?? INITIAL_OFFSET;
    setIsLoading(true);

    const scrollPosition = window.scrollY;

    try {
      const data = await fetchTrainingProgramData({
        searchQuery: filters.searchQuery,
        filterMode: filters.filterMode,
        filterUser: filters.filterUser,
        filterStatus: filters.filterStatus,
        filterStartDate: toUtcMidnightDateString(filters.filterStartDate),
        filterEndDate: toUtcMidnightDateString(filters.filterEndDate),
        sortConfig: filters.sortConfig,
        itemsPerPage: ITEMS_PER_PAGE,
        offset: currentOffset,
      });

      const transformedData = snakeToCamel(data);

      setTrainingProgramsData((prev) =>
        isMobile
          ? currentOffset === INITIAL_OFFSET
            ? transformedData.trainingPrograms
            : [...(prev || []), ...transformedData.trainingPrograms]
          : transformedData.trainingPrograms,
      );

      const total =
        transformedData.totalCount ??
        currentOffset + transformedData.trainingPrograms.length;
      setTotalPrograms(total);
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));

      setPagination({
        offset: currentOffset + ITEMS_PER_PAGE,
        loadMore: false,
        hasMore: transformedData.trainingPrograms.length >= ITEMS_PER_PAGE,
      });
    } finally {
      setIsLoading(false);
    }

    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition);
    });
  };

  const handleReset = () => {
    setFilters({ ...defaultViewAllFilters });
    setPagination({ ...defaultPagination });
  };

  const navigateToEdit = (programId) => {
    navigate(`/training-programs/edit/${programId}`);
  };

  const handleDelete = (programId, programTitle) => {
    setProgramToDelete({ id: programId, title: programTitle });
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const response = await deleteProgram(programToDelete.id);
    const { type, text } = response;

    if (type === 'error') {
      toast.error(text);
      return;
    }

    if (type === 'success') {
      toast.success(text);
      handleReset();
    }

    setIsDeleteDialogOpen(false);
  };

  const tableRows = formatRows(trainingProgramsData, handleDelete);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    const newOffset = (newPage - 1) * ITEMS_PER_PAGE;
    setCurrentPage(newPage);
    setPagination((prev) => ({
      ...prev,
      offset: newOffset,
      loadMore: false,
    }));

    loadTrainingProgramsData(newOffset);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const tabs = [
    { label: 'Programs', value: 'programs' },
    { label: 'Filters', value: 'filters' },
  ];
  return (
    <>
      <MobileTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabs}
      />

      <Heading
        activeTab={activeTab}
        filters={filters}
        totalPrograms={totalPrograms}
        trainingProgramsData={trainingProgramsData}
        setFilters={setFilters}
        onReset={handleReset}
      />

      {isLoading && !trainingProgramsData.length ? (
        <Spinner className='min-h-[60vh]' />
      ) : (
        <TableContainer
          activeTab={activeTab}
          tableRows={tableRows}
          navigateToEdit={navigateToEdit}
          totalPrograms={totalPrograms}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={ITEMS_PER_PAGE}
          sortConfig={filters.sortConfig}
          onSortChange={(newSortConfig) =>
            setFilters((prev) => ({ ...prev, sortConfig: newSortConfig }))
          }
        />
      )}

      {!isLoading && trainingProgramsData.length === 0 && (
        <NoDataDiv
          heading='No training programs found'
          content='Try adjusting your filters or create a new program'
        />
      )}

      {isDeleteDialogOpen && (
        <ConfirmationModal
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          heading={`Delete program: ${programToDelete.title}`}
          message='Are you sure you want to delete the program?'
          confirmText='Delete'
        />
      )}
    </>
  );
};
