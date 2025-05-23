import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { PlusIcon } from '@heroicons/react/24/outline';
import { ActionButton } from '@/components/buttons';

export const AddSessionButton = () => {
  const [counter, setCounter] = useState(1);
  const { getValues, setValue, clearErrors } = useFormContext();

  const handleAddSession = () => {
    const currentSessions = getValues('sessions') || [];
    const newId = `${counter}`;

    setValue('sessions', [
      ...currentSessions,
      { tempId: newId, sessionTitle: '', exercises: [] },
    ]);

    setCounter(counter + 1);
    clearErrors('sessions');
  };

  return (
    <ActionButton
      variant='blank'
      onClick={handleAddSession}
      className='flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-2 transition-colors hover:border-gray-400'
    >
      <div className='flex flex-col items-center justify-center'>
        <PlusIcon className='h-8 w-8 text-gray-400' />
        <span className='text-sm font-medium text-gray-500'>Add session</span>
      </div>
    </ActionButton>
  );
};
