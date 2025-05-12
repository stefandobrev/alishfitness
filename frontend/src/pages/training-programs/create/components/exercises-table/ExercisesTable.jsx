import { useFormContext } from 'react-hook-form';

import { useTrainingSetupData } from '../../hooks';
import { ExerciseRow, ExerciseMobileRow } from './';
import { TableHeadings } from '@/components/table';
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

  const tableHeadings = [
    { title: 'Seq' },
    { title: 'Muscle Group' },
    { title: 'Exercise' },
    { title: 'Sets' },
    { title: 'Reps' },
    { title: '' },
  ];

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
    <div className='overflow-x-auto border border-gray-200 text-center'>
      <table className='w-full border-separate overflow-hidden border'>
        <TableHeadings tableHeadings={tableHeadings} />

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
