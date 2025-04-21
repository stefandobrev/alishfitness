import { useFormContext } from 'react-hook-form';

import { TableHeadLg, useTrainingSetupData } from './';
import { ExerciseRow, ExerciseMobileRow } from './';
import { isMobile } from '@/common/constants';

export const ExercisesTable = ({ sessionIndex, session }) => {
  const { setValue, getValues, trigger } = useFormContext();
  const { muscleGroups, getExerciseOptionsForMuscleGroup } =
    useTrainingSetupData();

  const handleRemoveExercise = (sessionIndex, exerciseIndex) => {
    const currentExercises =
      getValues(`sessions.${sessionIndex}.exercises`) || [];
    setValue(
      `sessions.${sessionIndex}.exercises`,
      currentExercises.filter((_, i) => i !== exerciseIndex),
    );

    trigger(`sessions.${sessionIndex}.exercises`);
  };

  return isMobile ? (
    <div className='space-y-4'>
      {session.exercises.map((exercise, exerciseIndex) => {
        const exerciseOptions = getExerciseOptionsForMuscleGroup(
          getValues(
            `sessions.${sessionIndex}.exercises.${exerciseIndex}.muscleGroupInput`,
          ),
        );

        return (
          <ExerciseMobileRow
            key={exerciseIndex}
            sessionIndex={sessionIndex}
            exerciseIndex={exerciseIndex}
            muscleGroups={muscleGroups}
            exerciseOptions={exerciseOptions}
            onRemove={handleRemoveExercise}
          />
        );
      })}
    </div>
  ) : (
    <div className='overflow-x-auto text-center'>
      <table className='w-full border-separate overflow-hidden border'>
        <TableHeadLg />

        <tbody>
          {session.exercises.map((exercise, exerciseIndex) => {
            const exerciseOptions = getExerciseOptionsForMuscleGroup(
              getValues(
                `sessions.${sessionIndex}.exercises.${exerciseIndex}.muscleGroupInput`,
              ),
            );

            return (
              <ExerciseRow
                key={exerciseIndex}
                sessionIndex={sessionIndex}
                exerciseIndex={exerciseIndex}
                muscleGroups={muscleGroups}
                exerciseOptions={exerciseOptions}
                onRemove={handleRemoveExercise}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
