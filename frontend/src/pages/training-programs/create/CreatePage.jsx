import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Schedule, SessionsPanel } from './components';
import { MobileTabs } from '../../../components/buttons';
import { useTitle } from '../../../hooks/useTitle.hook';

export const CreatePage = () => {
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

  const tabs = [
    { label: 'Sessions', value: 'sessions' },
    { label: 'Schedule', value: 'schedule' },
  ];

  return (
    <>
      <div className='sticky top-20 z-40 flex h-16 justify-around border-t border-gray-800 bg-gray-600 p-2 lg:hidden'>
        <MobileTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabs={tabs}
        />
      </div>

      <FormProvider {...methods}>
        <div className='flex w-full flex-col lg:flex-row'>
          <SessionsPanel
            activeTab={activeTab}
            sessions={sessions}
            onRemoveSession={handleRemoveSession}
          />

          <Schedule activeTab={activeTab} sessions={sessions} />
        </div>
      </FormProvider>
    </>
  );
};
