import { useState, useEffect, useRef } from 'react';

import { fetchExerciseTitles } from '../helpersManageExercises';
import { EditButton } from '../../../../components/buttons/EditButtons';
import {
  MuscleGroupFilter,
  SortFilter,
  ExerciseListItems,
} from './ExerciseListComponents';
import SearchInput from '../../../../components/inputs/SearchInput';
import Spinner from '../../../../components/Spinner';

const INITIAL_OFFSET = 0;
const ITEMS_PER_PAGE = 10;
const defaultFilters = {
  searchQuery: '',
  sortBy: null,
  offset: INITIAL_OFFSET,
  selectedMuscleGroups: [],
  hasMore: true,
  loadMore: false,
};

export const ExerciseList = ({
  refreshTitlesKey,
  onSelectExercise,
  muscleGroups,
}) => {
  const [exerciseTitles, setExerciseTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [
    { searchQuery, sortBy, offset, selectedMuscleGroups, hasMore, loadMore },
    setExerciseProps,
  ] = useState(defaultFilters);

  const listContainerRef = useRef(null);

  useEffect(() => {
    handleExercisePropsUpdate({
      hasMore: true,
      loadMore: false,
    });
    setIsLoading(true);
    loadExerciseTitles();
  }, [searchQuery, sortBy, selectedMuscleGroups, refreshTitlesKey]);

  useEffect(() => {
    if (hasMore && loadMore) {
      loadExerciseTitles(offset);
    }
  }, [loadMore]);

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        listContainerRef.current.scrollHeight ===
        listContainerRef.current.scrollTop +
          listContainerRef.current.clientHeight;
      if (bottom && hasMore) {
        setExerciseProps((prevState) => ({ ...prevState, loadMore: true }));
      }
    };

    const listContainer = listContainerRef.current;
    listContainer.addEventListener('scroll', handleScroll);

    return () => {
      listContainer.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore]);

  const handleExercisePropsUpdate = (newValues) => {
    setExerciseProps((prevValues) => {
      return {
        ...prevValues,
        ...newValues,
      };
    });
  };

  const loadExerciseTitles = async (offset) => {
    const currentOffset = offset ?? INITIAL_OFFSET;

    const scrollPosition = window.scrollY;

    const exerciseTitlesData = await fetchExerciseTitles({
      offset: currentOffset,
      searchQuery: searchQuery,
      sort: sortBy,
      muscleGroups: selectedMuscleGroups,
    });

    handleExercisePropsUpdate({
      offset: currentOffset + ITEMS_PER_PAGE,
      loadMore: false,
    });

    if (exerciseTitlesData.length < ITEMS_PER_PAGE) {
      handleExercisePropsUpdate({ hasMore: false });
    }

    if (currentOffset === INITIAL_OFFSET) {
      setExerciseTitles(exerciseTitlesData);
    } else if (exerciseTitlesData.length > 0) {
      setExerciseTitles((prevTitles) => [...prevTitles, ...exerciseTitlesData]);
    }

    setIsLoading(false);

    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition);
    });
  };

  const resetFilters = () => {
    handleExercisePropsUpdate(defaultFilters);
  };

  return (
    <>
      <div className='flex w-full flex-col gap-4 rounded-lg bg-white px-6 sm:max-w-sm'>
        <div className='flex items-center justify-between px-2'>
          <h2 className='text-xl font-semibold text-gray-800'>Exercise List</h2>
          <EditButton onClick={resetFilters} variant='grayDark'>
            Reset
          </EditButton>
        </div>
        <SearchInput
          value={searchQuery}
          onChange={(value) =>
            handleExercisePropsUpdate({ searchQuery: value })
          }
          className='max-w-md'
        />
        <MuscleGroupFilter
          muscleGroups={muscleGroups}
          selectedMuscleGroups={selectedMuscleGroups}
          onChange={(value) =>
            handleExercisePropsUpdate({ selectedMuscleGroups: value })
          }
        />
        <SortFilter
          sortBy={sortBy}
          onChange={(value) => handleExercisePropsUpdate({ sortBy: value })}
        />
      </div>
      <div
        ref={listContainerRef}
        className='mt-4 flex max-h-[40vh] w-full flex-col overflow-y-auto rounded-lg bg-white px-6 sm:max-w-sm lg:max-h-[47vh]'
      >
        {isLoading ? (
          <Spinner loading={true} className='min-h-[40vh] lg:min-h-[47vh]' />
        ) : (
          <ExerciseListItems
            exercises={exerciseTitles}
            onSelectExercise={onSelectExercise}
            sortBy={sortBy}
          />
        )}
      </div>
    </>
  );
};
