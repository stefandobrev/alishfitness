import { useEffect } from 'react';

import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const MuscleGroupSelect = ({ field, options, onChange }) => {
  return (
    <Select
      {...field}
      options={options}
      isClearable
      placeholder='Select muscle group'
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
      placeholder='Select exercise'
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

export const DateSelect = ({ field, userSelected }) => {
  const { setValue } = useFormContext();

  useEffect(() => {
    if (!userSelected && field.value) {
      setValue('activationDate', null);
    }
  }, [userSelected, setValue, field.value]);

  return (
    <DatePicker
      selected={field.value}
      isClearable
      onChange={(date) => field.onChange(date)}
      dateFormat='yyyy-MM-dd'
      className='w-full rounded-md border border-gray-300 p-2'
      classNamePrefix='react-datepicker'
      disabled={!userSelected}
      placeholderText='Select start date'
      minDate={new Date()}
    />
  );
};

export const UserSelect = ({ field, userOptions }) => {
  return (
    <Select
      options={userOptions}
      placeholder='Select user'
      isClearable
      className='md:w-70'
      classNamePrefix='react-select'
      menuPlacement='auto'
      menuPosition='fixed'
      onChange={(selected) => {
        field.onChange(selected);
      }}
      value={field.value}
    />
  );
};
