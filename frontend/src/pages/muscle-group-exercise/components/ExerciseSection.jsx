import { useScrollVisibility } from '@/hooks';
import { Heading, MuscleGrid } from './';
import { NoDataDiv, Pagination, Spinner } from '@/components/common';

export const ExerciseSection = ({
  activeTab,
  muscleGroupName,
  exercisesData,
  totalExercises,
  searchQuery,
  onSearchChange,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
}) => {
  const isHeaderVisible = useScrollVisibility();

  return (
    <div
      className={`flex w-full flex-col gap-4 lg:w-[75%] ${
        activeTab !== 'exercises' ? 'hidden lg:flex' : ''
      }`}
    >
      <StickyHeader
        isVisible={isHeaderVisible}
        muscleGroupName={muscleGroupName}
        exercisesData={exercisesData}
        totalExercises={totalExercises}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      {isLoading && !exercisesData.length ? (
        <Spinner loading={isLoading} className='min-h-[70vh]' />
      ) : (
        <>
          <ExerciseContent
            exercisesData={exercisesData}
            totalExercises={totalExercises}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            itemsPerPage={itemsPerPage}
          />

          {!isLoading && exercisesData.length === 0 && (
            <NoDataDiv heading='No exercises found' />
          )}

          {/* Infinite scroll spinner for mobile */}
          {isLoading && exercisesData.length > 0 && (
            <div className='md:hidden'>
              <Spinner loading={isLoading} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

const StickyHeader = ({
  isVisible,
  muscleGroupName,
  exercisesData,
  totalExercises,
  searchQuery,
  onSearchChange,
}) => (
  <div
    className={`transition-transform duration-500 ease-in-out ${
      isVisible
        ? 'sticky top-36 translate-y-0 opacity-100'
        : 'relative -translate-y-full opacity-0'
    } z-30 bg-white pb-2 lg:static lg:bg-transparent lg:pb-0`}
  >
    <Heading
      muscleGroupName={muscleGroupName}
      exercisesData={exercisesData}
      totalExercises={totalExercises}
      valueSearch={searchQuery}
      onSearchChange={onSearchChange}
    />
  </div>
);

const ExerciseContent = ({
  exercisesData,
  totalExercises,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
}) => (
  <div className='h-auto rounded-xl border border-gray-100 bg-gray-50 pb-2 shadow-sm'>
    <MuscleGrid exercisesData={exercisesData} />

    {totalExercises > itemsPerPage && (
      <div className='mt-2 hidden lg:block'>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    )}
  </div>
);
