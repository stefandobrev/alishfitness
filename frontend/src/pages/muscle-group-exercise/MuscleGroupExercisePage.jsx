import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { fetchExercises } from './helpersMuscleGroupExercise';
import { MobileTabs, MobileTabVariant } from '@/components/buttons';
import { ExerciseSection, AnatomySection } from './components';
import { useInfiniteScrollWindow, useTitle } from '@/hooks';
import { isMobile } from '@/common/constants';

const INITIAL_OFFSET = 0;
const ITEMS_PER_PAGE = 6;
const defaultFilters = { searchQuery: '' };
const defaultPagination = {
  offset: INITIAL_OFFSET,
  hasMore: true,
  loadMore: false,
};

export const MuscleGroupExercisePage = () => {
  const { slugMuscleGroup } = useParams();
  const navigate = useNavigate();

  const [exercisesData, setExercisesData] = useState([]);
  const [muscleGroupName, setMuscleGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('exercises');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExercises, setTotalExercises] = useState(0);
  const [filters, setFilters] = useState(defaultFilters);
  const [pagination, setPagination] = useState(defaultPagination);

  useTitle(muscleGroupName);

  useEffect(() => {
    setCurrentPage(1);
    setPagination(defaultPagination);
    loadExercisesData(INITIAL_OFFSET);
  }, [slugMuscleGroup, filters, navigate]);

  useEffect(() => {
    if (pagination.loadMore) {
      loadExercisesData(pagination.offset);
    }
  }, [pagination.loadMore, pagination.offset]);

  // Infinite scroll for window hook
  useInfiniteScrollWindow({ pagination, setPagination });

  const loadExercisesData = async (offset) => {
    const currentOffset = offset ?? INITIAL_OFFSET;
    setIsLoading(true);

    const scrollPosition = window.scrollY;

    try {
      const data = await fetchExercises({
        muscleGroupId: slugMuscleGroup,
        searchQuery: filters.searchQuery,
        itemsPerPage: ITEMS_PER_PAGE,
        offset: currentOffset,
      });

      console.log('data.error:', data.error, typeof data.error);
      if (data.error) {
        navigate('/404', { replace: true });
      }

      setExercisesData((prev) =>
        isMobile
          ? currentOffset === INITIAL_OFFSET
            ? data.exercises
            : [...(prev || []), ...data.exercises]
          : data.exercises,
      );

      const total = data.total_count ?? currentOffset + data.exercises.length;
      setTotalExercises(total);
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));

      setPagination({
        offset: currentOffset + ITEMS_PER_PAGE,
        loadMore: false,
        hasMore: data.exercises.length >= ITEMS_PER_PAGE,
      });

      setMuscleGroupName(data.name);
    } finally {
      setIsLoading(false);
    }

    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition);
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    const newOffset = (newPage - 1) * ITEMS_PER_PAGE;
    setCurrentPage(newPage);
    setPagination((prev) => ({
      ...prev,
      offset: newOffset,
      loadMore: false,
    }));

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
    setFilters((prev) => ({ ...prev, searchQuery: value }));
    setPagination((prev) => ({ ...prev, offset: INITIAL_OFFSET }));
    if (isMobile) {
      window.scrollTo(0, 0);
    }
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
          searchQuery={filters.searchQuery}
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
