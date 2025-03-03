import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToggleableMuscleView } from '../../components/muscleviews';
import { fetchExercises } from './helpersMuscleGroupExercise';
import Spinner from '../../components/Spinner';
import TabButton from '../../components/buttons/TabButton';
import Heading from './Heading';
import MuscleGrid from './MuscleGrid';
import { useTitle } from '../../hooks/useTitle.hook';

export const MuscleGroupExercisePage = () => {
  const { slugMuscleGroup } = useParams();
  const [exercisesData, setExercisesData] = useState(null);
  const [muscleGroupName, setMuscleGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('exercises');
  const [searchQuery, setSearchQuery] = useState('');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const navigate = useNavigate();
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useTitle(muscleGroupName);

  useEffect(() => {
    setIsLoading(true);
    const loadExercisesData = async () => {
      const data = await fetchExercises({
        selectedMuscleId: slugMuscleGroup,
        searchQuery: searchQuery,
      });
      // data.error should handle 404 only. Rest is handled by helpers.
      if (data.error) {
        navigate('/404', { replace: true });
      }
      setExercisesData(data.exercises);
      setMuscleGroupName(data.name);
      setIsLoading(false);
    };
    loadExercisesData();
  }, [slugMuscleGroup, searchQuery, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollThreshold = 20; // Minimum scroll difference to trigger change

          if (currentScrollY <= 10) {
            setIsHeaderVisible(true);
          } else if (currentScrollY < lastScrollY.current - scrollThreshold) {
            setIsHeaderVisible(true); // Scrolling up
          } else if (currentScrollY > lastScrollY.current + scrollThreshold) {
            setIsHeaderVisible(false); // Scrolling down
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMuscleClick = (svgId) => {
    if (slugMuscleGroup !== svgId) {
      setActiveTab('exercises');
      navigate(`/exercises/${svgId}`);
    }
  };

  return (
    <>
      <div
        className={`transition-transform duration-500 ease-in-out ${
          isHeaderVisible
            ? 'sticky top-20 translate-y-0 opacity-100'
            : 'relative -translate-y-full opacity-0'
        } z-40 flex h-16 justify-around border-t border-gray-800 bg-gray-600 p-2 lg:hidden`}
      >
        <TabButton
          label='Exercises'
          isActive={activeTab === 'exercises'}
          onClick={() => setActiveTab('exercises')}
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
            activeTab !== 'exercises' ? 'hidden lg:flex' : ''
          }`}
        >
          <div
            className={`transition-transform duration-500 ease-in-out ${
              isHeaderVisible
                ? 'sticky top-36 translate-y-0 opacity-100'
                : 'relative -translate-y-full opacity-0'
            } z-30 bg-white pb-2 lg:static lg:pb-0 dark:bg-gray-900`}
          >
            <Heading
              muscleGroupName={muscleGroupName}
              exercisesData={exercisesData}
              valueSearch={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
          {isLoading ? (
            <Spinner loading={isLoading} className='min-h-[70vh]' />
          ) : (
            <div className='h-auto rounded-xl border border-gray-100 bg-gray-50 pb-8 shadow-sm lg:max-h-[650px] lg:overflow-y-auto lg:pb-4'>
              <MuscleGrid exercisesData={exercisesData} />
            </div>
          )}
        </div>
        <div
          className={`w-full items-center lg:w-[25%] ${
            activeTab !== 'anatomy' ? 'hidden lg:block' : ''
          }`}
        >
          <ToggleableMuscleView
            handleMuscleClick={handleMuscleClick}
            selectedPrimaryMuscle={slugMuscleGroup}
          />
        </div>
      </div>
    </>
  );
};
