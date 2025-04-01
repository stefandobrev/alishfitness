import { Heading, SessionsGrid, AddSessionButton } from './';
import { useMuscleGroupsAndExercises } from './exercises-table/hooks/useMuscleGroupsAndExercises ';
import Spinner from '../../../../components/Spinner';

export const SessionsPanel = ({ activeTab, sessions, onRemoveSession }) => {
  const { isLoading } = useMuscleGroupsAndExercises();
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
    </div>
  );
};
