import Select from 'react-select';

export const MuscleGroupSelect = ({ field, options, onChange }) => {
  return (
    <Select
      {...field}
      options={options}
      isClearable
      placeholder='Select Muscle Group'
      onChange={
        onChange || ((selected) => field.onChange(selected?.value ?? null))
      }
      value={options.find((option) => option.value === field.value) || null}
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999,
        }),
      }}
      className='w-full'
      classNamePrefix='react-select'
    />
  );
};

export const ExerciseSelect = ({ field, options, isDisabled }) => {
  return (
    <Select
      {...field}
      options={options}
      isClearable
      placeholder='Select Exercise'
      isDisabled={isDisabled}
      onChange={(selected) => field.onChange(selected?.value ?? null)}
      value={options.find((option) => option.value === field.value) || null}
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999,
        }),
      }}
      className='w-full'
      classNamePrefix='react-select'
    />
  );
};
