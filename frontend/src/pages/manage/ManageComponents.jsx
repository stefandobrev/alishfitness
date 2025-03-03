import Select from 'react-select';
import { formatDistanceToNow } from 'date-fns';

export const MuscleGroupFilter = ({
  muscleGroups,
  selectedMuscleGroups,
  onChange,
}) => (
  <div>
    <label className='mb-2 block font-semibold text-gray-700'>
      Filter by Muscle Group
    </label>
    <Select
      isMulti
      options={muscleGroups}
      onChange={(selectedOptions) =>
        onChange(selectedOptions ? selectedOptions.map((opt) => opt.value) : [])
      }
      value={muscleGroups.filter((group) =>
        selectedMuscleGroups.includes(group.value),
      )}
      classNamePrefix='react-select'
      className='max-w-md'
    />
  </div>
);

export const SortFilter = ({ sortBy, onChange }) => (
  <div>
    <label className='mb-2 block font-semibold text-gray-700'>Sort by</label>
    <Select
      options={[
        { label: 'Last Created', value: 'created_at' },
        { label: 'Last Edited', value: 'updated_at' },
      ]}
      onChange={(selectedOption) =>
        onChange(selectedOption ? selectedOption.value : null)
      }
      value={
        sortBy
          ? {
              label: sortBy === 'created_at' ? 'Last Created' : 'Last Edited',
              value: sortBy,
            }
          : null
      }
      isClearable
      placeholder='--'
      classNamePrefix='react-select'
      className='max-w-md'
    />
  </div>
);

export const ExerciseListItems = ({ exercises, onSelectExercise, sortBy }) => (
  <ul className='space-y-2'>
    {exercises.map((exercise) => {
      const timestamp =
        sortBy === 'created_at' ? exercise.created_at : exercise.updated_at;
      const timeAgo = sortBy
        ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
        : null;

      return (
        <li
          key={exercise.id}
          className='hover:bg-gray-170 active:bg-gray-170 flex cursor-pointer justify-between rounded-lg p-3 transition duration-170 ease-in-out'
          onClick={() => onSelectExercise(exercise.id)}
        >
          {timeAgo ? (
            <div className='flex w-full justify-between'>
              <span className='max-w-[70%] truncate text-gray-800'>
                {exercise.title}
              </span>
              <span className='text-logored text-end text-sm'>{timeAgo}</span>
            </div>
          ) : (
            <span className='max-w-[85%] truncate text-gray-800'>
              {exercise.title}
            </span>
          )}
        </li>
      );
    })}
  </ul>
);
