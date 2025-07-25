import { Controller } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { epleyFormula } from '../utils';

const FlexibleInput = ({
  value,
  onChange,
  onBlur,
  disabled,
  placeholder,
  type = 'decimal',
}) => {
  // Handle change = real time sanitization transformation. Pattern - validates
  const handleChange = (e) => {
    let inputValue = e.target.value;

    if (type === 'integer') {
      inputValue = inputValue.replace(/[^0-9]/g, '');
    } else {
      inputValue = inputValue.replace(/[^0-9.,]/g, '');
      inputValue = inputValue.replace(',', '.');

      const parts = inputValue.split('.');
      if (parts.length > 2) {
        inputValue = parts[0] + '.' + parts.slice(1).join('');
      }
    }

    onChange(inputValue);
  };

  const handleBlur = (e) => {
    onBlur(e);
  };

  return (
    <input
      type='text'
      value={value ?? ''}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
      pattern={type === 'integer' ? '[0-9]*' : '[0-9]*[.,]?[0-9]*'}
      inputMode={type === 'integer' ? 'numeric' : 'decimal'}
      className={`w-full appearance-none rounded border px-2 py-2 text-center text-lg transition-all duration-200 [-moz-appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
        !disabled
          ? 'border-gray-300 bg-white text-gray-800 focus:border-red-500 focus:ring-1 focus:ring-red-200'
          : 'cursor-not-allowed border-none bg-gray-50 text-gray-400 opacity-70'
      }`}
      placeholder={placeholder}
    />
  );
};

export const SetCells = ({
  setIndex,
  customExercise,
  maxSets,
  isAvailable,
  sequence,
  handleBlur,
}) => {
  const { control, getValues } = useFormContext();

  // Convert 0-based setIndex to 1-based setNumber to match your data structure
  const setNumber = setIndex + 1;

  const prevWeightValue = getValues(
    `setLogs.${sequence}.sets.${setNumber - 1}.weight`,
  );
  const prevRepValue = getValues(
    `setLogs.${sequence}.sets.${setNumber - 1}.reps`,
  );

  const targetWeight = epleyFormula(prevWeightValue, prevRepValue);

  return (
    <>
      <td className='border-r border-b border-gray-300 p-1'>
        <Controller
          name={`setLogs.${sequence}.sets.${setNumber}.weight`}
          control={control}
          render={({ field }) => (
            <FlexibleInput
              value={field.value}
              onChange={field.onChange}
              onBlur={() => {
                field.onBlur();
                handleBlur({
                  name: field.name,
                  type: 'decimal',
                });
              }}
              disabled={!isAvailable}
              placeholder={isAvailable ? '' : '—'}
            />
          )}
        />
      </td>
      <td className='border-r border-b border-gray-300 p-1'>
        <Controller
          name={`setLogs.${sequence}.sets.${setNumber}.reps`}
          control={control}
          render={({ field }) => (
            <FlexibleInput
              value={field.value}
              onChange={field.onChange}
              onBlur={() => {
                field.onBlur();
                handleBlur({
                  name: field.name,
                  type: 'integer',
                });
              }}
              type='integer'
              disabled={!isAvailable}
              placeholder={isAvailable ? '' : '—'}
            />
          )}
        />
      </td>
      <td
        className={`border-b border-gray-300 px-2 py-3 text-sm font-medium ${
          isAvailable ? 'text-gray-800' : 'text-gray-400'
        } ${setIndex === maxSets - 1 ? 'border-r-0' : 'border-r'}`}
      >
        {isAvailable && setNumber !== 1 && !customExercise
          ? targetWeight
            ? `${targetWeight} kg`
            : '—'
          : '—'}
      </td>
    </>
  );
};
