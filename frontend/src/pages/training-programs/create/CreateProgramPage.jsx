import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import { Schedule, SessionsPanel } from './components';
import { MobileTabs, MobileTabVariant } from '@/components/buttons';
import {
  createProgramRequest,
  checkUserHasCurrentProgram,
} from './helpersCreateProgram';
import { useTitle } from '@/hooks';
import { createProgram } from '@/schemas';
import { ConfirmationModal, Spinner } from '@/components/common';
import { toUtcMidnightDateString } from '@/utils';

export const CreateProgramPage = () => {
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [pendingProgramData, setPendingProgramData] = useState(null);
  const [activeTab, setActiveTab] = useState('sessions');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

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
  const { watch, setValue, getValues, reset, handleSubmit } = methods;

  useTitle('Create');

  useEffect(() => {
    setValue('mode', isCreateMode ? 'create' : 'template');
  }, [isCreateMode, setValue]);

  const { sessions, programTitle, assignedUser } = watch();

  const handleRemoveSession = (index) => {
    const currentSessions = getValues('sessions') || [];
    const newSessions = currentSessions.filter((_, i) => i !== index);

    setValue('sessions', newSessions);
    reset({ ...getValues(), sessions: newSessions });
  };

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      activationDate: isCreateMode
        ? data.activationDate
          ? toUtcMidnightDateString(data.activationDate)
          : null
        : null,
      assignedUser: isCreateMode
        ? data.assignedUser
          ? data.assignedUser.value
          : null
        : null,
    };

    const isToday =
      formattedData.activationDate === toUtcMidnightDateString(new Date());

    // Checks if date is today and if there is currently active assigned program on the
    // assigned user. If yes, a confirmation must warn the admin that previous current program
    // will be immediately replaced with the one created now.
    if (formattedData.assignedUser && isToday) {
      const hasCurrentProgram = await checkUserHasCurrentProgram({
        assignedUser: formattedData.assignedUser,
      });

      if (hasCurrentProgram) {
        setIsConfirmDialogOpen(true);
        setPendingProgramData(formattedData);
        return;
      }
    }

    submitProgram(formattedData);
  };

  const handleProgramConfirmation = async () => {
    setIsConfirmDialogOpen(false);
    if (pendingProgramData) {
      submitProgram(pendingProgramData);
    }
  };

  const submitProgram = async (data) => {
    setIsLoading(true);
    try {
      const response = await createProgramRequest(data);
      const { type, text } = response;

      if (type === 'error') {
        toast.error(text);
        return;
      }
      if (type === 'success') {
        toast.success(text);
        setIsCreateMode(true);
        setPendingProgramData(null);
        reset(methods.defaultValues);
      }
    } finally {
      setIsLoading(false);
    }
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
              onSubmit={handleSubmit(onSubmit)}
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

      {isConfirmDialogOpen && (
        <ConfirmationModal
          onClose={() => setIsConfirmDialogOpen(false)}
          onConfirm={handleProgramConfirmation}
          heading={`Program: ${programTitle}`}
          message={`${assignedUser.label} already has a current program. Are you sure you want to replace it with this new program?`}
        />
      )}
    </>
  );
};
