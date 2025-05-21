import { useState } from 'react';

import { useFormContext, Controller } from 'react-hook-form';

import { useTrainingSetupData } from '../hooks';
import { DateSelect, UserSelect } from './exercises-table';
import { SubmitButton } from '@/components/buttons';

export const ProgramActivationBar = ({
  onSubmit,
  isAssignedMode,
  pageMode,
  dataMode,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  const [userSelected, setUserSelected] = useState(false);
  const { usersData } = useTrainingSetupData();

  const userOptions = usersData;

  const typeLabel =
    pageMode === 'create'
      ? isAssignedMode
        ? 'new program'
        : 'new template'
      : dataMode === 'assigned'
        ? 'program'
        : 'template';

  return (
    <div className='my-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
      <div className='flex flex-col gap-4 sm:flex-row'>
        {isAssignedMode ? (
          <>
            <div className='flex flex-col'>
              <div className='w-full'>
                <label className='text-m mb-1 block font-semibold text-gray-700'>
                  Assign user
                </label>
                <Controller
                  name='assignedUser'
                  control={control}
                  render={({ field }) => (
                    <UserSelect
                      field={field}
                      userOptions={userOptions}
                      setUserSelected={setUserSelected}
                    />
                  )}
                />
              </div>

              {errors.assignedUser && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.assignedUser.message}
                </p>
              )}
            </div>

            <div className='flex flex-col'>
              <div className='flex w-full flex-col justify-center md:block md:flex-row'>
                <label className='text-m mb-1 block font-semibold text-gray-700'>
                  Activation date
                </label>
                <Controller
                  name='activationDate'
                  control={control}
                  render={({ field }) => (
                    <DateSelect field={field} userSelected={userSelected} />
                  )}
                />
              </div>

              {errors.activationDate && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.activationDate.message}
                </p>
              )}
            </div>
          </>
        ) : null}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <SubmitButton className='w-full md:w-auto'>
          {pageMode === 'create' ? 'Create ' : 'Edit '}
          {typeLabel}
        </SubmitButton>
      </form>
    </div>
  );
};
