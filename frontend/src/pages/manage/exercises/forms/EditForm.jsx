import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  saveExercise,
  fetchExerciseData,
  deleteExercise,
} from '../helpersManageExercises';
import { EditButton } from '../../../../components/buttons/EditButtons';
import { DefaultForm } from './DefaultForm';
import { DeleteConfirmation } from '../components/DeleteConfirmation';
import Spinner from '../../../../components/Spinner';

const EditForm = ({
  muscleGroups,
  exerciseId,
  onExerciseUpdated,
  mode,
  launchAddMode,
  handleAddButtonClick,
}) => {
  const [message, setMessage] = useState('');
  const [exerciseData, setExerciseData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { watch } = useFormContext();

  useEffect(() => {
    setIsLoading(true);

    const loadExerciseData = async () => {
      const data = await fetchExerciseData(exerciseId);
      setExerciseData(data);
      setIsLoading(false);
    };

    loadExerciseData();
  }, [exerciseId]);

  const getChangedFields = (initData, updatedData) => {
    const changedFields = {};
    for (const key in initData) {
      if (Array.isArray(initData[key]) && Array.isArray(updatedData[key])) {
        if (
          initData[key].length !== updatedData[key].length ||
          !initData[key].every((val, index) => val === updatedData[key][index])
        ) {
          changedFields[key] = updatedData[key];
        }
      } else if (initData[key] !== updatedData[key]) {
        changedFields[key] = updatedData[key];
      }
    }
    return changedFields;
  };

  useEffect(() => {
    if (!exerciseData) return;

    const formValues = watch();
    const changedData = getChangedFields(exerciseData, formValues);
    setHasChanges(Object.keys(changedData).length > 0);
  }, [watch(), exerciseData]);

  const onSubmit = async (submittedExerciseData) => {
    const changedData = getChangedFields(exerciseData, submittedExerciseData);
    const response = await saveExercise(changedData, exerciseId);
    const { type, text } = response;

    if (type === 'error') {
      toast.error(text);
      setMessage({ type, text });
      return;
    }

    if (type === 'success') {
      toast.success(text);
      onExerciseUpdated();
      setMessage(null);

      const updatedData = await fetchExerciseData(exerciseId);
      setExerciseData(updatedData);
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleView = () => {
    navigate(`/exercises/${exerciseData.primary_group}/${exerciseData.slug}`);
  };

  const handleDeleteConfirm = async () => {
    const response = await deleteExercise(exerciseId);
    const { type, text } = response;

    if (type === 'error') {
      toast.error(text);
      setMessage({ type, text });
      return;
    }

    if (type === 'success') {
      toast.success(text);
      onExerciseUpdated();
      launchAddMode();
    }
  };

  const editFormTitle = (
    <div className='flex items-center justify-between px-2'>
      <h2 className='sticky top-0 z-10 mb-3 bg-white text-center text-2xl font-semibold'>
        Edit Exercise
      </h2>
      <EditButton onClick={handleAddButtonClick}>Add New Exercise</EditButton>
    </div>
  );

  return (
    <>
      {isLoading ? (
        <Spinner loading={isLoading} className='min-h-[70vh]' />
      ) : (
        <DefaultForm
          submittedExerciseData={onSubmit}
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
