import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import { fetchMuscleGroups } from './helpersManage';
import TabButton from '../../components/buttons/TabButton';
import { ToggleableMuscleView } from '../../components/muscleviews';
import AddForm from './AddForm';
import EditForm from './EditForm';
import { useTitle } from '../../hooks/useTitle.hook';

import { ExerciseList } from './ExerciseList';

export const ManagePage = () => {
  const methods = useForm();
  const location = useLocation();
  const [mode, setMode] = useState('add');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [refreshTitleListKey, setRefreshTitleListKey] = useState(0);
  const [activeTab, setActiveTab] = useState('form');
  const [selectedPrimaryMuscleSVG, setSelectedPrimaryMuscleSVG] =
    useState(null);
  const [selectedSecondaryMusclesSVG, setSelectedSecondaryMusclesSVG] =
    useState([]);
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

  const handleAddButtonClick = () => {
    launchAddMode();
  };

  const handleMuscleClick = (muscle) => {
    const currentPrimaryMuscle = methods.getValues('primary_group');
    const currentSecondaryMuscles = methods.getValues('secondary_groups') || [];

    if (!currentPrimaryMuscle) {
      methods.setValue('primary_group', muscle);
      setSelectedPrimaryMuscleSVG(muscle);
    } else if (currentPrimaryMuscle === muscle) {
      methods.setValue('primary_group', null);
      setSelectedPrimaryMuscleSVG(null);
    } else {
      if (currentSecondaryMuscles.includes(muscle)) {
        const updatedSecondaries = currentSecondaryMuscles.filter(
          (m) => m !== muscle,
        );
        methods.setValue('secondary_groups', updatedSecondaries);
        setSelectedSecondaryMusclesSVG(updatedSecondaries);
      } else {
        const updatedSecondaries = [...currentSecondaryMuscles, muscle];
        methods.setValue('secondary_groups', updatedSecondaries);
        setSelectedSecondaryMusclesSVG(updatedSecondaries);
      }
    }
  };

  useEffect(() => {
    const subscription = methods.watch((values) => {
      setSelectedPrimaryMuscleSVG(values.primary_group || null);
      setSelectedSecondaryMusclesSVG(values.secondary_groups || []);
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  return (
    <>
      <div className='sticky top-20 z-40 flex h-16 justify-around border-t border-gray-800 bg-gray-600 p-2 lg:hidden'>
        <TabButton
          label='Exercises'
          isActive={activeTab === 'exercise'}
          onClick={() => setActiveTab('exercise')}
        />
        <TabButton
          label='Form'
          isActive={activeTab === 'form'}
          onClick={() => setActiveTab('form')}
        />
        <TabButton
          label='Anatomy'
          isActive={activeTab === 'anatomy'}
          onClick={() => setActiveTab('anatomy')}
        />
      </div>

      <div className='flex flex-col lg:flex-row'>
        <div
          className={`flex w-full flex-col items-center p-4 lg:w-1/4 ${
            activeTab !== 'exercise' ? 'hidden lg:block' : ''
          }`}
        >
          <ExerciseList
            refreshTitlesKey={refreshTitleListKey}
            onSelectExercise={handleSelectExercise}
            muscleGroups={muscleGroups}
          />
        </div>

        <div
          className={`flex w-full justify-center bg-white p-5 lg:w-1/2 ${
            activeTab !== 'form' ? 'hidden lg:flex' : ''
          }`}
        >
          <FormProvider {...methods}>
            {mode === 'add' ? (
              <AddForm
                muscleGroups={muscleGroups}
                onExerciseAdded={triggerRefresh}
              />
            ) : (
              <EditForm
                muscleGroups={muscleGroups}
                exerciseId={selectedExercise}
                onExerciseUpdated={triggerRefresh}
                mode={mode}
                launchAddMode={launchAddMode}
                handleAddButtonClick={handleAddButtonClick}
              />
            )}
          </FormProvider>
        </div>

        <div
          className={`w-full items-center lg:w-1/4 ${
            activeTab !== 'anatomy' ? 'hidden lg:block' : ''
          }`}
        >
          <ToggleableMuscleView
            handleMuscleClick={handleMuscleClick}
            selectedPrimaryMuscle={selectedPrimaryMuscleSVG}
            selectedSecondaryMuscles={selectedSecondaryMusclesSVG}
          />
        </div>
      </div>
    </>
  );
};
