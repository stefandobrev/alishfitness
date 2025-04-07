import { useState } from 'react';

import { useFormContext, Controller } from 'react-hook-form';

import { useTrainingSetupData } from './exercises-table';
import { DateSelect, UserSelect } from './exercises-table';
import { SubmitButton } from '@/components/buttons';

export const ProgramActivationBar = ({ onSubmit, newProgramMode }) => {
  const { control, handleSubmit } = useFormContext();
  const [userSelected, setUserSelected] = useState(false);
  const { usersData } = useTrainingSetupData();

  const userOptions = usersData;

  return (
    <div className='my-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
      <div className='flex flex-col gap-4 sm:flex-row'>
        {newProgramMode ? (
          <>
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
          </>
        ) : null}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <SubmitButton className='w-full md:w-auto'>
          {newProgramMode ? 'Create new program' : 'Create new template'}
        </SubmitButton>
      </form>
    </div>
  );
};
