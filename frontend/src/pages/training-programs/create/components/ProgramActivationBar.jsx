import { useState } from 'react';

import { useFormContext, Controller } from 'react-hook-form';

import { DateSelect, UserSelect } from './exercises-table';
import { SubmitButton } from '../../../../components/buttons';

export const ProgramActivationBar = () => {
  const { control } = useFormContext();
  const [userSelected, setUserSelected] = useState(false);

  // Mock data for users - replace with your actual data source
  const userOptions = [
    { value: 'user1', label: 'John Doe' },
    { value: 'user2', label: 'Jane Smith' },
    { value: 'user3', label: 'Mike Johnson' },
  ];

  return (
    <div className='my-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
      <div className='flex flex-col gap-4 sm:flex-row'>
        <div className='w-full'>
          <label className='text-m mb-1 block font-semibold text-gray-700'>
            Assign User
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
            Activation Date
          </label>
          <Controller
            name='activationDate'
            control={control}
            render={({ field }) => (
              <DateSelect field={field} userSelected={userSelected} />
            )}
          />
        </div>
      </div>

      <div className='mt-6'>
        <SubmitButton className='w-full md:w-auto'>
          Create New Program
        </SubmitButton>
      </div>
    </div>
  );
};
