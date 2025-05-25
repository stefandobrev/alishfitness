import { useState, useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { DefaultForm } from './';
import { ActionButton } from '@/components/buttons';
import { ConfirmationModal } from '@/components/common';
import { getChangedFields } from '@/utils';

export const EditForm = ({
  muscleGroups,
  exerciseData,
  mode,
  launchAddMode,
  submittedEditExerciseData,
  handleDeleteConfirm,
  message,
}) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Compares initially loaded data with potential edits
  const formValues = useWatch();

  useEffect(() => {
    if (!exerciseData) return;

    const changedData = getChangedFields(exerciseData, formValues);
    setHasChanges(Object.keys(changedData).length > 0);
  }, [formValues, exerciseData]);

  // Delete dialog opener
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  // View edit
  const handleView = () => {
    navigate(`/exercises/${exerciseData.primaryGroup}/${exerciseData.slug}`);
  };

  // Title of the page + add new exercise button
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

      {isDeleteDialogOpen && (
        <ConfirmationModal
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          heading={`Delete exercise: ${exerciseData.title}`}
          message='Are you sure you want to delete the exercise?'
          confirmText='Delete'
        />
      )}
    </>
  );
};
export default EditForm;
