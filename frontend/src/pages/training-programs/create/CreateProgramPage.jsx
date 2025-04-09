import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Schedule, SessionsPanel } from './components';
import { MobileTabs, MobileTabVariant } from '@/components/buttons';
import { useTitle } from '@/hooks/useTitle.hook';
import createProgram from '@/schemas/createProgram';

export const CreateProgramPage = () => {
  const [newProgramMode, setNewProgramMode] = useState(true);
  const [activeTab, setActiveTab] = useState('sessions');
  const methods = useForm({ resolver: zodResolver(createProgram) });
  const { watch, setValue, getValues, reset } = methods;
  useTitle('Create');

  const sessions = watch('sessions');

  const handleRemoveSession = (index) => {
    const currentSessions = getValues('sessions') || [];
    const newSessions = currentSessions.filter((_, i) => i !== index);

    setValue('sessions', newSessions);
    reset({ ...getValues(), sessions: newSessions });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const onSubmit = async (data) => {
    console.log({ data });
  };

  const tabs = [
    { label: 'Sessions', value: 'sessions' },
    { label: 'Schedule', value: 'schedule' },
  ];

  return (
    <>
      <MobileTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabs}
        variant={MobileTabVariant.HIDE}
      />

      <FormProvider {...methods}>
        <div className='flex w-full flex-col lg:flex-row'>
          <SessionsPanel
            onSubmit={onSubmit}
            activeTab={activeTab}
            sessions={sessions}
            onRemoveSession={handleRemoveSession}
            newProgramMode={newProgramMode}
            setNewProgramMode={setNewProgramMode}
          />

          <Schedule activeTab={activeTab} sessions={sessions} />
        </div>
      </FormProvider>
    </>
  );
};
