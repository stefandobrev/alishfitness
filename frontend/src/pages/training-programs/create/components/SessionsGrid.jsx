import { Controller } from 'react-hook-form';

import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { InputField } from '../../../../components/inputs';
import { classNames } from '../../../../utils/classNames';
import { getLightColors } from '../../../../common/constants';

export const SessionsGrid = ({
  sessions,
  control,
  watch,
  setValue,
  getValues,
  onRemoveSession,
}) => {
  const handleRemoveExercise = (sessionIndex, exerciseIndex) => {
    const currentExercises =
      getValues(`sessions.${sessionIndex}.exercises`) || [];
    setValue(
      `sessions.${sessionIndex}.exercises`,
      currentExercises.filter((_, i) => i !== exerciseIndex),
    );
  };

  const handleAddExercise = (sessionIndex) => {
    const currentExercises =
      getValues(`sessions.${sessionIndex}.exercises`) || [];
    setValue(`sessions.${sessionIndex}.exercises`, [
      ...currentExercises,
      { name: '' },
    ]);
  };

  return (
    <div className='flex flex-wrap gap-2'>
      {sessions?.map((session, index) => (
        <div
          key={session.tempId}
          className='w-full rounded-lg border p-4 shadow-sm lg:w-[calc(50%-0.5rem)]'
        >
          <div className='space-y-3'>
            <div className='flex items-start'>
              <span
                className={classNames(
                  'mr-2 h-20 w-2 rounded',
                  getLightColors(index),
                )}
              ></span>

              <Controller
                name={`sessions.${index}.id`}
                control={control}
                defaultValue={session.id}
                render={({ field }) => (
                  <input {...field} className='hidden h-0 w-0' />
                )}
              />

              <InputField
                label={`Session ${index + 1}`}
                id={`sessions.${index}.title`}
                className='max-w-lg flex-1 bg-white'
              />

              <button onClick={() => onRemoveSession(index)}>
                <XMarkIcon className='hover:text-logored h-5 w-5 cursor-pointer text-gray-400 transition-colors duration-200' />
              </button>
            </div>

            {/* Exercises section */}
            <div className='mt-4'>
              <h4 className='mb-2 text-sm font-medium text-gray-700'>
                Exercises
              </h4>
              <div className='space-y-2'>
                {(watch(`sessions.${index}.exercises`) || []).map(
                  (exercise, exIndex) => (
                    <div
                      key={exIndex}
                      className='rounded border bg-gray-50 p-2'
                    >
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>
                          {exercise.name || `Exercise ${exIndex + 1}`}
                        </span>
                        <button
                          type='button'
                          onClick={() => handleRemoveExercise(index, exIndex)}
                          className='text-logored hover:text-logored-hover'
                        >
                          <XMarkIcon className='h-4 w-4' />
                        </button>
                      </div>
                    </div>
                  ),
                )}

                <button
                  type='button'
                  onClick={() => handleAddExercise(index)}
                  className='flex w-full items-center justify-center rounded border border-dashed border-gray-300 bg-white p-2 text-sm hover:border-gray-400'
                >
                  <PlusIcon className='mr-1 h-4 w-4 text-gray-400' />
                  <span className='text-gray-500'>Add Exercise</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
