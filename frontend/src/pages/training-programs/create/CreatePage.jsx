import { FormProvider, useForm, Controller } from 'react-hook-form';

import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { AddSessionButton, Schedule } from './components';
import { classNames } from '../../../utils/classNames';
import { InputField } from '../../../components/inputs';
import { useTitle } from '../../../hooks/useTitle.hook';
import { getLightColors } from '../../../common/constants';

export const CreatePage = () => {
  const methods = useForm();
  useTitle('Create');

  const sessions = methods.watch('sessions');

  const handleRemoveSession = (index) => {
    const currentSessions = methods.getValues('sessions') || [];
    const newSessions = currentSessions.filter((_, i) => i !== index);

    methods.setValue('sessions', newSessions);
    methods.reset({ ...methods.getValues(), sessions: newSessions });
  };

  return (
    <FormProvider {...methods}>
      <div className='flex'>
        <div className='w-full px-4 lg:w-[80%]'>
          <h1 className='p-4 text-2xl font-bold md:text-3xl'>
            Create Training Program
          </h1>

          <div className='mb-4 px-4'>
            <div className='w-full max-w-xs'>
              <InputField label='Name' id='programName' />
            </div>
          </div>

          {/* Sessions grid */}
          <div className='flex flex-wrap gap-2'>
            {sessions?.map((session, index) => (
              <div
                key={session.tempId}
                className='w-full rounded-lg border p-4 shadow-sm sm:w-[calc(50%-0.5rem)]'
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
                      control={methods.control}
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

                    <button onClick={() => handleRemoveSession(index)}>
                      <XMarkIcon className='hover:text-logored h-5 w-5 cursor-pointer text-gray-400 transition-colors duration-200' />
                    </button>
                  </div>

                  {/* Exercises section */}
                  <div className='mt-4'>
                    <h4 className='mb-2 text-sm font-medium text-gray-700'>
                      Exercises
                    </h4>
                    <div className='space-y-2'>
                      {(methods.watch(`sessions.${index}.exercises`) || []).map(
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
                                onClick={() => {
                                  const currentExercises =
                                    methods.getValues(
                                      `sessions.${index}.exercises`,
                                    ) || [];
                                  methods.setValue(
                                    `sessions.${index}.exercises`,
                                    currentExercises.filter(
                                      (_, i) => i !== exIndex,
                                    ),
                                  );
                                }}
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
                        onClick={() => {
                          const currentExercises =
                            methods.getValues(`sessions.${index}.exercises`) ||
                            [];
                          methods.setValue(`sessions.${index}.exercises`, [
                            ...currentExercises,
                            { name: '' },
                          ]);
                        }}
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

          <AddSessionButton />
        </div>

        <Schedule
          sessions={sessions}
          control={methods.control}
          setValue={methods.setValue}
        />
      </div>
    </FormProvider>
  );
};
