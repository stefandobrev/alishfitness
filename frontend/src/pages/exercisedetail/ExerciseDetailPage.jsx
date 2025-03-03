import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { fetchExercise } from './helpersExerciseDetail';
import { ToggleableMuscleView } from '../../components/muscleviews';
import TabButton from '../../components/buttons/TabButton';
import ExerciseDataHeading from './ExerciseDataHeading';
import ExerciseDataContainer from './ExerciseDataContainer';
import AnatomyLegend from './AnatomyLegend';
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
    setIsLoading(true);

    const loadExerciseData = async () => {
      const data = await fetchExercise({ slugMuscleGroup, slugTitle });

      // data.error should handle 404 only. Rest is handled by helpers.
      if (data.error) {
        navigate('/404', { replace: true });
      }
      setExerciseData(data);
      setIsLoading(false);
    };

    loadExerciseData();
  }, [slugTitle]);

  const handleMuscleClick = (svgId) => {
    navigate(`/exercises/${svgId}`);
  };

  return (
    <>
      <div className='sticky top-20 z-40 flex h-16 justify-around border-t border-gray-800 bg-gray-600 p-2 lg:hidden'>
        <TabButton
          label='Exercise'
          isActive={activeTab === 'exercise'}
          onClick={() => setActiveTab('exercise')}
        />
        <TabButton
          label='Anatomy'
          isActive={activeTab === 'anatomy'}
          onClick={() => setActiveTab('anatomy')}
        />
      </div>

      <div className='flex flex-col lg:flex-row'>
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
        <div
          className={`w-full lg:w-[25%] ${
            activeTab !== 'anatomy' ? 'hidden lg:block' : ''
          }`}
        >
          <div className='px-6'>
            <ToggleableMuscleView
              handleMuscleClick={handleMuscleClick}
              selectedPrimaryMuscle={slugMuscleGroup}
              selectedSecondaryMuscles={exerciseData?.secondary_groups}
            />
          </div>
          <AnatomyLegend />
        </div>
      </div>
    </>
  );
};
