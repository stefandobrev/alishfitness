import { useFormContext } from 'react-hook-form';

import { PlusIcon } from '@heroicons/react/24/outline';
import { ActionButton } from '@/components/buttons';

export const AddSessionButton = () => {
  const { getValues, setValue, clearErrors } = useFormContext();

  // Adding new sessions while watching for loaded sessions on Edit
  const handleAddSession = () => {
    const currentSessions = getValues('sessions') || [];

    const existingTempIds = currentSessions
      .map((s) => parseInt(s.tempId, 10)) // Convert tempId strings to numbers. Parse the string as a base-10
      .filter((n) => !isNaN(n)); // Remove invalid/non-numeric tempIds

    const maxTempId = Math.max(0, ...existingTempIds); // Can't use Max on empty array, set defaultin 0
    const newId = `${maxTempId + 1}`;

    setValue('sessions', [
      ...currentSessions,
      { tempId: newId, sessionTitle: '', exercises: [] },
    ]);

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
