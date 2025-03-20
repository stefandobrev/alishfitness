import { FormProvider, useForm } from 'react-hook-form';

import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

import { classNames } from '../../../utils/classNames';

import { InputField } from '../../../components/inputs';
import { useTitle } from '../../../hooks/useTitle.hook';

const getLightColors = (index) => {
  const bgColors = [
    'bg-red-300',
    'bg-yellow-300',
    'bg-green-300',
    'bg-blue-300',
    'bg-orange-300',
    'bg-purple-300',
    'bg-teal-300',
    'bg-pink-300',
    'bg-brown-300',
    'bg-gray-300',
  ];
  return bgColors[index];
};

export const CreatePage = () => {
  const methods = useForm();
  useTitle('Create');
  return (
    <div className='flex flex-col'>
      <h1 className='flex justify-center p-4 text-2xl font-bold md:text-3xl'>
        Create Training Program
      </h1>

      <FormProvider {...methods}>
        <div className='flex w-full justify-center'>
          <div className='w-full max-w-xs'>
            <InputField label='Name' id='name' />
          </div>
        </div>

        <div className='flex flex-col'>
          <div className='w-full p-4'>
            <div className='relative'>
              <div className='flex flex-col'>
                <div className='flex flex-wrap gap-4'>
                  {methods.watch('days')?.map((_, index) => (
                    <div
                      key={index}
                      className={`flex-grow rounded-lg border p-4 shadow-sm sm:w-[calc(50%-0.5rem)] lg:max-w-[calc(50%-0.5rem)]`}
                    >
                      <div className='space-y-3'>
                        <div className='flex h-20 w-full flex-row items-start justify-between'>
                          <span
                            className={classNames(
                              'mr-2 h-full w-2 rounded',
                              getLightColors(index),
                            )}
                          ></span>

                          <InputField
                            label='Day Title'
                            id={`days.${index}.title`}
                            className='max-w-lg bg-white'
                          />

                          <button
                            type='button'
                            onClick={() => {
                              const currentDays =
                                methods.getValues('days') || [];
                              methods.setValue(
                                'days',
                                currentDays.filter((_, i) => i !== index),
                              );
                            }}
                            className='text-red-500 hover:text-red-700'
                          >
                            <TrashIcon className='h-5 w-5' />
                          </button>
                        </div>

                        {/* Exercises section */}
                        <div className='mt-4'>
                          <h4 className='mb-2 text-sm font-medium text-gray-700'>
                            Exercises
                          </h4>
                          <div className='space-y-2'>
                            {(
                              methods.watch(`days.${index}.exercises`) || []
                            ).map((exercise, exIndex) => (
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
                                          `days.${index}.exercises`,
                                        ) || [];
                                      methods.setValue(
                                        `days.${index}.exercises`,
                                        currentExercises.filter(
                                          (_, i) => i !== exIndex,
                                        ),
                                      );
                                    }}
                                    className='text-red-400 hover:text-red-600'
                                  >
                                    <TrashIcon className='h-4 w-4' />
                                  </button>
                                </div>
                              </div>
                            ))}

                            <button
                              type='button'
                              onClick={() => {
                                const currentExercises =
                                  methods.getValues(
                                    `days.${index}.exercises`,
                                  ) || [];
                                methods.setValue(`days.${index}.exercises`, [
                                  ...currentExercises,
                                  { name: '' },
                                ]);
                              }}
                              className='flex w-full items-center justify-center rounded border border-dashed border-gray-300 bg-white p-2 text-sm hover:border-gray-400'
                            >
                              <PlusIcon className='mr-1 h-4 w-4 text-gray-400' />
                              <span className='text-gray-500'>
                                Add Exercise
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type='button'
                  onClick={() => {
                    const currentDays = methods.getValues('days') || [];
                    methods.setValue('days', [
                      ...currentDays,
                      { title: '', exercises: [] },
                    ]);
                  }}
                  className='mt-4 flex h-auto w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-2 transition-colors hover:border-gray-400'
                >
                  <div className='flex flex-col items-center justify-center'>
                    <PlusIcon className='h-12 w-12 text-gray-400' />
                    <span className='mt-2 text-sm font-medium text-gray-500'>
                      Add Day
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  );
};
