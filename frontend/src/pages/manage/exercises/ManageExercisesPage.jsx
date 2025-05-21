import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  fetchMuscleGroups,
  fetchExerciseData,
  saveExercise,
  deleteExercise,
} from './helpersManageExercises';
import { useTitle } from '@/hooks';
import { ExerciseListPanel, FormPanel, AnatomyPanel } from './components';
import { MobileTabs } from '@/components/buttons';
import { getChangedFields, snakeToCamel } from '@/utils';
import { manageExercises } from '@/schemas';

export const ManageExercisesPage = () => {
  const location = useLocation();
  const [mode, setMode] = useState('add');
  const [message, setMessage] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseData, setExerciseData] = useState(null);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [refreshTitleListKey, setRefreshTitleListKey] = useState(0);
  const [activeTab, setActiveTab] = useState('form');
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm({
    resolver: zodResolver(manageExercises),
  });
  const { reset } = methods;
  useTitle('Manage');

  useEffect(() => {
    const loadMuscleGroups = async () => {
      const muscleGroupsData = await fetchMuscleGroups();
      const transformedMuscleGroups = muscleGroupsData.map((group) => ({
        label: group.name,
        value: group.slug,
      }));
      setMuscleGroups(transformedMuscleGroups);
    };

    loadMuscleGroups();
  }, []);

  useEffect(() => {
    const loadExerciseData = async () => {
      if (!selectedExercise) {
        setExerciseData(null);
        return;
      }

      setIsLoading(true);
      try {
        const data = await fetchExerciseData(selectedExercise);
        const transformedData = snakeToCamel(data);
        setExerciseData(transformedData);
        reset({});
      } finally {
        setIsLoading(false);
      }
    };

    loadExerciseData();
  }, [selectedExercise]);

  useEffect(() => {
    if (location.state?.exerciseId) {
      handleSelectExercise(location.state.exerciseId);
    }
  }, [location.state]);

  const onSubmitNewExercise = async (submittedExerciseData) => {
    setIsLoading(true);

    try {
      const response = await saveExercise(submittedExerciseData);
      const { type, text } = response;

      if (type === 'error') {
        setMessage({ type, text });
        return;
      }

      if (type === 'success') {
        toast.success(text);
        triggerRefresh();
        reset({
          steps: [],
          mistakes: [],
        });
        setMessage('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitEditExercise = async (submittedExerciseData) => {
    const { id, slug, ...cleanedInitData } = exerciseData; // Removed unnecessary fields for submit.
    const changedData = getChangedFields(
      cleanedInitData,
      submittedExerciseData,
    );
    console.log({ changedData });

    setIsLoading(true);
    try {
      const response = await saveExercise(changedData, selectedExercise);
      const { type, text } = response;

      if (type === 'error') {
        toast.error(text);
        setMessage({ type, text });
        return;
      }

      if (type === 'success') {
        toast.success(text);
        triggerRefresh();
        setMessage('');

        const updatedData = await fetchExerciseData(selectedExercise);
        const transformedData = snakeToCamel(updatedData);
        setExerciseData(transformedData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    const response = await deleteExercise(selectedExercise);
    const { type, text } = response;

    if (type === 'error') {
      toast.error(text);
      setMessage({ type, text });
      return;
    }

    if (type === 'success') {
      toast.success(text);
      triggerRefresh();
      launchAddMode();
    }
  };

  const triggerRefresh = () => setRefreshTitleListKey((prev) => prev + 1);

  const launchAddMode = () => {
    setMode('add');
    setSelectedExercise(null);
    reset({
      steps: [],
      mistakes: [],
    });
    setMessage('');
  };

  const handleSelectExercise = (exerciseId) => {
    setSelectedExercise(exerciseId);
    setMode('edit');
    setActiveTab('form');
    setMessage('');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const tabs = [
    { label: 'Exercises', value: 'exercises' },
    { label: 'Form', value: 'form' },
    { label: 'Anatomy', value: 'anatomy' },
  ];

  return (
    <>
      <MobileTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabs}
      />

      <div className='flex flex-col lg:flex-row'>
        <ExerciseListPanel
          activeTab={activeTab}
          refreshTitlesKey={refreshTitleListKey}
          muscleGroups={muscleGroups}
          onSelectExercise={handleSelectExercise}
        />

        <FormProvider {...methods}>
          <FormPanel
            activeTab={activeTab}
            mode={mode}
            isLoading={isLoading}
            muscleGroups={muscleGroups}
            exerciseData={exerciseData}
            onExerciseChange={triggerRefresh}
            onAddNew={launchAddMode}
            submittedNewExerciseData={onSubmitNewExercise}
            submittedEditExerciseData={onSubmitEditExercise}
            handleDeleteConfirm={handleDeleteConfirm}
            message={message}
          />

          <AnatomyPanel activeTab={activeTab} />
        </FormProvider>
      </div>
    </>
  );
};
