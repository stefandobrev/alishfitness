import { useFormContext } from 'react-hook-form';

import { useTrainingSetupData } from '../../hooks';
import { ExerciseRow, ExerciseMobileRow } from './';
import { TableColumns } from '@/components/table';
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

  const tableColumns = [
    { id: 'sequence', title: 'Seq', width: 'w-[10px]' },
    { id: 'muscleGroup', title: 'Muscle Group', width: 'min-w-[150px]' },
    { id: 'exercise', title: 'Exercise', width: 'min-w-[150px]' },
    { id: 'sets', title: 'Sets', width: 'w-[10px]' },
    { id: 'reps', title: 'Reps', width: 'w-[30px]' },
    { id: 'action', title: '', width: 'w-[5px]' },
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
        <TableColumns tableColumns={tableColumns} />

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
