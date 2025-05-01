import { XMarkIcon } from '@heroicons/react/24/outline';

import { SearchInput } from '@/components/inputs';
import { ActionButton, ButtonVariant } from '@/components/buttons';

export const Filters = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for closing on outside click */}
      {isOpen && (
        <div
          className='md:fixed md:inset-0 md:z-40 md:bg-black/50 md:backdrop-blur-xs md:transition-opacity md:duration-300'
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`w-full p-4 md:fixed md:top-20 md:right-0 md:z-60 md:h-[calc(100vh-108px)] md:w-70 md:transform md:overflow-y-auto md:border md:border-gray-300 md:bg-white md:shadow-xl md:transition-transform md:duration-400 md:ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className='flex h-full flex-col'>
          {/* Header */}
          <div className='mb-6 flex items-center justify-between'>
            <h3 className='text-2xl font-bold'>Filters</h3>

            <XMarkIcon
              onClick={onClose}
              className='hover:text-logored h-5 w-5 cursor-pointer text-gray-400 transition-colors duration-200'
            />
          </div>

          {/* Filter content */}
          <div className='flex h-full flex-col space-y-6'>
            <div>
              <label className='mb-2 block font-semibold text-gray-700'>
                Filter by mode
              </label>
              <SearchInput placeholder='Select mode' />
            </div>

            <div>
              <label className='mb-2 block font-semibold text-gray-700'>
                Filter by assigned user
              </label>
              <SearchInput placeholder='Select user' />
            </div>

            <div>
              <label className='mb-2 block font-semibold text-gray-700'>
                Filter by activation date
              </label>
              <SearchInput placeholder='Select date range' />
            </div>

            <div className='mt-auto flex md:gap-2 md:py-2'>
              <ActionButton variant={ButtonVariant.GRAY_Red} className='w-full'>
                Apply
              </ActionButton>
              <ActionButton
                variant={ButtonVariant.GRAY_DARK}
                className='w-full'
              >
                Reset
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
