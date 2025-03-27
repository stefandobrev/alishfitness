import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import { fetchMuscleGroups } from './helpersManageExercises';
import { useTitle } from '../../../hooks/useTitle.hook';
import { ExerciseListPanel, FormPanel, AnatomyPanel } from './components';
import { MobileTabs } from '../../../components/buttons';

export const ManageExercisesPage = () => {
  const methods = useForm();
  const location = useLocation();
  const [mode, setMode] = useState('add');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [refreshTitleListKey, setRefreshTitleListKey] = useState(0);
  const [activeTab, setActiveTab] = useState('form');
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
    if (location.state?.exerciseId) {
      handleSelectExercise(location.state.exerciseId);
    }
  }, [location.state]);

  const triggerRefresh = () => setRefreshTitleListKey((prev) => prev + 1);

  const launchAddMode = () => {
    setMode('add');
    setSelectedExercise(null);
    methods.reset();
  };

  const handleSelectExercise = (exerciseId) => {
    setSelectedExercise(exerciseId);
    setMode('edit');
    setActiveTab('form');
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
      <div className='sticky top-20 z-40 flex h-16 justify-around border-t border-gray-800 bg-gray-600 p-2 lg:hidden'>
        <MobileTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabs={tabs}
        />
      </div>

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
            muscleGroups={muscleGroups}
            selectedExercise={selectedExercise}
            onExerciseChange={triggerRefresh}
            onAddNew={launchAddMode}
          />

          <AnatomyPanel activeTab={activeTab} methods={methods} />
        </FormProvider>
      </div>
    </>
  );
};
