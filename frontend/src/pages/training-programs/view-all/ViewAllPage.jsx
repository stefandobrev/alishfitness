import { useState, useEffect, useRef } from 'react';

import { Heading, SearchAndFilterTrigger } from './components';
import { fetchTrainingProgramData } from './helpersViewAll';
import { MobileTabs, MobileTabVariant } from '@/components/buttons';
import { useTitle } from '@/hooks/useTitle.hook';
import { Spinner } from '@/components/common';

const INITIAL_OFFSET = 0;
const ITEMS_PER_PAGE = 10;
const defaultFilters = {
  searchQuery: '',
  filterMode: null,
  filterUser: null,
  filterDate: null,
  offset: INITIAL_OFFSET,
  hasMore: true,
  loadMore: false,
};

export const ViewAllPage = () => {
  useTitle('All Programs');
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrograms, setTotalPrograms] = useState(0);
  const [trainingProgramsData, setTrainingProgramsData] = useState(null);

  const [
    {
      searchQuery,
      filterMode,
      filterUser,
      filterDate,
      offset,
      hasMore,
      loadMore,
    },
    setTrainingProgramProps,
  ] = useState(defaultFilters);

  useEffect(() => {
    loadTrainingProgramsData();
  }, []);

  const loadTrainingProgramsData = async (offset) => {
    const currentOffset = offset ?? INITIAL_OFFSET;
    setIsLoading(true);

    try {
      const data = await fetchTrainingProgramData({
        searchQuery: searchQuery,
        filterMode: filterMode,
        filterUser: filterUser,
        filterDate: filterDate,
        itemsPerPage: ITEMS_PER_PAGE,
        offset: currentOffset,
      });
      setTotalPrograms(data.total_count);
      setTrainingProgramsData(data.training_programs);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Heading
        totalPrograms={totalPrograms}
        trainingProgramsData={trainingProgramsData}
      />
      <SearchAndFilterTrigger />

      {isLoading ? (
        <Spinner loading={isLoading} className='min-h-[60vh]' />
      ) : (
        <div className='flex flex-col lg:flex-row'></div>
      )}
    </>
  );
};
