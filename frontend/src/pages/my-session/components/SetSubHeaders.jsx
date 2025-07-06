export const SetSubHeaders = ({ setIndex, maxSets }) => (
  <>
    <th className='w-[85px] border-r border-b border-gray-300 bg-gray-200 px-2 py-1.5 font-semibold text-gray-700'>
      Weight
    </th>
    <th className='w-[85px] border-r border-b border-gray-300 bg-gray-200 px-2 py-1.5 font-semibold text-gray-700'>
      Reps/Time
    </th>
    <th
      className={`w-[80px] border-b border-gray-300 bg-gray-200 px-2 py-1.5 font-semibold text-gray-700 ${
        setIndex === maxSets - 1 ? 'border-r-0' : 'border-r'
      }`}
    >
      Target
    </th>
  </>
);
