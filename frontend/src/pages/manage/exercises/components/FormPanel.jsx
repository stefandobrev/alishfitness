import { Spinner } from '@/components/common';
import { AddForm, EditForm } from '../forms';

export const FormPanel = ({
  activeTab,
  mode,
  isLoading,
  muscleGroups,
  exerciseData,
  onAddNew,
  submittedNewExerciseData,
  submittedEditExerciseData,
  handleDeleteConfirm,
  message,
}) => {
  return (
    <div
      className={`flex w-full justify-center bg-white p-5 lg:w-1/2 ${
        activeTab !== 'form' ? 'hidden lg:flex' : ''
      }`}
    >
      {isLoading ? (
        <Spinner loading={isLoading} className='min-h-[70vh]' />
      ) : mode === 'add' ? (
        <AddForm
          muscleGroups={muscleGroups}
          submittedNewExerciseData={submittedNewExerciseData}
          message={message}
        />
      ) : (
        <EditForm
          muscleGroups={muscleGroups}
          submittedEditExerciseData={submittedEditExerciseData}
          exerciseData={exerciseData}
          mode={mode}
          launchAddMode={onAddNew}
          handleDeleteConfirm={handleDeleteConfirm}
          message={message}
        />
      )}
    </div>
  );
};
