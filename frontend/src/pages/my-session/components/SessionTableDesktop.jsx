import React from 'react';

export const SessionTableDesktop = ({ sessionLogData }) => {
  const { session } = sessionLogData;
  const { exercises } = session;
  const maxSets = Math.max(...exercises.map((ex) => ex.sets));

  const openExercisePage = (muscleGroupSlug, exerciseSlug) => {
    window.open(`/exercises/${muscleGroupSlug}/${exerciseSlug}/`, '_blank');
  };
  console.log({ sessionLogData });
  return (
    <div className='mx-4 overflow-auto'>
      <table className='mx-auto table-fixed border-separate border border-gray-300 text-sm'>
        <thead>
          <tr className='text-center'>
            <th
              rowSpan={2}
              className='w-[60px] border border-gray-300 bg-gray-200 px-2 py-1.5 text-lg font-semibold'
            >
              Seq
            </th>
            <th
              rowSpan={2}
              className='w-[400px] border border-gray-300 bg-gray-200 px-3 py-1.5 text-left text-lg font-semibold'
            >
              Exercise
            </th>
            <th
              rowSpan={2}
              className='w-[90px] border border-gray-300 bg-gray-200 px-2 py-1.5 text-lg font-semibold'
            >
              Reps
            </th>
            {Array.from({ length: maxSets }, (_, i) => (
              <th
                key={`set-${i}`}
                colSpan={3}
                className='border border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 px-2 py-1.5 font-semibold'
              >
                Set {i + 1}
              </th>
            ))}
            <th
              rowSpan={2}
              className='w-[120px] border border-gray-300 bg-gray-200 px-2 py-1.5 text-lg font-semibold'
            >
              Progress
            </th>
          </tr>
          <tr className='bg-gray-50 text-center'>
            {Array.from({ length: maxSets }, (_, i) => (
              <React.Fragment key={`group-${i}`}>
                <th
                  key={`w-${i}`}
                  className='text-s w-[80px] border border-gray-300 px-2 py-1 font-medium text-gray-700'
                >
                  Weight
                </th>
                <th
                  key={`r-${i}`}
                  className='text-s w-[80px] border border-gray-300 px-2 py-1 font-medium text-gray-700'
                >
                  Reps
                </th>
                <th
                  key={`t-${i}`}
                  className='text-s w-[80px] border border-gray-300 px-2 py-1 font-medium text-gray-700'
                >
                  Target
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex, index) => (
            <tr key={index} className='text-center'>
              <td className='border bg-gray-200 px-2 py-1 text-xl font-semibold'>
                {ex.sequence}
              </td>
              <td
                className='cursor-pointer border px-2 py-1 text-left text-xl hover:bg-gray-200 hover:font-bold'
                onClick={() =>
                  openExercisePage(ex.muscleGroupSlug, ex.exerciseSlug)
                }
              >
                {ex.exerciseTitle || ex.customExerciseTitle}
              </td>
              <td className='border px-2 py-1 text-xl'>{ex.reps}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
