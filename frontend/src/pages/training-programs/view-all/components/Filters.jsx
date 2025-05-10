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
import { defaultViewAllFilters } from '../..';
import { isMobile } from '@/common/constants';

export const Filters = ({ filters, setFilters, onReset, isOpen, onClose }) => {
  const [draftFilters, setDraftFilters] = useState({ ...filters });

  const { modesData, usersData, statusesData, isLoading } =
    useTrainingProgramFilterData();

  const handleApply = () => {
    setFilters((prev) => ({
      ...prev,
      ...draftFilters,
    }));
    onClose();
  };

  const handleReset = () => {
    onReset();
    setDraftFilters(defaultViewAllFilters);
  };

  return (
    <>
      {/* Overlay for closing on outside click */}
      {!isMobile
        ? isOpen && (
            <div
              className='md:fixed md:inset-0 md:z-40 md:bg-black/50 md:backdrop-blur-xs md:transition-opacity md:duration-300'
              onClick={onClose}
            />
          )
        : ''}

      {/* Drawer */}
      <div
        className={`w-full p-4 md:fixed md:top-20 md:right-0 md:z-50 md:h-[calc(100vh-108px)] md:w-80 md:transform md:overflow-y-auto md:border md:border-gray-300 md:bg-white md:shadow-xl md:transition-transform md:duration-400 md:ease-in-out ${isOpen ? 'md:translate-x-0' : 'md:translate-x-full'} `}
      >
        <div className='flex h-full flex-col'>
          {/* Header */}
          {!isMobile ? (
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-gray-800'>Filters</h2>

              <XMarkIcon
                onClick={onClose}
                className='hover:text-logored h-5 w-5 cursor-pointer text-gray-400 transition-colors duration-200'
              />
            </div>
          ) : (
            ''
          )}

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
                  setDraftFilters((prev) => ({
                    ...prev,
                    filterMode: modeValue,
                  }));
                }}
                value={
                  draftFilters.filterMode
                    ? modesData.find(
                        (option) => option.value === draftFilters.filterMode,
                      )
                    : null
                }
              />

              <SelectFilter
                label='Filter by user'
                placeholder='Select user'
                optionsData={usersData}
                onChange={(selectedOption) => {
                  const userValue = selectedOption
                    ? selectedOption.value
                    : null;
                  setDraftFilters((prev) => ({
                    ...prev,
                    filterUser: userValue,
                  }));
                }}
                value={usersData.find(
                  (option) => option.value === draftFilters.filterUser,
                )}
              />

              <SelectFilter
                label='Filter by status'
                placeholder='Select status'
                optionsData={statusesData}
                onChange={(selectedOption) => {
                  const statusValue = selectedOption
                    ? selectedOption.value
                    : null;
                  setDraftFilters((prev) => ({
                    ...prev,
                    filterStatus: statusValue,
                  }));
                }}
                value={statusesData.find(
                  (option) => option.value === draftFilters.filterStatus,
                )}
              />

              <div>
                <label className='mb-2 block font-semibold text-gray-700'>
                  Filter by activation date
                </label>
                <DatePicker
                  placeholderText='Select date range'
                  isClearable
                  selectsRange
                  startDate={draftFilters.filterStartDate}
                  endDate={draftFilters.filterEndDate}
                  onChange={(update) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      filterStartDate: update[0],
                      filterEndDate: update[1],
                    }))
                  }
                  dateFormat='yyyy-MM-dd'
                  className='w-full rounded-md border border-gray-300 p-2'
                  wrapperClassName='w-full'
                />
              </div>

              <div className='mt-auto flex flex-col gap-2 py-2 md:flex-row'>
                <SubmitButton onClick={handleApply} className='w-full'>
                  Apply
                </SubmitButton>
                <ActionButton
                  onClick={handleReset}
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
