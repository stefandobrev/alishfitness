import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Schedule, SessionsPanel, MobileTabs } from './components';
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

  return (
    <>
      <MobileTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <FormProvider {...methods}>
        <div className='flex w-full flex-col lg:flex-row'>
          <SessionsPanel
            activeTab={activeTab}
            sessions={sessions}
            control={methods.control}
            watch={methods.watch}
            setValue={methods.setValue}
            getValues={methods.getValues}
            onRemoveSession={handleRemoveSession}
          />

          <Schedule
            activeTab={activeTab}
            sessions={sessions}
            control={methods.control}
            setValue={methods.setValue}
          />
        </div>
      </FormProvider>
    </>
  );
};
