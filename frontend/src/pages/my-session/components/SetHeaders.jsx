export const SetHeader = ({ setNumber, isLast }) => (
  <th
    colSpan={3}
    className={`border-r border-b border-gray-300 bg-gray-200 py-2 text-lg font-semibold text-gray-800 ${
      isLast ? 'border-r-0' : ''
    }`}
  >
    Set {setNumber}
  </th>
);
