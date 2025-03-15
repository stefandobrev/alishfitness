import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { fetchExercises } from './helpersMuscleGroupExercise';
import { ToggleableMuscleView } from '../../components/muscleviews';
import TabButton from '../../components/buttons/TabButton';
import Spinner from '../../components/Spinner';
import { PaginationMuscleGroupExercise, MuscleGrid } from './components';

import { Heading } from './sections';
import { useTitle } from '../../hooks/useTitle.hook';

const INITIAL_OFFSET = 0;
const ITEMS_PER_PAGE = 6;
const defaultFilters = {
  searchQuery: '',
  offset: INITIAL_OFFSET,
  hasMore: true,
  loadMore: false,
};

export const MuscleGroupExercisePage = () => {
  const { slugMuscleGroup } = useParams();
  const [exercisesData, setExercisesData] = useState(null);
  const [muscleGroupName, setMuscleGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('exercises');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExercises, setTotalExercises] = useState(0);

  const [{ searchQuery, offset, hasMore, loadMore }, setExerciseGroupProps] =
    useState(defaultFilters);

  const navigate = useNavigate();
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useTitle(muscleGroupName);

  useEffect(() => {
    setCurrentPage(1);
    handleExerciseGroupPropsUpdate({
      offset: INITIAL_OFFSET,
      hasMore: true,
      loadMore: false,
    });
    setIsLoading(true);
    loadExercisesData(INITIAL_OFFSET);
  }, [slugMuscleGroup, searchQuery, navigate]);

  useEffect(() => {
    if (hasMore && loadMore) {
      loadExercisesData(offset);
    }
  }, [loadMore]);

  // useEffect for hiding the tabs on mobile on scrolling down
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024) {
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollThreshold = 200;

        if (
          documentHeight - scrollPosition < scrollThreshold &&
          hasMore &&
          !isLoading &&
          !loadMore
        ) {
          setExerciseGroupProps((prev) => ({
            ...prev,
            loadMore: true,
          }));
        }
      }

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
  }, [hasMore, isLoading, loadMore]);

  const handleExerciseGroupPropsUpdate = (newValues) => {
    setExerciseGroupProps((prevValues) => {
      return {
        ...prevValues,
        ...newValues,
      };
    });
  };

  const loadExercisesData = async (offset) => {
    const currentOffset = offset ?? INITIAL_OFFSET;
    setIsLoading(true);

    const scrollPosition = window.scrollY;

    const data = await fetchExercises({
      selectedMuscleId: slugMuscleGroup,
      offset: currentOffset,
      searchQuery: searchQuery,
    });

    // Handle errors (e.g., 404)
    if (data.error) {
      navigate('/404', { replace: true });
      return;
    }

    // Update exercisesData based on screen size
    setExercisesData((prevExercises) => {
      if (window.innerWidth < 1024) {
        return currentOffset === INITIAL_OFFSET
          ? data.exercises
          : [...prevExercises, ...data.exercises];
      } else {
        // Desktop: Replace exercises (pagination)
        return data.exercises;
      }
    });

    if (data.total_count !== undefined) {
      setTotalExercises(data.total_count);
      setTotalPages(Math.ceil(data.total_count / ITEMS_PER_PAGE));
    } else {
      // Fallback logic if total_count is not provided
      const calculatedTotal = currentOffset + data.exercises.length;
      setTotalExercises(calculatedTotal);
      setTotalPages(Math.ceil(calculatedTotal / ITEMS_PER_PAGE));
    }

    handleExerciseGroupPropsUpdate({
      offset: currentOffset + ITEMS_PER_PAGE,
      loadMore: false,
      hasMore: data.exercises.length >= ITEMS_PER_PAGE,
    });

    setMuscleGroupName(data.name);
    setIsLoading(false);

    // Restore the scroll position after the DOM updates
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition);
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    const newOffset = (newPage - 1) * ITEMS_PER_PAGE;
    setCurrentPage(newPage);
    handleExerciseGroupPropsUpdate({
      offset: newOffset,
      loadMore: false,
    });

    loadExercisesData(newOffset);
  };

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
              totalExercises={totalExercises}
              valueSearch={searchQuery}
              onSearchChange={(value) =>
                handleExerciseGroupPropsUpdate({
                  searchQuery: value,
                  offset: INITIAL_OFFSET,
                })
              }
            />
          </div>

          {/* Exercise Grid Content */}
          {isLoading ? (
            <Spinner loading={isLoading} className='min-h-[70vh]' />
          ) : (
            <>
              <div className='h-auto rounded-xl border border-gray-100 bg-gray-50 pb-2 shadow-sm'>
                <MuscleGrid exercisesData={exercisesData} />

                {/* Pagination - visible only on large screens */}
                {totalExercises > ITEMS_PER_PAGE && (
                  <div className='mt-2 hidden lg:block'>
                    <PaginationMuscleGroupExercise
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
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
          <div className='lg:sticky lg:top-20'>
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
