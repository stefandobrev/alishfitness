import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { DefaultForm } from './';
import { ActionButton } from '@/components/buttons';
import { getChangedFields } from '@/utils';
import { DeleteConfirmation } from '../components/DeleteConfirmation';
import { Spinner } from '@/components/common';

export const EditForm = ({
  muscleGroups,
  exerciseData,
  isLoading,
  mode,
  launchAddMode,
  submittedEditExerciseData,
  handleDeleteConfirm,
  message,
}) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { watch } = useFormContext();

  useEffect(() => {
    if (!exerciseData) return;

    const formValues = watch();
    const changedData = getChangedFields(exerciseData, formValues);
    setHasChanges(Object.keys(changedData).length > 0);
  }, [watch(), exerciseData]);

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleView = () => {
    navigate(`/exercises/${exerciseData.primary_group}/${exerciseData.slug}`);
  };

  const editFormTitle = (
    <div className='flex items-center justify-between px-2'>
      <h2 className='sticky top-0 z-10 mb-3 bg-white text-center text-2xl font-semibold'>
        Edit Exercise
      </h2>
      <ActionButton onClick={launchAddMode}>Add new exercise</ActionButton>
    </div>
  );

  return (
    <>
      {isLoading ? (
        <Spinner loading={isLoading} className='min-h-[70vh]' />
      ) : (
        <DefaultForm
          submittedExerciseData={submittedEditExerciseData}
          muscleGroups={muscleGroups}
          message={message}
          mode={mode}
          title={editFormTitle}
          exerciseData={exerciseData}
          hasChanges={hasChanges}
          handleDeleteButton={handleDelete}
          handleViewButton={handleView}
        />
      )}

      {isDeleteDialogOpen && (
        <DeleteConfirmation
          onConfirm={handleDeleteConfirm}
          onClose={() => setIsDeleteDialogOpen(false)}
          title={exerciseData.title}
        />
      )}
    </>
  );
};
export default EditForm;
