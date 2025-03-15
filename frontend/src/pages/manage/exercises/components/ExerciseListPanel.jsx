import { ExerciseList } from './';

export const ExerciseListPanel = ({
  activeTab,
  refreshTitlesKey,
  muscleGroups,
  onSelectExercise,
}) => {
  return (
    <div
      className={`flex w-full flex-col items-center p-4 lg:w-1/4 ${
        activeTab !== 'exercise' ? 'hidden lg:block' : ''
      }`}
    >
      <ExerciseList
        refreshTitlesKey={refreshTitlesKey}
        onSelectExercise={onSelectExercise}
        muscleGroups={muscleGroups}
      />
    </div>
  );
};
