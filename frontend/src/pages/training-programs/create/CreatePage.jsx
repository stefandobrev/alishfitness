import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Schedule, SessionsPanel } from './components';
import { MobileTabs, MobileTabVariant } from '@/components/buttons';
import { useTitle } from '@/hooks/useTitle.hook';

export const CreatePage = () => {
  const [newProgramMode, setNewProgramMode] = useState(true);
  const [activeTab, setActiveTab] = useState('sessions');
  const methods = useForm();
  useTitle('Create');

  const sessions = methods.watch('sessions');

  const handleRemoveSession = (index) => {
    const currentSessions = methods.getValues('sessions') || [];
    const newSessions = currentSessions.filter((_, i) => i !== index);

    methods.setValue('sessions', newSessions);
    methods.reset({ ...methods.getValues(), sessions: newSessions });
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
