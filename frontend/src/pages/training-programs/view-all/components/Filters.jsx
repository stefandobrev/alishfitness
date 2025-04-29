import { XMarkIcon } from '@heroicons/react/24/outline';

import { SearchInput } from '@/components/inputs';
import { ActionButton, ButtonVariant } from '@/components/buttons';

export const Filters = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay for closing on outside click */}
      <div
        className='bg-opacity-30 fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-300'
        onClick={onClose}
      />

      {/* Drawer */}
      <div className='fixed top-20 right-0 z-60 h-[calc(100vh-108px)] w-full transform overflow-y-auto rounded-l-lg border-t border-b border-gray-200 bg-white p-4 shadow-xl md:w-80'>
        <div className='flex flex-col'>
          {/* Header */}
          <div className='mb-6 flex items-center justify-between'>
            <h3 className='text-2xl font-bold'>Filters</h3>

            <XMarkIcon
              onClick={onClose}
              className='hover:text-logored h-5 w-5 cursor-pointer text-gray-400 transition-colors duration-200'
            />
          </div>

          {/* Filter content */}
          <div className='flex flex-col space-y-6'>
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

            <div className='mt-4 space-y-4'>
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
