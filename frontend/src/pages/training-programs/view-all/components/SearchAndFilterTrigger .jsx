import { useState } from 'react';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

import { SearchInput } from '@/components/inputs';
import { Filters } from '.';
import { ActionButton, ButtonVariant } from '@/components/buttons';

export const SearchAndFilterTrigger = ({ filters, setFilters }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  return (
    <div className='m-2 flex items-start gap-4 p-2 md:flex-row'>
      <SearchInput
        placeholder='Search program title'
        onChange={(value) =>
          setFilters((prev) => ({
            ...prev,
            searchQuery: value,
          }))
        }
        value={filters.searchQuery}
        className='w-full md:w-80'
      />
      <div className='hidden md:block'>
        <ActionButton
          variant={ButtonVariant.GRAY_DARK}
          onClick={toggleFilters}
          className='flex items-center gap-2'
        >
          <AdjustmentsHorizontalIcon className='h-5 w-5' />
          Filters
        </ActionButton>
        <Filters
          filters={filters}
          setFilters={setFilters}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />
      </div>
    </div>
  );
};
