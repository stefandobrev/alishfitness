import { useFormContext } from 'react-hook-form';

import { useIsMobile } from '@/common/constants';

export const SequenceInput = ({ field, sessionIndex }) => {
  const isMobile = useIsMobile();
  const { trigger } = useFormContext();
  return (
    <input
      {...field}
      className={`focus:border-logored focus:ring-logored rounded-sm border p-1 text-center focus:ring-2 focus:outline-none ${
        isMobile ? 'w-full' : 'w-8'
      }`}
      onChange={(e) => {
        field.onChange(e.target.value.toUpperCase());
        trigger(`sessions.${sessionIndex}.exercises`);
      }}
    />
  );
};

export const SetsInput = ({ field }) => {
  const isMobile = useIsMobile();
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
      className={`focus:ring-logored focus:border-logored rounded-sm border border-gray-300 p-1 text-center focus:ring-2 focus:outline-none ${
        isMobile ? 'w-full' : 'w-10'
      }`}
    />
  );
};

export const RepsInput = ({ field }) => {
  const isMobile = useIsMobile();
  return (
    <input
      {...field}
      placeholder='Reps'
      className={`focus:ring-logored focus:border-logored rounded-sm border border-gray-300 p-1 text-center focus:ring-2 focus:outline-none ${
        isMobile ? 'w-full' : 'w-15'
      }`}
    />
  );
};

export const CustomInput = ({ field }) => {
  const isMobile = useIsMobile();
  return (
    <input
      {...field}
      value={field.value ?? ''}
      type='text'
      placeholder='Exercise name'
      className={`focus:ring-logored focus:border-logored rounded-sm border border-gray-300 p-1 text-center focus:ring-2 focus:outline-none ${
        isMobile ? 'w-full' : 'w-auto'
      }`}
    />
  );
};
