import { useState, useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import { Schedule, SessionsPanel } from './components';
import { MobileTabs, MobileTabVariant } from '@/components/buttons';
import {
  fetchTrainingProgramData,
  saveProgram,
  checkUserHasCurrentProgram,
} from './helpersManageProgram';
import { useTitle } from '@/hooks';
import { manageProgram } from '@/schemas';
import { ConfirmationModal, Spinner } from '@/components/common';
import { snakeToCamel, toUtcMidnightDateString } from '@/utils';
import { mapTrainingProgramData } from './utils';

export const ManageProgramPage = () => {
  const { id: programId } = useParams();
  const [programMode, setProgramMode] = useState('create');
  const [programUsageMode, setProgramUsageMode] = useState('assigned');
  const [programDataAwaitingConfirm, setProgramDataAwaitingConfirm] =
    useState(null); // Holds the data until confirm modal action
  const [trainingProgramData, setTrainingProgramData] = useState(null);
  const [activeTab, setActiveTab] = useState('sessions');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const defaultValues = {
    programTitle: '',
    mode: programUsageMode,
    sessions: [],
    scheduleArray: [],
    assignedUser: null,
    activationDate: null,
  };

  const methods = useForm({
    resolver: zodResolver(manageProgram),
    mode: 'onChange',
    defaultValues,
  });
  // On Edit
  useEffect(() => {
    if (!trainingProgramData) {
      return;
    }
    methods.reset(mapTrainingProgramData(trainingProgramData));
    setProgramUsageMode(trainingProgramData.mode);
  }, [trainingProgramData]);

  const { setValue, getValues, reset, handleSubmit, control } = methods;

  // Page mode processes
  useTitle(`${programMode === 'create' ? 'Create' : 'Edit'} Program`);

  useEffect(() => {
    if (programId) {
      setProgramMode('edit');
      loadTrainingProgramData(programId);
    } else {
      setProgramMode('create');
      setTrainingProgramData(null);
      setProgramUsageMode('assigned');
      setActiveTab('sessions');
      reset(defaultValues);
    }
  }, [programId]);

  const loadTrainingProgramData = async (programId) => {
    setIsLoading(true);
    try {
      const data = await fetchTrainingProgramData(programId);
      const transformedData = snakeToCamel(data);
      setTrainingProgramData(transformedData);
    } finally {
      setIsLoading(false);
    }
  };

  // Sessions within program processes
  useEffect(() => {
    setValue('mode', programUsageMode);
  }, [programUsageMode, setValue, trainingProgramData?.mode]);

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
      activationDate:
        programUsageMode === 'assigned'
          ? data.activationDate
            ? toUtcMidnightDateString(data.activationDate)
            : null
          : null,
      assignedUser:
        programUsageMode === 'assigned'
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
        setProgramDataAwaitingConfirm(formattedData);
        return;
      }
    }

    submitNewProgram(formattedData);
  };

  const handleProgramConfirm = async () => {
    setIsConfirmDialogOpen(false);
    if (programDataAwaitingConfirm) {
      if (programMode === 'create') {
        submitNewProgram(programDataAwaitingConfirm);
      }
    }
  };

  const submitNewProgram = async (data) => {
    setIsLoading(true);
    try {
      const response = await saveProgram(data);
      const { type, text } = response;

      if (type === 'error') {
        toast.error(text);
        return;
      }
      if (type === 'success') {
        toast.success(text);
        setProgramUsageMode('assigned');
        setProgramDataAwaitingConfirm(null);
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
              programMode={programMode}
              activeTab={activeTab}
              sessions={sessions}
              onRemoveSession={handleRemoveSession}
              programUsageMode={programUsageMode}
              setProgramUsageMode={setProgramUsageMode}
            />

            <Schedule activeTab={activeTab} sessions={sessions} />
          </div>
        </FormProvider>
      )}

      {isConfirmDialogOpen && (
        <ConfirmationModal
          onClose={() => setIsConfirmDialogOpen(false)}
          onConfirm={handleProgramConfirm}
          heading={`Program: ${programTitle}`}
          message={`${assignedUser.label} already has a current program. Are you sure you want to replace it with this new program?`}
        />
      )}
    </>
  );
};
