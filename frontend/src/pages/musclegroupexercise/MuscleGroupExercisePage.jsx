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

const Pagination = () => {
  return (
    <div className='flex items-center justify-center gap-4'>
      <button className='rounded-md bg-gray-200 px-4 py-2 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'>
        Prev
      </button>

      <span className='text-gray-700'>Page 1</span>

      <button className='rounded-md bg-gray-200 px-4 py-2 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'>
        Next
      </button>
    </div>
  );
};

export const MuscleGroupExercisePage = () => {
  const { slugMuscleGroup } = useParams();
  const [exercisesData, setExercisesData] = useState(null);
  const [muscleGroupName, setMuscleGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('exercises');
  const [searchQuery, setSearchQuery] = useState('');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const offset = 0;
  const items = 6;
  const navigate = useNavigate();
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useTitle(muscleGroupName);

  useEffect(() => {
    setIsLoading(true);
    const loadExercisesData = async () => {
      const data = await fetchExercises({
        selectedMuscleId: slugMuscleGroup,
        offset: offset,
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
      {/* Mobile Tabs with slide-up/down animation */}
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

      {/* Main Content Layout */}
      <div className='flex flex-col lg:flex-row'>
        {/* Left Side - Exercises */}
        <div
          className={`flex w-full flex-col gap-4 lg:w-[75%] ${
            activeTab !== 'exercises' ? 'hidden lg:flex' : ''
          }`}
        >
          {/* Sticky Header for Exercise List */}
          <div
            className={`transition-transform duration-500 ease-in-out ${
              isHeaderVisible
                ? 'sticky top-36 translate-y-0 opacity-100'
                : 'relative -translate-y-full opacity-0'
            } z-30 bg-white pb-2 lg:static lg:bg-transparent lg:pb-0`}
          >
            <Heading
              muscleGroupName={muscleGroupName}
              exercisesData={exercisesData}
              valueSearch={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Exercise Grid Content */}
          {isLoading ? (
            <Spinner loading={isLoading} className='min-h-[70vh]' />
          ) : (
            <>
              <div className='h-auto rounded-xl border border-gray-100 bg-gray-50 pb-2 shadow-sm'>
                <MuscleGrid exercisesData={exercisesData} />
                <div className='mt-2 hidden lg:block'>
                  <Pagination />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Side - Anatomy View with Sticky Positioning */}
        <div
          className={`w-full items-center lg:w-[25%] ${
            activeTab !== 'anatomy' ? 'hidden lg:block' : ''
          }`}
        >
          <div className='lg:sticky lg:top-30'>
            <ToggleableMuscleView
              handleMuscleClick={handleMuscleClick}
              selectedPrimaryMuscle={slugMuscleGroup}
            />
          </div>
        </div>
      </div>
    </>
  );
};
