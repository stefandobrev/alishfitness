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
      {
        name: '',
        muscleGroup: '',
        sets: '',
        reps: '',
      },
    ]);
  };

  const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

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
            <div className='p-3'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-gray-50'>
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
                        <td className='border p-2 text-center'>
                          {exerciseIndex + 1}
                        </td>
                        <td className='border p-2'>
                          <Controller
                            name={`sessions.${sessionIndex}.exercises.${exerciseIndex}.muscleGroup`}
                            control={control}
                            render={({ field }) => (
                              <select {...field} className='w-full p-1'>
                                <option value=''>Select Muscle Group</option>
                                {muscleGroups.map((group) => (
                                  <option key={group} value={group}>
                                    {group}
                                  </option>
                                ))}
                              </select>
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
                                type='number'
                                placeholder='Sets'
                                className='w-full p-1'
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
                                className='w-full p-1'
                              />
                            )}
                          />
                        </td>
                        <td className='border p-2 text-center'>
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
        </div>
      ))}
    </div>
  );
};
