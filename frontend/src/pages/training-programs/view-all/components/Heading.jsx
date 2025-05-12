import { useState } from 'react';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

import { SearchInput } from '@/components/inputs';
import { ActionButton, ButtonVariant } from '@/components/buttons';
import { Filters } from '.';

export const Heading = ({
  activeTab,
  filters,
  setFilters,
  totalPrograms,
  trainingProgramsData,
  onReset,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const programsCounter =
    totalPrograms !== undefined ? totalPrograms : trainingProgramsData?.length;
  const isPlural = programsCounter !== 1;
  const programsDescription = `${programsCounter} program${isPlural ? 's' : ''} available`;

  return (
    <div className='flex flex-col'>
      {/* Title */}
      <h1 className='flex justify-center p-4 text-2xl font-bold md:text-3xl'>
        All Programs
      </h1>
      <div className='flex w-full flex-col-reverse items-center gap-y-4 lg:flex-row'>
        {/* Search */}
        <div className='mx-2 flex flex-row gap-2 lg:absolute lg:left-2'>
          <SearchInput
            placeholder='Search program title'
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                searchQuery: value,
              }))
            }
            value={filters.searchQuery}
            className={`w-80 max-w-md lg:w-70 ${activeTab !== 'filters' ? 'hidden lg:block' : ''}`}
          />

          {/* Reset Button */}
          <div className='hidden lg:flex lg:w-90'>
            <ActionButton
              onClick={toggleFilters}
              variant={ButtonVariant.GRAY_DARK}
              className='flex items-center gap-2'
            >
              <AdjustmentsHorizontalIcon className='h-5 w-5' />
              Filters
            </ActionButton>
          </div>
        </div>

        {/* Programs Count  */}
        <p className='w-full text-center text-gray-600 lg:mx-auto dark:text-gray-300'>
          {trainingProgramsData && programsDescription}
        </p>
      </div>

      {/* Filter Drawer */}
      <div
        className={`m-2 ${activeTab !== 'filters' ? 'hidden lg:block' : ''} flex flex-col items-center gap-4 p-2 lg:flex-row lg:items-start`}
      >
        <div className='w-90'>
          <Filters
            filters={filters}
            setFilters={setFilters}
            onReset={onReset}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};
