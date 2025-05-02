import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import { Schedule, SessionsPanel } from './components';
import { MobileTabs, MobileTabVariant } from '@/components/buttons';
import { createProgramRequest } from './helpersCreateProgram';
import { useTitle } from '@/hooks';
import { createProgram } from '@/schemas';
import { Spinner } from '@/components/common';

export const CreateProgramPage = () => {
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [activeTab, setActiveTab] = useState('sessions');
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm({
    resolver: zodResolver(createProgram),
    mode: 'onChange',
    defaultValues: {
      mode: isCreateMode ? 'create' : 'template',
      sessions: [],
      scheduleArray: [],
      assignedUserUsername: null,
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
      assignedUserUsername: data.assignedUserUsername
        ? data.assignedUserUsername.value
        : null,
    };

    setIsLoading(true);

    try {
      const response = await createProgramRequest(formattedData);
      const { type, text } = response;

      if (type === 'error') {
        toast.error(text);
        return;
      }

      if (type === 'success') {
        toast.success(text);
        setIsCreateMode(true);
        reset({});
      }
    } finally {
      setIsLoading(false);
    }
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

      {isLoading ? (
        <Spinner loading={isLoading} className='min-h-[70vh]' />
      ) : (
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
      )}
    </>
  );
};
