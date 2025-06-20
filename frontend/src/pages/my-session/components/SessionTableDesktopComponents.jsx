import React from 'react';

const FlexibleInput = ({ disabled, placeholder, type = 'decimal' }) => {
  const handleInput = (e) => {
    if (type === 'integer') {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    } else {
      e.target.value = e.target.value.replace(/[^0-9.,]/g, '');
      e.target.value = e.target.value.replace(',', '.');
      const parts = e.target.value.split('.');
      if (parts.length > 2) {
        e.target.value = parts[0] + '.' + parts.slice(1).join('');
      }
    }
  };

  return (
    <input
      type='text'
      disabled={disabled}
      pattern={type === 'integer' ? '[0-9]*' : '[0-9]*[.,]?[0-9]*'}
      inputMode={type === 'integer' ? 'numeric' : 'decimal'}
      onInput={handleInput}
      className={`w-full appearance-none rounded border px-2 py-2 text-center text-sm transition-all duration-200 [-moz-appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
        !disabled
          ? 'border-gray-300 bg-white text-gray-800 focus:border-red-500 focus:ring-1 focus:ring-red-200'
          : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
      }`}
      placeholder={placeholder}
    />
  );
};

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

export const SetSubHeaders = ({ setIndex, maxSets }) => (
  <React.Fragment>
    <th className='w-[80px] border-r border-b border-gray-300 px-2 py-1.5 text-sm font-medium text-gray-700'>
      Weight
    </th>
    <th className='w-[80px] border-r border-b border-gray-300 px-2 py-1.5 text-sm font-medium text-gray-700'>
      Reps
    </th>
    <th
      className={`w-[80px] border-b border-gray-300 px-2 py-1.5 text-sm font-medium text-gray-700 ${
        setIndex === maxSets - 1 ? 'border-r-0' : 'border-r'
      }`}
    >
      Target
    </th>
  </React.Fragment>
);

export const SetCells = ({ setIndex, maxSets, isAvailable }) => (
  <React.Fragment>
    <td className='border-r border-b border-gray-300 p-1'>
      <FlexibleInput
        disabled={!isAvailable}
        placeholder={isAvailable ? '' : '—'}
      />
    </td>
    <td className='border-r border-b border-gray-300 p-1'>
      <FlexibleInput
        disabled={!isAvailable}
        placeholder={isAvailable ? '' : '—'}
        type='integer'
      />
    </td>
    <td
      className={`border-b border-gray-300 px-2 py-3 text-sm font-medium ${
        isAvailable ? 'text-gray-800' : 'text-gray-400'
      } ${setIndex === maxSets - 1 ? 'border-r-0' : 'border-r'}`}
    >
      {isAvailable ? '0 kg' : '—'}
    </td>
  </React.Fragment>
);
