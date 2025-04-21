import { Controller, useFormContext } from 'react-hook-form';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ExercisesTable } from './exercises-table';
import { InputField } from '@/components/inputs';
import { classNames } from '@/utils';
import { getLightColors } from '@/common/constants';
import { ActionButton, ButtonVariant } from '@/components/buttons';

export const SessionsGrid = ({ sessions, onRemoveSession }) => {
  const {
    control,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const handleAddExercise = (sessionIndex) => {
    const currentExercises =
      getValues(`sessions.${sessionIndex}.exercises`) || [];
    let newSequence = 'A';
    if (currentExercises.length > 0) {
      const lastSequence =
        currentExercises[currentExercises.length - 1].sequence;
      if (lastSequence.length === 1) {
        newSequence = String.fromCharCode(lastSequence.charCodeAt(0) + 1);
      } else if (/^[A-Z]\d+$/.test(lastSequence)) {
        const letter = lastSequence.charAt(0);
        const number = parseInt(lastSequence.slice(1)) + 1;
        newSequence = `${letter}${number}`;
      }
    }
    setValue(`sessions.${sessionIndex}.exercises`, [
      ...currentExercises,
      {
        sequence: newSequence,
        muscleGroupInput: '',
        exerciseSlug: '',
        sets: '3',
        reps: '',
      },
    ]);
    clearErrors(`sessions.${sessionIndex}.exercises`);
  };

  return (
    <div className='flex flex-wrap gap-[0.4rem] md:justify-between'>
      {sessions?.map((session, sessionIndex) => {
        // Get the exercises errors for this specific session
        const sessionExercisesErrors =
          errors?.sessions?.[sessionIndex]?.exercises;

        return (
          <div
            key={session.tempId}
            className='w-full rounded-lg border p-4 shadow-sm xl:w-[calc(50%-0.2rem)]'
          >
            <div className='space-y-3'>
              <div className='flex items-start'>
                <span
                  className={classNames(
                    'mr-2 h-20 w-2 rounded',
                    getLightColors(sessionIndex),
                  )}
                ></span>
                <Controller
                  name={`sessions.${sessionIndex}.id`}
                  control={control}
                  defaultValue={session.id}
                  render={({ field }) => (
                    <input {...field} className='hidden h-0 w-0' />
                  )}
                />
                <InputField
                  label={`Session ${sessionIndex + 1}`}
                  id={`sessions.${sessionIndex}.sessionTitle`}
                  className='max-w-lg flex-1 bg-white'
                />
                <ActionButton
                  variant={ButtonVariant.BLANK}
                  onClick={() => onRemoveSession(sessionIndex)}
                >
                  <XMarkIcon className='hover:text-logored-hover h-5 w-5 cursor-pointer text-gray-400 transition-colors duration-200' />
                </ActionButton>
              </div>
              {/* Exercises section */}
              <ExercisesTable sessionIndex={sessionIndex} session={session} />
            </div>

            {sessionExercisesErrors && (
              <p className='mt-1 text-sm text-red-500'>
                {errors?.sessions?.[sessionIndex]?.exercises?.sequence
                  ?.message || 'All fields are required.'}
              </p>
            )}

            <div className='mt-3'>
              <ActionButton
                onClick={() => handleAddExercise(sessionIndex)}
                variant={ButtonVariant.BLANK}
                className='flex w-full cursor-pointer items-center justify-center rounded border border-dashed border-gray-300 bg-white p-2 text-sm hover:border-gray-400'
              >
                <PlusIcon className='mr-1 h-4 w-4 text-gray-400' />
                <span className='text-gray-500'>Add exercise</span>
              </ActionButton>
            </div>
          </div>
        );
      })}
    </div>
  );
};
