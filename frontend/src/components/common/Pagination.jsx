import { ActionButton, ButtonVariant } from '@/components/buttons';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className='flex items-center justify-center gap-4'>
      <ActionButton
        variant={ButtonVariant.WHITE}
        onClick={() => onPageChange(1)}
        disabled={isFirstPage}
      >
        <span style={{ transform: 'translateY(-2px)' }}>{'<<'}</span>
      </ActionButton>
      <ActionButton
        variant={ButtonVariant.WHITE}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
      >
        <span style={{ transform: 'translateY(-2px)' }}>{'<'}</span>
      </ActionButton>

      <span className='text-gray-700'>
        Page {currentPage} of {totalPages}
      </span>

      <ActionButton
        variant={ButtonVariant.WHITE}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
      >
        <span style={{ transform: 'translateY(-2px)' }}>{'>'}</span>
      </ActionButton>
      <ActionButton
        variant={ButtonVariant.WHITE}
        onClick={() => onPageChange(totalPages)}
        disabled={isLastPage}
      >
        <span style={{ transform: 'translateY(-2px)' }}>{'>>'}</span>
      </ActionButton>
    </div>
  );
};
