import { AddForm, EditForm } from '../forms';

export const FormPanel = ({
  activeTab,
  mode,
  muscleGroups,
  selectedExercise,
  onExerciseChange,
  onAddNew,
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
          onExerciseAdded={onExerciseChange}
        />
      ) : (
        <EditForm
          muscleGroups={muscleGroups}
          exerciseId={selectedExercise}
          onExerciseUpdated={onExerciseChange}
          mode={mode}
          launchAddMode={onAddNew}
        />
      )}
    </div>
  );
};
