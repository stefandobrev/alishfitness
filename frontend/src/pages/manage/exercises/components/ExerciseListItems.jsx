import { formatDistanceToNow } from 'date-fns';

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
