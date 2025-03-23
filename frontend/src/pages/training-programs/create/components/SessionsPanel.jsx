import { Heading, SessionsGrid, AddSessionButton } from './';

export const SessionsPanel = ({
  activeTab,
  sessions,
  control,
  watch,
  setValue,
  getValues,
  onRemoveSession,
}) => {
  return (
    <div
      className={`flex w-full flex-col px-4 lg:w-[80%] ${activeTab !== 'sessions' ? 'hidden lg:block' : ''}`}
    >
      <Heading />

      <SessionsGrid
        sessions={sessions}
        control={control}
        watch={watch}
        setValue={setValue}
        getValues={getValues}
        onRemoveSession={onRemoveSession}
      />

      <AddSessionButton />
    </div>
  );
};
