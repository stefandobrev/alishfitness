import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { fetchExercises } from './helpersMuscleGroupExercise';
import { MobileTabs, MobileTabVariant } from '../../components/buttons';
import { ExerciseSection, AnatomySection } from './components';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExercises, setTotalExercises] = useState(0);

  const [{ searchQuery, offset, hasMore, loadMore }, setExerciseGroupProps] =
    useState(defaultFilters);

  const navigate = useNavigate();

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

  // Infinite scroll for mobile
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (value) => {
    handleExerciseGroupPropsUpdate({
      searchQuery: value,
      offset: INITIAL_OFFSET,
    });
  };

  const tabs = [
    { label: 'Exercises', value: 'exercises' },
    { label: 'Anatomy', value: 'anatomy' },
  ];

  return (
    <>
      <MobileTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabs}
        variant={MobileTabVariant.HIDE}
      />

      <div className='flex flex-col lg:flex-row'>
        <ExerciseSection
          activeTab={activeTab}
          muscleGroupName={muscleGroupName}
          exercisesData={exercisesData}
          totalExercises={totalExercises}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={ITEMS_PER_PAGE}
        />

        <AnatomySection
          activeTab={activeTab}
          handleMuscleClick={handleMuscleClick}
          selectedPrimaryMuscle={slugMuscleGroup}
        />
      </div>
    </>
  );
};
