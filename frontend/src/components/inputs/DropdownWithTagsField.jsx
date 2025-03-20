import { useFormContext, Controller } from 'react-hook-form';
import Select from 'react-select';

export const DropdownFieldWithTags = ({
  label,
  id,
  options,
  placeholder = '--',
}) => {
  const { control } = useFormContext();

  return (
    <div>
      <label
        htmlFor={id}
        className='mb-2 block text-lg font-semibold text-gray-700'
      >
        {label}
      </label>
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            isMulti
            placeholder={placeholder}
            onChange={(selected) =>
              field.onChange(selected.map((opt) => opt.value))
            }
            value={options.filter((option) =>
              field.value?.includes(option.value),
            )}
            classNamePrefix='react-select'
            className='w-full'
          />
        )}
      />
    </div>
  );
};
