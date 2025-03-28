import { useState, useEffect } from 'react';

import { useFormContext, Controller } from 'react-hook-form';
import Select from 'react-select';

import { fetchMuscleGroupsWithExercises } from '../helpersCreate';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ActionButton, ButtonVariant } from '../../../../components/buttons';

export const ExercisesTable = ({ sessionIndex, session }) => {
  const { setValue, getValues, control } = useFormContext();

  const [muscleGroupsAndExercises, setMuscleGroupsAndExercises] = useState({});
  const [muscleGroups, setMuscleGroups] = useState([]);

  useEffect(() => {
    const loadMuscleGroupsAndExercises = async () => {
      const muscleGroupData = await fetchMuscleGroupsWithExercises();
      setMuscleGroupsAndExercises(muscleGroupData);

      const transformedMuscleGroups = Object.values(muscleGroupData).map(
        (group) => ({
          label: group.name,
          value: group.slug,
        }),
      );
      setMuscleGroups(transformedMuscleGroups);
    };

    loadMuscleGroupsAndExercises();
  }, []);

  const getExerciseOptionsForMuscleGroup = (muscleGroupSlug) => {
    if (!muscleGroupSlug) return [];

    const muscleGroup = muscleGroupsAndExercises[muscleGroupSlug];
    return (
      muscleGroup?.excercises.map((exercise) => ({
        label: exercise.title,
        value: exercise.slug,
      })) || []
    );
  };

  const handleRemoveExercise = (sessionIndex, exerciseIndex) => {
    const currentExercises =
      getValues(`sessions.${sessionIndex}.exercises`) || [];

    setValue(
      `sessions.${sessionIndex}.exercises`,
      currentExercises.filter((_, i) => i !== exerciseIndex),
    );
  };

  return (
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
          {session.exercises.map((exercise, exerciseIndex) => {
            const exerciseOptions = getExerciseOptionsForMuscleGroup(
              getValues(
                `sessions.${sessionIndex}.exercises.${exerciseIndex}.muscleGroup`,
              ),
            );

            return (
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
                        onChange={(selected) => {
                          field.onChange(selected?.value ?? null);
                          // Reset exercise when muscle group changes
                          setValue(
                            `sessions.${sessionIndex}.exercises.${exerciseIndex}.slug`,
                            null,
                          );
                        }}
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
                    name={`sessions.${sessionIndex}.exercises.${exerciseIndex}.slug`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={exerciseOptions}
                        isClearable
                        placeholder='Select Exercise'
                        isDisabled={
                          !getValues(
                            `sessions.${sessionIndex}.exercises.${exerciseIndex}.muscleGroup`,
                          )
                        }
                        onChange={(selected) =>
                          field.onChange(selected?.value ?? null)
                        }
                        value={
                          exerciseOptions.find(
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
                          const value = e.target.value.replace(/[^0-9]/g, '');
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
                  <ActionButton
                    variant={ButtonVariant.BLANK}
                    onClick={() =>
                      handleRemoveExercise(sessionIndex, exerciseIndex)
                    }
                    className='text-logored hover:text-logored-hover cursor-pointer'
                  >
                    <XMarkIcon className='mt-1 h-5 w-5' />
                  </ActionButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
