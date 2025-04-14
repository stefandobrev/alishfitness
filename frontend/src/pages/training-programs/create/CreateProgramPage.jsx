import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Schedule, SessionsPanel } from './components';
import { MobileTabs, MobileTabVariant } from '@/components/buttons';
import { createProgramRequest } from './helpersCreateProgram';
import { useTitle } from '@/hooks/useTitle.hook';
import createProgram from '@/schemas/createProgram';

export const CreateProgramPage = () => {
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [activeTab, setActiveTab] = useState('sessions');
  const methods = useForm({
    resolver: zodResolver(createProgram),
    mode: 'onChange',
    defaultValues: {
      mode: isCreateMode ? 'create' : 'template',
      sessions: [],
      scheduleArray: [],
      assignedUser: null,
      activationDate: null,
    },
  });
  const { watch, setValue, getValues, reset } = methods;

  useTitle('Create');

  useEffect(() => {
    setValue('mode', isCreateMode ? 'create' : 'template');
  }, [isCreateMode, setValue]);

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
    const formattedData = {
      ...data,
      activationDate: data.activationDate
        ? new Date(data.activationDate).toISOString().split('T')[0]
        : null,
      assignedUser: data.assignedUser ? data.assignedUser.value : null,
    };

    const response = await createProgramRequest(formattedData);
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
            isCreateMode={isCreateMode}
            setIsCreateMode={setIsCreateMode}
          />

          <Schedule activeTab={activeTab} sessions={sessions} />
        </div>
      </FormProvider>
    </>
  );
};
