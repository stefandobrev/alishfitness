import { useFormContext } from 'react-hook-form';

import {
  Heading,
  SessionsGrid,
  AddSessionButton,
  ProgramActivationBar,
} from './';
import { useTrainingSetupData } from '../hooks';
import { Spinner } from '@/components/common';

export const SessionsPanel = ({
  onSubmit,
  programMode,
  activeTab,
  sessions,
  onRemoveSession,
  programUsageMode,
  setProgramUsageMode,
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  const { isLoading } = useTrainingSetupData();
  return (
    <div
      className={`flex w-full flex-col lg:w-[70%] xl:w-[80%] ${activeTab !== 'sessions' ? 'hidden lg:block' : ''}`}
    >
      <div className='flex flex-col px-4'>
        <Heading
          programUsageMode={programUsageMode}
          setProgramUsageMode={setProgramUsageMode}
          programMode={programMode}
        />
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

        <ProgramActivationBar
          onSubmit={onSubmit}
          programUsageMode={programUsageMode}
          programMode={programMode}
        />
      </div>
    </div>
  );
};
