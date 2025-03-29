export const SequenceInput = ({ field }) => {
  return (
    <input
      {...field}
      className='focus:border-logored focus:ring-logored w-7 rounded-sm p-1 text-center focus:ring-2 focus:outline-none'
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
      className='focus:border-logored focus:ring-logored w-10 rounded-sm p-1 text-center focus:ring-2 focus:outline-none'
    />
  );
};

export const RepsInput = ({ field }) => {
  return (
    <input
      {...field}
      placeholder='Reps'
      className='focus:border-logored focus:ring-logored w-15 rounded-sm p-1 text-center focus:ring-2 focus:outline-none'
    />
  );
};
