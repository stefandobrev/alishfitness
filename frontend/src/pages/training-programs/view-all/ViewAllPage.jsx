import { useState, useEffect, useRef } from 'react';

import { Heading, SearchAndFilterTrigger } from './components';
import { fetchTrainingProgramData } from './helpersViewAll';
import { MobileTabs, MobileTabVariant } from '@/components/buttons';
import { useTitle } from '@/hooks';
import { Spinner } from '@/components/common';
import { toUtcMidnightDateString } from '@/utils';

const INITIAL_OFFSET = 0;
const ITEMS_PER_PAGE = 10;
const defaultFilters = {
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
  useTitle('All Programs');
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrograms, setTotalPrograms] = useState(0);
  const [trainingProgramsData, setTrainingProgramsData] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [pagination, setPagination] = useState(defaultPagination);

  useEffect(() => {
    loadTrainingProgramsData();
  }, [filters]);

  const loadTrainingProgramsData = async (offset) => {
    const currentOffset = offset ?? INITIAL_OFFSET;
    setIsLoading(true);

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
      setTotalPrograms(data.total_count);
      setTrainingProgramsData(data.training_programs);
    } finally {
      setIsLoading(false);
    }
  };

  const tableHeadings = [
    'Title',
    'Mode',
    'Assigned User',
    'Status',
    'Activation Date',
    '',
    '',
  ];

  return (
    <>
      <Heading
        totalPrograms={totalPrograms}
        trainingProgramsData={trainingProgramsData}
      />
      <SearchAndFilterTrigger filters={filters} setFilters={setFilters} />

      {isLoading ? (
        <Spinner loading={isLoading} className='min-h-[60vh]' />
      ) : (
        <div className='flex flex-col lg:flex-row'></div>
      )}
    </>
  );
};
