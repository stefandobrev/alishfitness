import { useState } from 'react';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

import { SearchInput } from '@/components/inputs';
import { Filters } from '.';
import { ActionButton, ButtonVariant } from '@/components/buttons';

export const SearchAndFilterTrigger = ({
  activeTab,
  filters,
  setFilters,
  onReset,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className='m-2 flex flex-col items-center gap-4 p-2 lg:flex-row lg:items-start'>
      <SearchInput
        placeholder='Search program title'
        onChange={(value) =>
          setFilters((prev) => ({
            ...prev,
            searchQuery: value,
          }))
        }
        value={filters.searchQuery}
        className={`w-80 ${activeTab !== 'filters' ? 'hidden lg:block' : ''}`}
      />
      <div className='w-90'>
        <ActionButton
          variant={ButtonVariant.GRAY_DARK}
          onClick={toggleFilters}
          className='hidden items-center gap-2 lg:flex'
        >
          <AdjustmentsHorizontalIcon className='h-5 w-5' />
          Filters
        </ActionButton>
        <div className={`${activeTab !== 'filters' ? 'hidden lg:block' : ''}`}>
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
