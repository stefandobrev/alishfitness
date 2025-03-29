import { isMobile } from '../../../../../common/constants';

export const SequenceInput = ({ field }) => {
  return (
    <input
      {...field}
      className={`focus:border-logored focus:ring-logored border p-1 text-center focus:ring-2 focus:outline-none ${
        isMobile ? 'w-full' : 'w-8'
      }`}
      onChange={(e) => {
        field.onChange(e.target.value.toUpperCase());
      }}
    />
  );
};

export const SetsInput = ({ field }) => {
  return (
    <input
      {...field}
      type='text'
      pattern='\d*'
      inputMode='numeric'
      onChange={(e) => {
        // Prevents other chars but ints
        const value = e.target.value.replace(/[^0-9]/g, '');
        field.onChange(value);
      }}
      className={`focus:ring-logored focus:border-logored border border-gray-300 p-1 text-center focus:ring-2 focus:outline-none ${
        isMobile ? 'w-full' : 'w-10'
      }`}
    />
  );
};

export const RepsInput = ({ field }) => {
  return (
    <input
      {...field}
      placeholder='Reps'
      className={`focus:ring-logored focus:border-logored border border-gray-300 p-1 text-center focus:ring-2 focus:outline-none ${
        isMobile ? 'w-full' : 'w-15'
      }`}
    />
  );
};
