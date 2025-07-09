import { ActionButton, ButtonVariant } from '@/components/buttons';
import { SetHeader, SetSubHeaders, SetCells } from '..';

export const SessionTableDesktop = ({ exercises, handleBlur }) => {
  const maxSets = Math.max(...exercises.map((ex) => ex.sets));

  const openExercisePage = (muscleGroupSlug, exerciseSlug) => {
    window.open(`/exercises/${muscleGroupSlug}/${exerciseSlug}/`, '_blank');
  };

  return (
    <div className='mx-4 overflow-auto'>
      <table className='mx-auto table-fixed border-separate border-spacing-0 overflow-hidden border-t border-r border-l border-gray-300 text-sm'>
        <thead>
          <tr className='text-center'>
            <th
              rowSpan={2}
              className='w-[60px] border-r border-b border-gray-300 bg-gray-200 px-2 py-2 text-lg font-semibold text-gray-800'
            >
              Seq
            </th>
            <th
              rowSpan={2}
              className='w-[400px] border-r border-b border-gray-300 bg-gray-200 px-3 py-2 text-left text-lg font-semibold text-gray-800'
            >
              Exercise
            </th>
            <th
              rowSpan={2}
              className='w-[90px] border-r border-b border-gray-300 bg-gray-200 px-2 py-2 text-lg font-semibold text-gray-800'
            >
              Reps
            </th>
            {Array.from({ length: maxSets }, (_, i) => (
              <SetHeader
                key={`set-${i}`}
                setNumber={i + 1}
                isLast={i === maxSets - 1}
              />
            ))}
            <th
              rowSpan={2}
              className='w-[120px] border-b border-l border-gray-300 bg-gray-200 px-2 py-2 text-lg font-semibold text-gray-800'
            >
              Progress
            </th>
          </tr>
          <tr className='bg-gray-50 text-center'>
            {Array.from({ length: maxSets }, (_, i) => (
              <SetSubHeaders
                key={`group-${i}`}
                setIndex={i}
                maxSets={maxSets}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex, index) => (
            <tr
              key={index}
              className={`text-center transition-colors hover:bg-gray-50 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
              }`}
            >
              <td className='border-r border-b border-gray-300 bg-gray-200 px-2 py-3 text-xl font-semibold text-gray-800'>
                {ex.sequence}
              </td>
              <td
                className={`border-r border-b border-gray-300 px-3 py-3 text-left text-lg text-gray-800 transition-all duration-200 ${
                  ex.exerciseTitle
                    ? 'cursor-pointer hover:bg-gray-200 hover:font-bold'
                    : ''
                }`}
                onClick={
                  ex.exerciseTitle
                    ? () =>
                        openExercisePage(ex.muscleGroupSlug, ex.exerciseSlug)
                    : undefined
                }
              >
                {ex.exerciseTitle || ex.customExerciseTitle}
              </td>

              <td className='border-r border-b border-gray-300 px-2 py-3 text-lg font-medium text-gray-800'>
                {ex.reps}
              </td>
              {Array.from({ length: maxSets }, (_, j) => (
                <SetCells
                  key={`${ex.id}-set-${j}`}
                  setIndex={j}
                  maxSets={maxSets}
                  exerciseIndex={index}
                  isAvailable={j < ex.sets}
                  customExercise={ex.customExerciseTitle}
                  exerciseId={ex.id}
                  sequence={ex.sequence}
                  handleBlur={handleBlur}
                />
              ))}
              <td className='border-b border-l border-gray-300 px-2 py-3'>
                <ActionButton
                  variant={ButtonVariant.GRAY_DARK}
                  className='text-xs font-medium'
                >
                  View Trends
                </ActionButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
