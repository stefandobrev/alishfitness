import { SearchInput } from '@/components/inputs';
import { ActionButton, ButtonVariant } from '@/components/buttons';

export const SearchAndFilters = () => {
  return (
    <div className='m-2 flex flex-col items-start gap-2 p-2 md:flex-row'>
      <div>
        <label className='mb-2 block font-semibold text-gray-700'>
          Search by program title
        </label>
        <SearchInput
          placeholder='Search program title'
          className='w-80 max-w-md lg:w-70'
        />
      </div>
      <div>
        <label className='mb-2 block font-semibold text-gray-700'>
          Filter by mode
        </label>
        <SearchInput placeholder='Search program title' />
      </div>
      <div>
        <label className='mb-2 block font-semibold text-gray-700'>
          Filter by assigned user
        </label>
        <SearchInput placeholder='Search program title' />
      </div>
      <div>
        <label className='mb-2 block font-semibold text-gray-700'>
          Filter by activation date
        </label>
        <SearchInput placeholder='Search program title' />
      </div>
      <div className='self-end lg:ml-4'>
        <ActionButton variant={ButtonVariant.GRAY_DARK}>Reset</ActionButton>
      </div>
    </div>
  );
};
