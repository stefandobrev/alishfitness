import { ViewButton } from '../../components/buttons/EditButtons';

const PaginationMuscleGroupExercise = ({
  ITEMS_PER_PAGE,
  currentPage,
  totalPages,
  totalExercises,
  onPageChange,
}) => {
  if (totalExercises <= ITEMS_PER_PAGE) {
    return null;
  }

  return (
    <div className='hidden gap-4 lg:flex lg:items-center lg:justify-center'>
      {currentPage > 1 && (
        <ViewButton
          variant='white'
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </ViewButton>
      )}

      <span className='text-gray-700'>Page {currentPage}</span>

      {currentPage < totalPages && (
        <ViewButton
          variant='white'
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </ViewButton>
      )}
    </div>
  );
};

export default PaginationMuscleGroupExercise;
