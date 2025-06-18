import React from 'react';

export const SessionTableDesktop = ({ sessionLogData }) => {
  const { session } = sessionLogData;
  const { exercises } = session;
  const maxSets = Math.max(...exercises.map((ex) => ex.sets));
  console.log({ sessionLogData });
  return (
    <div className='mx-4 overflow-auto'>
      <table className='mx-auto table-fixed border-separate border border-gray-300 text-sm'>
        <thead>
          <tr className='text-left'>
            <th
              rowSpan={2}
              className='w-[60px] border border-gray-300 bg-gray-200 px-2 py-1.5 text-lg font-semibold'
            >
              Seq
            </th>
            <th
              rowSpan={2}
              className='w-[400px] border border-gray-300 bg-gray-200 px-3 py-1.5 text-lg font-semibold'
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
                className='border border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 px-2 py-1.5 text-center font-semibold'
              >
                Set {i + 1}
              </th>
            ))}
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
      </table>
    </div>
  );
};
