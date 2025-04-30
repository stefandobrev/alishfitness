import { useState, useEffect, useRef } from 'react';

import { toast } from 'react-toastify';

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
    const loadTrainingProgramsData = async () => {
      setIsLoading(true);

      try {
        const trainingProgramsData = await fetchTrainingProgramData();
      } finally {
        setIsLoading(false);
      }
    };

    loadTrainingProgramsData();
  });

  return (
    <>
      <Heading />
      <SearchAndFilterTrigger />

      {isLoading ? (
        <Spinner loading={isLoading} className='min-h-[60vh]' />
      ) : (
        <div className='flex flex-col lg:flex-row'></div>
      )}
    </>
  );
};
