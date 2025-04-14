import { useFormContext, Controller } from 'react-hook-form';

import { XMarkIcon } from '@heroicons/react/24/outline';

import { ActionButton, ButtonVariant } from '@/components/buttons';
import {
  MuscleGroupSelect,
  ExerciseSelect,
  SequenceInput,
  SetsInput,
  RepsInput,
  CustomInput,
} from './';

export const ExerciseMobileRow = ({
  sessionIndex,
  exerciseIndex,
  muscleGroups,
  exerciseOptions,
  onRemove,
}) => {
  const { getValues, control, setValue } = useFormContext();

  return (
    <div className='space-y-3 rounded-md border bg-white p-4'>
      <div className='flex items-center justify-between border p-2'>
        {/* Sequence */}
        <div className='flex w-[30%] flex-col space-y-1'>
          <label className='text-m font-bold text-gray-800'>Sequence</label>
          <Controller
            name={`sessions.${sessionIndex}.exercises.${exerciseIndex}.sequence`}
            control={control}
            render={({ field }) => (
              <SequenceInput field={field} sessionIndex={sessionIndex} />
            )}
          />
        </div>

        <ActionButton
          variant={ButtonVariant.BLANK}
          onClick={() => onRemove(sessionIndex, exerciseIndex)}
          className='hover:text-logored-hover cursor-pointer text-gray-400'
        >
          <XMarkIcon className='mr-3 h-5 w-5' />
        </ActionButton>
      </div>

      <div className='grid grid-cols-1 gap-3'>
        {/* Muscle Group */}
        <div className='flex flex-col space-y-1 border p-2'>
          <label className='text-m font-bold text-gray-800'>Muscle Group</label>
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
        </div>

        {/* Exercise */}
        <div className='flex flex-col space-y-1 border p-2'>
          <label className='text-m font-bold text-gray-800'>Exercise</label>
          <Controller
            name={`sessions.${sessionIndex}.exercises.${exerciseIndex}.slug`}
            control={control}
            render={({ field }) => {
              const muscleGroupValue = getValues(
                `sessions.${sessionIndex}.exercises.${exerciseIndex}.muscleGroup`,
              );

              if (muscleGroupValue === 'custom') {
                return <CustomInput field={field} />;
              } else {
                return (
                  <ExerciseSelect
                    field={field}
                    options={exerciseOptions}
                    isDisabled={!muscleGroupValue}
                  />
                );
              }
            }}
          />
        </div>

        {/* Sets and Reps Row */}
        <div className='grid grid-cols-2 gap-3'>
          <div className='flex flex-col space-y-1'>
            <label className='text-m font-bold text-gray-800'>Sets</label>
            <Controller
              name={`sessions.${sessionIndex}.exercises.${exerciseIndex}.sets`}
              control={control}
              render={({ field }) => <SetsInput field={field} />}
            />
          </div>
          <div className='flex flex-col space-y-1'>
            <label className='text-m font-bold text-gray-800'>Reps</label>
            <Controller
              name={`sessions.${sessionIndex}.exercises.${exerciseIndex}.reps`}
              control={control}
              render={({ field }) => <RepsInput field={field} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
