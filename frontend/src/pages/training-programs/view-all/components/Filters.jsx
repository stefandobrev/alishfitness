import { useState } from 'react';

import DatePicker from 'react-datepicker';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { SelectFilter } from '@/components/inputs';
import {
  ActionButton,
  ButtonVariant,
  SubmitButton,
} from '@/components/buttons';
import { useTrainingProgramFilterData } from '../hooks';
import { Spinner } from '@/components/common';

export const Filters = ({ filters, setFilters, isOpen, onClose }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const { modesData, usersData, statusesData, isLoading } =
    useTrainingProgramFilterData();

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
        className={`w-full p-4 md:fixed md:top-20 md:right-0 md:z-50 md:h-[calc(100vh-108px)] md:w-80 md:transform md:overflow-y-auto md:border md:border-gray-300 md:bg-white md:shadow-xl md:transition-transform md:duration-400 md:ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className='flex h-full flex-col'>
          {/* Header */}
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-gray-800'>Filters</h2>

            <XMarkIcon
              onClick={onClose}
              className='hover:text-logored h-5 w-5 cursor-pointer text-gray-400 transition-colors duration-200'
            />
          </div>

          {/* Drawer */}
          {isLoading ? (
            <Spinner />
          ) : (
            <div className='flex h-full flex-col space-y-6'>
              <SelectFilter
                label='Filter by mode'
                placeholder='Select mode'
                optionsData={modesData}
                onChange={(selectedOption) => {
                  const modeValue = selectedOption
                    ? selectedOption.value
                    : null;
                  setFilters((prev) => ({
                    ...prev,
                    filterMode: modeValue,
                  }));
                }}
              />

              <SelectFilter
                label='Filter by user'
                placeholder='Select user'
                optionsData={usersData}
              />

              <SelectFilter
                label='Filter by status'
                placeholder='Select status'
                optionsData={statusesData}
              />

              <div>
                <label className='mb-2 block font-semibold text-gray-700'>
                  Filter by activation date
                </label>
                <DatePicker
                  placeholderText='Select date range'
                  isClearable
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  dateFormat='yyyy-MM-dd'
                  className='w-full rounded-md border border-gray-300 p-2'
                  wrapperClassName='w-full'
                />
              </div>

              <div className='mt-auto flex md:gap-2 md:py-2'>
                <SubmitButton className='w-full'>Apply</SubmitButton>
                <ActionButton
                  variant={ButtonVariant.GRAY_DARK}
                  className='w-full'
                >
                  Reset
                </ActionButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
