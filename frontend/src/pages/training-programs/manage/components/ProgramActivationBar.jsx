import { useFormContext, Controller, useWatch } from 'react-hook-form';

import { useTrainingSetupData } from '../hooks';
import { DateSelect, UserSelect } from './exercises-table';
import { SubmitButton } from '@/components/buttons';

export const ProgramActivationBar = ({
  onSubmit,
  programUsageMode,
  programMode,
  hasChanges,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  const assignedUser = useWatch({ name: 'assignedUser' });
  const { usersData } = useTrainingSetupData();

  const userOptions = usersData;

  const typeLabel =
    programMode === 'create'
      ? programUsageMode === 'assigned'
        ? 'new program'
        : 'new template'
      : programUsageMode === 'assigned'
        ? 'program'
        : 'template';

  return (
    <div className='m-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
      <div className='flex flex-col gap-4 sm:flex-row'>
        {programUsageMode === 'assigned' ? (
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
                    <UserSelect field={field} userOptions={userOptions} />
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
                    <DateSelect field={field} userSelected={!!assignedUser} />
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
        <SubmitButton
          disabled={programMode === 'edit' && !hasChanges}
          className='w-full md:w-auto'
        >
          {programMode === 'create' ? 'Create ' : 'Edit '}
          {typeLabel}
        </SubmitButton>
      </form>
    </div>
  );
};
