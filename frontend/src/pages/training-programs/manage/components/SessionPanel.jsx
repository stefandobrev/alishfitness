import { useFormContext } from 'react-hook-form';

import { SessionsGrid, AddSessionButton } from '.';
import { useTrainingSetupData } from '../hooks';
import { Spinner } from '@/components/common';

export const SessionPanel = ({ sessions, onRemoveSession }) => {
  const {
    formState: { errors },
  } = useFormContext();

  const { isLoading } = useTrainingSetupData();
  return (
    <div className='flex flex-col px-4'>
      <div className='mt-4'>
        {isLoading ? (
          <Spinner isLoading={isLoading} />
        ) : sessions && sessions.length > 0 ? (
          <div className='mb-4'>
            <SessionsGrid
              sessions={sessions}
              onRemoveSession={onRemoveSession}
            />
          </div>
        ) : null}
      </div>

      {errors.sessions?.message && (
        <p className='my-2 text-sm text-red-500'>{errors.sessions.message}</p>
      )}
      <AddSessionButton />
    </div>
  );
};
