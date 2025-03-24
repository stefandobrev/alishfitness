import { ActionButton } from '../../../../components/buttons';

// For large screens - all buttons in one row, not sticky
export const MdScreenButtons = ({
  mode,
  hasChanges,
  areUrlsInvalid,
  handleDeleteButton,
  handleViewButton,
}) => (
  <div className='mt-4 flex flex-row justify-center gap-2 bg-white py-2'>
    <ActionButton
      disabled={
        mode === 'edit' ? !hasChanges || areUrlsInvalid : areUrlsInvalid
      }
      form='exercise-form'
      className='w-auto'
    >
      {mode === 'add' ? 'Add Exercise' : 'Edit Exercise'}
    </ActionButton>

    {mode === 'edit' && (
      <>
        <ActionButton
          onClick={handleDeleteButton}
          variant='grayDark'
          className='w-auto'
        >
          Delete Exercise
        </ActionButton>
        <ActionButton
          onClick={handleViewButton}
          variant='grayDark'
          className='w-auto'
        >
          View Exercise
        </ActionButton>
      </>
    )}
  </div>
);

// For small screens - Layout differs
export const SmScreenButtons = ({
  mode,
  hasChanges,
  areUrlsInvalid,
  handleDeleteButton,
  handleViewButton,
}) => (
  <>
    {/* Sticky Save/Add button */}
    <div className='sticky bottom-0 z-10 mt-2 flex justify-center border-t border-gray-200 bg-white py-2'>
      <ActionButton
        disabled={
          mode === 'edit' ? !hasChanges || areUrlsInvalid : areUrlsInvalid
        }
        form='exercise-form'
        className='w-full'
      >
        {mode === 'add' ? 'Add Exercise' : 'Edit Exercise'}
      </ActionButton>
    </div>

    {/* Non-sticky Delete and View buttons */}
    {mode === 'edit' && (
      <div className='flex justify-center gap-2 bg-white py-2'>
        <ActionButton
          onClick={handleDeleteButton}
          variant='grayDark'
          className='w-full'
        >
          Delete Exercise
        </ActionButton>
        <ActionButton
          onClick={handleViewButton}
          variant='grayDark'
          className='w-full'
        >
          View Exercise
        </ActionButton>
      </div>
    )}
  </>
);
