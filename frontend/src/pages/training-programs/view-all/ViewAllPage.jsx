import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Heading, TableContainer } from './components';
import { fetchTrainingProgramData } from './helpersViewAll';
import { MobileTabs } from '@/components/buttons';
import { useInfiniteScrollWindow, useTitle } from '@/hooks';
import { NoDataDiv, Spinner } from '@/components/common';
import { toUtcMidnightDateString } from '@/utils';
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
};
const defaultPagination = {
  offset: INITIAL_OFFSET,
  hasMore: true,
  loadMore: false,
};

export const ViewAllPage = () => {
  const [isLoading, setIsLoading] = useState(false);
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
        itemsPerPage: ITEMS_PER_PAGE,
        offset: currentOffset,
      });

      setTrainingProgramsData((prev) =>
        isMobile
          ? currentOffset === INITIAL_OFFSET
            ? data.training_programs
            : [...(prev || []), ...data.training_programs]
          : data.training_programs,
      );

      const total =
        data.total_count ?? currentOffset + data.training_programs.length;
      setTotalPrograms(total);
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));

      setPagination({
        offset: currentOffset + ITEMS_PER_PAGE,
        loadMore: false,
        hasMore: data.training_programs.length >= ITEMS_PER_PAGE,
      });
    } finally {
      setIsLoading(false);
    }

    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition);
    });
  };

  const handleReset = () => {
    setFilters(defaultViewAllFilters);
    setPagination(defaultPagination);
  };

  const navigateToEdit = (programId) => {
    navigate(`/training-programs/edit/${programId}`);
  };

  const tableColumns = [
    { title: 'Title', width: 'min-w-[200px]' },
    { title: 'Mode', width: 'w-[60px]' },
    { title: 'Assigned User', width: 'w-[400px]' },
    { title: 'Status', width: 'w-[60px]' },
    { title: 'Activation Date', width: 'w-[150px]' },
    { title: 'Action', width: 'w-[50px]' },
  ];

  const tableRows = formatRows(trainingProgramsData);

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
          tableColumns={tableColumns}
          tableRows={tableRows}
          navigateToEdit={navigateToEdit}
          totalPrograms={totalPrograms}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}

      {!isLoading && trainingProgramsData.length === 0 && (
        <NoDataDiv
          heading='No training programs found'
          content='Try adjusting your filters or create a new program'
        />
      )}
    </>
  );
};
