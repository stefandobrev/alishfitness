import { useState, useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import { Schedule, SessionsPanel } from './components';
import { MobileTabs, MobileTabVariant } from '@/components/buttons';
import {
  fetchTrainingProgramData,
  createProgramRequest,
  checkUserHasCurrentProgram,
} from './helpersManageProgram';
import { useTitle } from '@/hooks';
import { manageProgram } from '@/schemas';
import { ConfirmationModal, Spinner } from '@/components/common';
import { toUtcMidnightDateString } from '@/utils';

export const ManageProgramPage = () => {
  const { id: programId } = useParams();
  const [pageMode, setPageMode] = useState('create');
  const [isAssignedMode, setIsAssignedMode] = useState(true);
  const [pendingProgramData, setPendingProgramData] = useState(null);
  const [trainingProgramData, setTraininProgramsData] = useState(null);
  const [activeTab, setActiveTab] = useState('sessions');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const methods = useForm({
    resolver: zodResolver(manageProgram),
    mode: 'onChange',
    defaultValues: {
      mode: isAssignedMode ? 'assigned' : 'template',
      sessions: [],
      scheduleArray: [],
      assignedUser: null,
      activationDate: null,
    },
  });
  const { setValue, getValues, reset, handleSubmit, control } = methods;

  useTitle('Create');

  // Page mode processes
  useEffect(() => {
    if (programId) {
      setPageMode('edit');
      loadTrainingProgramData(programId);
    } else {
      setPageMode('create');
      setTraininProgramsData(null);
      setIsAssignedMode(true);
      setActiveTab('sessions');
      reset(methods.defaultValues);
    }
  }, [programId]);

  const loadTrainingProgramData = async (programId) => {
    setIsLoading(true);
    try {
      const data = await fetchTrainingProgramData(programId);
      setTraininProgramsData(data);
    } finally {
      setIsLoading(false);
    }
  };

  // Sessions within program processes
  useEffect(() => {
    setValue('mode', isAssignedMode ? 'assigned' : 'template');
  }, [isAssignedMode, setValue]);

  const { sessions, programTitle, assignedUser } = useWatch({ control });

  const handleRemoveSession = (index) => {
    const currentSessions = getValues('sessions') || [];
    const newSessions = currentSessions.filter((_, i) => i !== index);

    setValue('sessions', newSessions);
    reset({ ...getValues(), sessions: newSessions });
  };

  // Submit program
  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      activationDate: isAssignedMode
        ? data.activationDate
          ? toUtcMidnightDateString(data.activationDate)
          : null
        : null,
      assignedUser: isAssignedMode
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
        setIsAssignedMode(true);
        setPendingProgramData(null);
        reset(methods.defaultValues);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Tab processes
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
              pageMode={pageMode}
              activeTab={activeTab}
              sessions={sessions}
              onRemoveSession={handleRemoveSession}
              isAssignedMode={isAssignedMode}
              setIsAssignedMode={setIsAssignedMode}
              {...(trainingProgramData && { trainingProgramData })}
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
