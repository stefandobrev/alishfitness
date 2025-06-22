export const SetHeader = ({ setNumber, isLast }) => (
  <th
    colSpan={3}
    className={`border-r border-b border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 px-2 py-2 font-semibold text-gray-800 ${
      isLast ? 'border-r-0' : ''
    }`}
  >
    Set {setNumber}
  </th>
);
