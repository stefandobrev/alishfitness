import { ViewButton } from '../../../components/buttons/EditButtons';

export const PaginationMuscleGroupExercise = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className='flex items-center justify-center gap-4'>
      <ViewButton
        variant='white'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
      >
        <span style={{ transform: 'translateY(-2px)' }}>{'<'}</span>
      </ViewButton>

      <span className='text-gray-700'>Page {currentPage}</span>

      <ViewButton
        variant='white'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
      >
        <span style={{ transform: 'translateY(-2px)' }}>{'>'}</span>
      </ViewButton>
    </div>
  );
};
