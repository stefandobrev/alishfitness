import { useState, useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import {
  Heading,
  Schedule,
  SessionPanel,
  ProgramActivationBar,
} from './components';
import { MobileTabs, MobileTabVariant } from '@/components/buttons';
import {
  fetchTrainingProgramData,
  saveProgram,
  checkUserHasCurrentProgram,
} from './helpersManageProgram';
import { useTitle } from '@/hooks';
import { manageProgram } from '@/schemas';
import { ConfirmationModal, Spinner } from '@/components/common';
import {
  getChangedFields,
  getChangedProgramFields,
  snakeToCamel,
  toUtcMidnightDateString,
} from '@/utils';
import { mapTrainingProgramData } from './utils';

export const ManageProgramPage = () => {
  const { id: programId } = useParams();
  const [programMode, setProgramMode] = useState('create'); // Defines Create / Edit mode
  const [programUsageMode, setProgramUsageMode] = useState('assigned'); // Defines assigned / template mode
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [programDataAwaitingConfirm, setProgramDataAwaitingConfirm] =
    useState(null); // Holds the data until confirm modal action
  const [trainingProgramData, setTrainingProgramData] = useState(null);
  const [initCompareData, setInitCompareData] = useState(null);
  const [activeTab, setActiveTab] = useState('sessions');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const defaultValues = {
    programTitle: '',
    mode: programUsageMode,
    sessions: [],
    scheduleData: [],
    assignedUser: null,
    activationDate: null,
  };

  const methods = useForm({
    resolver: zodResolver(manageProgram),
    mode: 'onChange',
    defaultValues,
  });

  const { setValue, getValues, reset, control } = methods;

  const { sessions, programTitle, assignedUser } = useWatch({ control });
  const watchedValues = useWatch({ control });

  // If program mode is assigned - formats assignedUser and activationDate according program mode
  const formatCurrentFormData = (formData) => {
    return {
      ...formData,
      activationDate:
        programUsageMode === 'assigned'
          ? formData.activationDate
            ? toUtcMidnightDateString(formData.activationDate)
            : null
          : null,
      assignedUser:
        programUsageMode === 'assigned'
          ? formData.assignedUser
            ? formData.assignedUser.value
            : null
          : null,
    };
  };

  // Checks for edits to switch hasChanges value
  useEffect(() => {
    if (programMode !== 'edit') return;

    const formattedCurrentData = formatCurrentFormData(watchedValues);
    const changedData = getChangedFields(initCompareData, formattedCurrentData);

    setHasChanges(Object.keys(changedData).length > 0);
  }, [watchedValues]);

  // On Edit
  useEffect(() => {
    if (!trainingProgramData) {
      return;
    }

    const mappedData = mapTrainingProgramData(trainingProgramData);

    /* Returns just the id of the user as backend expects just user id and formats the date to 
    string - activation Date expects date. */
    setInitCompareData({
      ...mappedData,
      assignedUser: mappedData.assignedUser?.value ?? null,
      activationDate:
        mappedData.activationDate?.toISOString().slice(0, 10) ?? null,
    });
    // Use different programUsageMode only on edit, on create it's always assigned.
    const resetData = {
      ...mappedData,
      mode: programMode === 'create' ? 'assigned' : mappedData.mode,
    };
    reset(resetData);
    if (programMode === 'edit') {
      setProgramUsageMode(trainingProgramData.mode);
    }
  }, [trainingProgramData]);

  // Page mode processes
  useTitle(`${programMode === 'create' ? 'Create' : 'Edit'} Program`);

  /* First if - programId from useParams for edit mode
  Second if - usage of templates for create mode
  Third if - resets all values on create */
  useEffect(() => {
    if (programId) {
      setProgramMode('edit');
      loadTrainingProgramData(programId);
    } else if (selectedTemplateId) {
      loadTrainingProgramData(selectedTemplateId);
    } else {
      setProgramMode('create');
      setTrainingProgramData(null);
      setProgramUsageMode('assigned');
      reset(defaultValues);
    }
  }, [programId, selectedTemplateId]);

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
  }, [programUsageMode, setValue]);

  const handleRemoveSession = (index) => {
    const currentSessions = getValues('sessions') || [];
    const newSessions = currentSessions.filter((_, i) => i !== index);

    setValue('sessions', newSessions);
    reset({ ...getValues(), sessions: newSessions });
  };

  // Submit program
  const onSubmit = async () => {
    const formData = getValues();

    const formattedData = formatCurrentFormData(formData);
    const isToday =
      formattedData.activationDate === toUtcMidnightDateString(new Date());

    /* Checks if date is today and if there is currently active assigned program on the
    assigned user. If yes, a confirmation must warn the admin that previous current program
    will be immediately replaced with the one created now. */
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

    if (programMode === 'create') {
      submitNewProgram(formattedData);
    }

    if (programMode === 'edit') {
      const changedData = getChangedProgramFields(
        initCompareData,
        formattedData,
      );

      submitEditProgram(changedData, programId);
    }
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

  const submitEditProgram = async (data, id) => {
    setIsLoading(true);
    try {
      const response = await saveProgram(data, id);
      const { type, text } = response;

      if (type === 'error') {
        toast.error(text);
        return;
      }
      if (type === 'success') {
        toast.success(text);
        setProgramDataAwaitingConfirm(null);
        setHasChanges(false);

        const updatedData = await fetchTrainingProgramData(programId);
        const transformedData = snakeToCamel(updatedData);
        setTrainingProgramData(transformedData);
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
            <div
              className={`flex flex-col lg:w-[70%] xl:w-[80%] ${activeTab !== 'sessions' ? 'hidden lg:block' : ''}`}
            >
              <Heading
                programUsageMode={programUsageMode}
                setProgramUsageMode={setProgramUsageMode}
                programMode={programMode}
                setSelectedTemplateId={setSelectedTemplateId}
                selectedTemplateId={selectedTemplateId}
              />
              <SessionPanel
                sessions={sessions}
                onRemoveSession={handleRemoveSession}
              />
              <ProgramActivationBar
                onSubmit={onSubmit}
                programUsageMode={programUsageMode}
                programMode={programMode}
                hasChanges={hasChanges}
              />
            </div>

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
