import { useFormContext, Controller } from 'react-hook-form';

import { XMarkIcon } from '@heroicons/react/24/outline';

import { ActionButton, ButtonVariant } from '../../../../../components/buttons';
import {
  MuscleGroupSelect,
  ExerciseSelect,
  SequenceInput,
  SetsInput,
  RepsInput,
} from './';

export const ExerciseRow = ({
  sessionIndex,
  exerciseIndex,
  muscleGroups,
  exerciseOptions,
  onRemove,
}) => {
  const { getValues, control, setValue } = useFormContext();

  return (
    <tr>
      <td className='border p-2'>
        <Controller
          name={`sessions.${sessionIndex}.exercises.${exerciseIndex}.sequence`}
          control={control}
          render={({ field }) => <SequenceInput field={field} />}
        />
      </td>
      <td className='border p-2'>
        <Controller
          name={`sessions.${sessionIndex}.exercises.${exerciseIndex}.muscleGroup`}
          control={control}
          render={({ field }) => (
            <MuscleGroupSelect
              field={field}
              options={muscleGroups}
              onChange={(selected) => {
                field.onChange(selected?.value ?? null);
                // Reset exercise when muscle group changes
                setValue(
                  `sessions.${sessionIndex}.exercises.${exerciseIndex}.slug`,
                  null,
                );
              }}
            />
          )}
        />
      </td>
      <td className='border p-2'>
        <Controller
          name={`sessions.${sessionIndex}.exercises.${exerciseIndex}.slug`}
          control={control}
          render={({ field }) => (
            <ExerciseSelect
              field={field}
              options={exerciseOptions}
              isDisabled={
                !getValues(
                  `sessions.${sessionIndex}.exercises.${exerciseIndex}.muscleGroup`,
                )
              }
            />
          )}
        />
      </td>
      <td className='border p-2'>
        <Controller
          name={`sessions.${sessionIndex}.exercises.${exerciseIndex}.sets`}
          control={control}
          render={({ field }) => <SetsInput field={field} />}
        />
      </td>
      <td className='border p-2'>
        <Controller
          name={`sessions.${sessionIndex}.exercises.${exerciseIndex}.reps`}
          control={control}
          render={({ field }) => <RepsInput field={field} />}
        />
      </td>
      <td className='border p-2'>
        <ActionButton
          variant={ButtonVariant.BLANK}
          onClick={() => onRemove(sessionIndex, exerciseIndex)}
          className='text-logored hover:text-logored-hover cursor-pointer'
        >
          <XMarkIcon className='mt-1 h-5 w-5' />
        </ActionButton>
      </td>
    </tr>
  );
};
