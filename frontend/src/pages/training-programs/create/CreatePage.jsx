import { useState, useEffect } from 'react';
import { FormProvider, useForm, Controller, useWatch } from 'react-hook-form';

import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { AddSessionButton } from './components';
import { classNames } from '../../../utils/classNames';
import { DropdownField, InputField } from '../../../components/inputs';
import { useTitle } from '../../../hooks/useTitle.hook';
import { getLightColors } from '../../../common/constants';

export const CreatePage = () => {
  const [schedule, setSchedule] = useState([]);
  const methods = useForm();
  useTitle('Create');

  const sessions = methods.watch('sessions');
  const scheduleOptions =
    sessions?.map((_, index) => {
      return {
        label: `Session ${index + 1}: ${sessions[index].title}`,
        value: index,
      };
    }) || [];

  const selectedSession = useWatch({
    control: methods.control,
    name: 'schedule',
  });

  useEffect(() => {
    if (selectedSession !== null && selectedSession !== undefined) {
      setSchedule((prev) => [...prev, selectedSession]);
    }
  }, [selectedSession]);

  return (
    <FormProvider {...methods}>
      <div className='flex'>
        <div className='w-full px-4 lg:w-[80%]'>
          <h1 className='p-4 text-2xl font-bold md:text-3xl'>
            Create Training Program
          </h1>

          <div className='mb-4 px-4'>
            <div className='w-full max-w-xs'>
              <InputField label='Name' id='name' />
            </div>
          </div>

          {/* Sessions grid */}
          <div className='flex flex-wrap gap-2'>
            {sessions?.map((_, index) => (
              <div
                key={index}
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
                      defaultValue={index}
                      render={({ field }) => (
                        <input {...field} className='hidden h-0 w-0' />
                      )}
                    />

                    <InputField
                      label={`Session ${index + 1}`}
                      id={`sessions.${index}.title`}
                      className='max-w-lg flex-1 bg-white'
                    />

                    <button
                      onClick={() => {
                        const currentSessions =
                          methods.getValues('sessions') || [];
                        methods.setValue(
                          'sessions',
                          currentSessions.filter((_, i) => i !== index),
                        );
                      }}
                      className='hover:text-logored cursor-pointer text-gray-400 transition-colors duration-200'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
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
                                <TrashIcon className='h-4 w-4' />
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

        {/* Schedule section */}
        <div className='min-h-[calc(100vh-108px)] w-full border-l-2 lg:sticky lg:top-25 lg:w-[20%]'>
          <div className='z-40 flex items-end gap-2 px-6 lg:sticky lg:top-25'>
            <div className='w-full'>
              <DropdownField
                label='Schedule'
                id='schedule'
                options={scheduleOptions}
                placeholder='Add session to schedule'
              />
            </div>
          </div>

          <div className='flex flex-col gap-3 px-6 pt-4 lg:sticky lg:top-50'>
            {schedule.length === 0 ? (
              <div className='py-6 text-center text-gray-400 italic'>
                No sessions added to schedule yet
              </div>
            ) : (
              <>
                <h3 className='mb-1 text-sm font-semibold tracking-wider text-gray-500 uppercase'>
                  Session Order
                </h3>
                {schedule.map((sessionId, index) => {
                  const session = sessions.find(
                    (session) => session.id === sessionId,
                  );
                  return (
                    <div
                      key={`${sessionId}-${index}`}
                      className='flex h-full w-full items-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md'
                    >
                      <div
                        className={`w-2 self-stretch ${getLightColors(session.id)}`}
                      ></div>
                      <div className='flex w-full items-center justify-between px-3 py-3'>
                        <div className='flex items-center gap-2'>
                          <p className='font-medium'>{`Session ${session.id + 1}${session.title ? `: ${session.title}` : ''}`}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSchedule((prev) =>
                              prev.filter((_, idx) => idx !== index),
                            );
                          }}
                        >
                          <XMarkIcon className='hover:text-logored h-5 w-5 cursor-pointer text-gray-400 transition-colors duration-200' />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
