import { useState, useEffect, useRef } from 'react';

import { fetchExerciseTitles } from '../helpersManageExercises';
import { ActionButton, ButtonVariant } from '@/components/buttons';
import { ExerciseListItems } from './';
import { SearchInput, SelectFilter } from '@/components/inputs';
import { Spinner } from '@/components/common';

const INITIAL_OFFSET = 0;
const ITEMS_PER_PAGE = 10;
const defaultFilters = {
  searchQuery: '',
  sortBy: null,
  selectedMuscleGroups: [],
};
const defaultPagination = {
  offset: INITIAL_OFFSET,
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
  const [filters, setFilters] = useState(defaultFilters);
  const [pagination, setPagination] = useState(defaultPagination);

  const listContainerRef = useRef(null);

  useEffect(() => {
    setPagination({
      ...pagination,
      offset: INITIAL_OFFSET,
      hasMore: true,
      loadMore: false,
    });
    loadExerciseTitles();
  }, [filters, refreshTitlesKey]);

  useEffect(() => {
    if (pagination.loadMore) {
      loadExerciseTitles(pagination.offset);
    }
  }, [pagination.loadMore, pagination.offset]);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 200;
      const atBottom =
        listContainerRef.current.scrollHeight - // container height with hidden content
          listContainerRef.current.scrollTop - // distance from top of container to visible area
          listContainerRef.current.clientHeight <= // visible container
        threshold;
      if (atBottom && pagination.hasMore) {
        setPagination((prev) => ({ ...prev, loadMore: true }));
      }
    };

    const listContainer = listContainerRef.current;
    listContainer.addEventListener('scroll', handleScroll);

    return () => {
      listContainer.removeEventListener('scroll', handleScroll);
    };
  }, [pagination.hasMore, pagination.loadMore]);

  const loadExerciseTitles = async (offset) => {
    const currentOffset = offset ?? INITIAL_OFFSET;

    setIsLoading(true);
    try {
      const exerciseTitlesData = await fetchExerciseTitles({
        searchQuery: filters.searchQuery,
        sort: filters.sortBy,
        muscleGroups: filters.selectedMuscleGroups,
        offset: currentOffset,
        itemsPerPage: ITEMS_PER_PAGE,
      });

      setPagination((prev) => ({
        ...prev,
        offset: currentOffset + ITEMS_PER_PAGE,
        loadMore: false,
        hasMore: exerciseTitlesData.length === ITEMS_PER_PAGE,
      }));

      if (currentOffset === INITIAL_OFFSET) {
        setExerciseTitles(exerciseTitlesData);
        // Reset scroll position when filters change or on initial load
        if (listContainerRef.current) {
          listContainerRef.current.scrollTop = 0;
        }
      } else if (exerciseTitlesData.length > 0) {
        setExerciseTitles((prevTitles) => [
          ...prevTitles,
          ...exerciseTitlesData,
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setPagination(defaultPagination);
  };

  return (
    <>
      <div className='flex w-full flex-col gap-4 px-6 sm:max-w-sm'>
        <div className='flex items-center justify-between px-2'>
          <h2 className='text-xl font-semibold text-gray-800'>Exercise List</h2>
          <ActionButton
            onClick={resetFilters}
            variant={ButtonVariant.GRAY_DARK}
          >
            Reset
          </ActionButton>
        </div>
        <SearchInput
          value={filters.searchQuery}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, searchQuery: value }))
          }
          placeholder='Search exercise'
          className='max-w-md'
        />
        <SelectFilter
          label='Filter by muscle groups'
          placeholder='Select muscle groups'
          optionsData={muscleGroups}
          isMulti={true}
          onChange={(selectedOptions) => {
            const muscleGroupValues = selectedOptions
              ? selectedOptions.map((opt) => opt.value)
              : [];
            setFilters((prev) => ({
              ...prev,
              selectedMuscleGroups: muscleGroupValues,
            }));
          }}
          value={muscleGroups.filter((group) =>
            filters.selectedMuscleGroups.includes(group.value),
          )}
        />
        <SelectFilter
          label='Sort by'
          placeholder='Sort by date'
          optionsData={[
            { label: 'Last created', value: 'created_at' },
            { label: 'Last edited', value: 'updated_at' },
          ]}
          onChange={(selectedOption) => {
            const sortByValue = selectedOption ? selectedOption.value : null;
            setFilters((prev) => ({ ...prev, sortBy: sortByValue }));
          }}
          value={
            filters.sortBy
              ? {
                  label:
                    filters.sortBy === 'created_at'
                      ? 'Last Created'
                      : 'Last Edited',
                  value: filters.sortBy,
                }
              : null
          }
        />
      </div>
      <div
        ref={listContainerRef}
        className='mt-4 flex max-h-[40vh] w-full flex-col overflow-y-auto rounded-lg bg-white px-6 sm:max-w-sm lg:max-h-[47vh]'
      >
        <>
          {exerciseTitles.length > 0 ? (
            <ExerciseListItems
              exercises={exerciseTitles}
              onSelectExercise={onSelectExercise}
              sortBy={filters.sortBy}
            />
          ) : (
            !isLoading && (
              <div className='flex min-h-[20vh] items-center justify-center'>
                <p className='text-gray-500'>No exercises found</p>
              </div>
            )
          )}

          {isLoading && (
            <div className='flex h-[60vh] justify-center py-2'>
              <Spinner
                loading={isLoading}
                size={exerciseTitles.length === 0 ? 'medium' : 'small'}
              />
            </div>
          )}
        </>
      </div>
    </>
  );
};
