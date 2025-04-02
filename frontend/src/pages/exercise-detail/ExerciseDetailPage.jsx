import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { fetchExercise } from './helpersExerciseDetail';
import { ToggleableMuscleView } from '../../components/muscleviews';
import { MobileTabs } from '../../components/buttons';
import {
  AnatomyLegend,
  ExerciseDataHeading,
  ExerciseDataContainer,
} from './components';

import Spinner from '../../components/Spinner';
import { useTitle } from '../../hooks/useTitle.hook';

export const ExerciseDetailPage = () => {
  const [exerciseData, setExerciseData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { slugMuscleGroup, slugTitle } = useParams();
  const [activeTab, setActiveTab] = useState('exercise');
  const navigate = useNavigate();

  useTitle(exerciseData?.title);

  useEffect(() => {
    const loadExerciseData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchExercise({ slugMuscleGroup, slugTitle });

        // data.error should handle 404 only. Rest is handled by helpers.
        if (data.error) {
          navigate('/404', { replace: true });
        }
        setExerciseData(data);
      } finally {
        setIsLoading(false);
      }
    };
    loadExerciseData();
  }, [slugTitle, navigate]);

  const handleMuscleClick = (svgId) => {
    navigate(`/exercises/${svgId}`);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const tabs = [
    { label: 'Exercise', value: 'exercise' },
    { label: 'Anatomy', value: 'anatomy' },
  ];

  return (
    <>
      <MobileTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabs}
      />

      {/* Main Content Container */}
      <div className='flex flex-col lg:flex-row'>
        {/* Left Side - Exercise Content */}
        <div
          className={`flex w-full flex-col gap-4 lg:w-[75%] ${
            activeTab !== 'exercise' ? 'hidden lg:flex' : ''
          }`}
        >
          {isLoading ? (
            <Spinner className='min-h-[70vh]' />
          ) : (
            <div className='flex flex-col items-center'>
              <ExerciseDataHeading exerciseData={exerciseData} />
              <ExerciseDataContainer exerciseData={exerciseData} />
            </div>
          )}
        </div>

        {/* Right Side - Anatomy View */}
        <div
          className={`w-full lg:w-[25%] ${
            activeTab !== 'anatomy' ? 'hidden lg:block' : ''
          }`}
        >
          <div className='px-6 lg:sticky lg:top-20'>
            <ToggleableMuscleView
              handleMuscleClick={handleMuscleClick}
              selectedPrimaryMuscle={slugMuscleGroup}
              selectedSecondaryMuscles={exerciseData?.secondary_groups}
            />
            <AnatomyLegend />
          </div>
        </div>
      </div>
    </>
  );
};
