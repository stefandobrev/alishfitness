import { useFormContext } from 'react-hook-form';

import { useMuscleGroupsAndExercises } from './hooks/useMuscleGroupsAndExercises ';
import { ExerciseRow, ExerciseMobileRow } from './';
import { isMobile } from '../../../../../common/constants';

export const ExercisesTable = ({ sessionIndex, session }) => {
  const { setValue, getValues } = useFormContext();
  const { muscleGroups, getExerciseOptionsForMuscleGroup } =
    useMuscleGroupsAndExercises();

  const handleRemoveExercise = (sessionIndex, exerciseIndex) => {
    const currentExercises =
      getValues(`sessions.${sessionIndex}.exercises`) || [];
    setValue(
      `sessions.${sessionIndex}.exercises`,
      currentExercises.filter((_, i) => i !== exerciseIndex),
    );
  };

  if (isMobile) {
    return (
      <div className='space-y-4'>
        {session.exercises.map((exercise, exerciseIndex) => {
          const exerciseOptions = getExerciseOptionsForMuscleGroup(
            getValues(
              `sessions.${sessionIndex}.exercises.${exerciseIndex}.muscleGroup`,
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
    );
  }

  return (
    <div className='overflow-x-auto text-center'>
      <table className='w-full border-separate overflow-hidden border'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='border p-2 text-center'>Seq</th>
            <th className='border p-2 text-center'>Muscle Group</th>
            <th className='border p-2 text-center'>Exercise</th>
            <th className='border p-2 text-center'>Sets</th>
            <th className='border p-2 text-center'>Reps</th>
            <th className='border p-2 text-center'></th>
          </tr>
        </thead>

        <tbody>
          {session.exercises.map((exercise, exerciseIndex) => {
            const exerciseOptions = getExerciseOptionsForMuscleGroup(
              getValues(
                `sessions.${sessionIndex}.exercises.${exerciseIndex}.muscleGroup`,
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
