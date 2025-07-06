import { ActionButton, ButtonVariant } from '@/components/buttons';
import { SetHeader, SetSubHeaders, SetCells } from '..';

export const SessionTableMobile = ({ exercises, activeTab }) => {
  const maxSets = Math.max(...exercises.map((ex) => ex.sets));

  const openExercisePage = (muscleGroupSlug, exerciseSlug) => {
    window.open(`/exercises/${muscleGroupSlug}/${exerciseSlug}/`, '_blank');
  };

  const renderInputsTab = () => (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-max border-separate border-spacing-0 overflow-hidden border border-gray-300 text-xs'>
        <thead>
          <tr className='text-center'>
            <th
              rowSpan={2}
              className='min-w-[40px] border-r border-b border-gray-300 bg-gray-200 px-1 py-2 text-sm font-semibold text-gray-800'
            >
              Seq
            </th>
            {Array.from({ length: maxSets }, (_, i) => (
              <SetHeader
                key={`set-${i}`}
                setNumber={i + 1}
                isLast={i === maxSets - 1}
              />
            ))}
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
              <td className='border-r border-b border-gray-300 bg-gray-200 px-1 py-2 text-xl font-semibold text-gray-800'>
                {ex.sequence}
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
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderExerciseInfoTab = () => (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-max border-separate border-spacing-0 overflow-hidden border border-gray-300 text-xs'>
        <thead>
          <tr className='text-center'>
            <th className='w-[40px] border-r border-b border-gray-300 bg-gray-200 px-1 py-2 text-lg font-semibold text-gray-800'>
              Seq
            </th>
            <th className='min-w-[100px] border-r border-b border-gray-300 bg-gray-200 px-2 py-2 text-left text-lg font-semibold text-gray-800'>
              Exercise
            </th>
            <th className='w-[60px] border-r border-b border-gray-300 bg-gray-200 px-1 py-2 text-lg font-semibold text-gray-800'>
              Reps
            </th>
            <th className='w-[80px] border-b border-gray-300 bg-gray-200 px-1 py-2 text-lg font-semibold text-gray-800'>
              Progress
            </th>
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
              <td className='border-r border-b border-gray-300 bg-gray-200 px-1 py-2 text-xl font-semibold text-gray-800'>
                {ex.sequence}
              </td>
              <td
                className={`border-r border-b border-gray-300 px-2 py-2 text-left text-sm font-semibold text-gray-800 transition-all duration-200 ${
                  ex.exerciseTitle
                }`}
                onClick={
                  ex.exerciseTitle
                    ? () =>
                        openExercisePage(ex.muscleGroupSlug, ex.exerciseSlug)
                    : undefined
                }
              >
                <div className='max-w-[180px]'>
                  {ex.exerciseTitle || ex.customExerciseTitle}
                </div>
              </td>
              <td className='border-r border-b border-gray-300 px-1 py-2 text-sm font-semibold text-gray-800'>
                {ex.reps}
              </td>
              <td className='border-b border-gray-300 px-1 py-2'>
                <ActionButton
                  variant={ButtonVariant.GRAY_DARK}
                  className='px-2 py-1 text-xs font-medium'
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

  return (
    <>{activeTab === 'inputs' ? renderInputsTab() : renderExerciseInfoTab()}</>
  );
};
