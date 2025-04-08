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
      {mode === 'add' ? (
        <AddForm
          muscleGroups={muscleGroups}
          submittedNewExerciseData={submittedNewExerciseData}
          isLoading={isLoading}
          message={message}
        />
      ) : (
        <EditForm
          muscleGroups={muscleGroups}
          submittedEditExerciseData={submittedEditExerciseData}
          exerciseData={exerciseData}
          isLoading={isLoading}
          mode={mode}
          launchAddMode={onAddNew}
          handleDeleteConfirm={handleDeleteConfirm}
          message={message}
        />
      )}
    </div>
  );
};
