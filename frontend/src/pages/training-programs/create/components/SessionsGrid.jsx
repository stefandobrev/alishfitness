import { useState, useEffect } from 'react';
import Select from 'react-select';

import { Controller } from 'react-hook-form';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { fetchMuscleGroups } from '../../../../common/helpersCommon';
import { InputField } from '../../../../components/inputs';
import { classNames } from '../../../../utils/classNames';
import { getLightColors } from '../../../../common/constants';

export const SessionsGrid = ({
  sessions,
  control,
  setValue,
  getValues,
  onRemoveSession,
}) => {
  const [muscleGroups, setMuscleGroups] = useState([]);

  useEffect(() => {
    const loadMuscleGroups = async () => {
      const muscleGroupsData = await fetchMuscleGroups('training-programs');
      const transformedMuscleGroups = muscleGroupsData.map((group) => ({
        label: group.name,
        value: group.slug,
      }));
      setMuscleGroups(transformedMuscleGroups);
    };

    loadMuscleGroups();
  }, []);

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
        muscleGroup: '',
        name: '',
        sets: '3',
        reps: '',
      },
    ]);
  };

  return (
    <div className='flex flex-wrap gap-2'>
      {sessions?.map((session, sessionIndex) => (
        <div
          key={session.tempId}
          className='w-full rounded-lg border p-4 shadow-sm lg:w-[calc(50%-0.5rem)]'
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
                id={`sessions.${sessionIndex}.title`}
                className='max-w-lg flex-1 bg-white'
              />
              <button onClick={() => onRemoveSession(sessionIndex)}>
                <XMarkIcon className='text-logored hover:text-logored-hover h-5 w-5 cursor-pointer transition-colors duration-200' />
              </button>
            </div>
            {/* Exercises section */}

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
                  {session.exercises.map((exercise, exerciseIndex) => (
                    <tr key={exerciseIndex}>
                      <td className='border p-2'>
                        <Controller
                          name={`sessions.${sessionIndex}.exercises.${exerciseIndex}.sequence`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              className='w-7 p-1 text-center'
                              onChange={(e) => {
                                // Convert input to uppercase before saving
                                field.onChange(e.target.value.toUpperCase());
                              }}
                            />
                          )}
                        />
                      </td>
                      <td className='border p-2'>
                        <Controller
                          name={`sessions.${sessionIndex}.exercises.${exerciseIndex}.muscleGroup`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={muscleGroups}
                              isClearable
                              placeholder='Select Muscle Group'
                              onChange={(selected) =>
                                field.onChange(selected?.value ?? null)
                              }
                              value={
                                muscleGroups.find(
                                  (option) => option.value === field.value,
                                ) || null
                              }
                              menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                              className='w-full'
                              classNamePrefix='react-select'
                            />
                          )}
                        />
                      </td>
                      <td className='border p-2'>
                        <Controller
                          name={`sessions.${sessionIndex}.exercises.${exerciseIndex}.name`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              placeholder='Exercise Name'
                              className='w-full p-1'
                            />
                          )}
                        />
                      </td>
                      <td className='border p-2'>
                        <Controller
                          name={`sessions.${sessionIndex}.exercises.${exerciseIndex}.sets`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type='text'
                              pattern='\d*'
                              inputMode='numeric'
                              onChange={(e) => {
                                // prevents other chars but ints
                                const value = e.target.value.replace(
                                  /[^0-9]/g,
                                  '',
                                );
                                field.onChange(value);
                              }}
                              className='w-10 p-1 text-center'
                            />
                          )}
                        />
                      </td>
                      <td className='border p-2'>
                        <Controller
                          name={`sessions.${sessionIndex}.exercises.${exerciseIndex}.reps`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              placeholder='Reps'
                              className='w-15 p-1 text-center'
                            />
                          )}
                        />
                      </td>
                      <td className='border p-2'>
                        <button
                          type='button'
                          onClick={() =>
                            handleRemoveExercise(sessionIndex, exerciseIndex)
                          }
                          className='text-logored hover:text-logored-hover cursor-pointer'
                        >
                          <XMarkIcon className='mt-1 h-5 w-5' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='mt-3'>
              <button
                type='button'
                onClick={() => handleAddExercise(sessionIndex)}
                className='flex w-full cursor-pointer items-center justify-center rounded border border-dashed border-gray-300 bg-white p-2 text-sm hover:border-gray-400'
              >
                <PlusIcon className='mr-1 h-4 w-4 text-gray-400' />
                <span className='text-gray-500'>Add Exercise</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
