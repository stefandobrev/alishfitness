import {
  Heading,
  SessionsGrid,
  AddSessionButton,
  ProgramActivationBar,
} from './';
import { useTrainingSetupData } from './exercises-table';
import Spinner from '../../../../components/Spinner';

export const SessionsPanel = ({ activeTab, sessions, onRemoveSession }) => {
  const { isLoading } = useTrainingSetupData();
  return (
    <div
      className={`flex w-full flex-col px-4 lg:w-[80%] ${activeTab !== 'sessions' ? 'hidden lg:block' : ''}`}
    >
      <Heading />

      {isLoading ? (
        <Spinner isLoading={isLoading} />
      ) : (
        <SessionsGrid sessions={sessions} onRemoveSession={onRemoveSession} />
      )}

      <AddSessionButton />

      <ProgramActivationBar />
    </div>
  );
};
