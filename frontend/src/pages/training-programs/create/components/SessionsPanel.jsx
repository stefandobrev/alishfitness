import {
  Heading,
  SessionsGrid,
  AddSessionButton,
  ProgramActivationBar,
} from './';
import { useTrainingSetupData } from './exercises-table';
import { Spinner } from '../../../../components/common';

export const SessionsPanel = ({
  activeTab,
  sessions,
  onRemoveSession,
  newProgramMode,
  setNewProgramMode,
}) => {
  const { isLoading } = useTrainingSetupData();
  return (
    <div
      className={`flex w-full flex-col lg:w-[70%] xl:w-[80%] ${activeTab !== 'sessions' ? 'hidden lg:block' : ''}`}
    >
      <div className='flex flex-col px-4'>
        <Heading
          newProgramMode={newProgramMode}
          setNewProgramMode={setNewProgramMode}
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
          <AddSessionButton />
        </div>

        <ProgramActivationBar newProgramMode={newProgramMode} />
      </div>
    </div>
  );
};
