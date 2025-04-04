import { useFormContext, Controller } from 'react-hook-form';
import Select from 'react-select';

export const DropdownField = ({
  label,
  id,
  options,
  required = false,
  placeholder = '--',
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

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
        rules={{ required }}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            isClearable
            placeholder={placeholder}
            onChange={(selected) => field.onChange(selected?.value ?? null)}
            value={
              options.find((option) => option.value === field.value) || null
            }
            menuPortalTarget={document.body}
            classNamePrefix='react-select'
            className='w-full font-semibold'
            {...props}
          />
        )}
      />
      {errors[id] && <p className='text-red-500'>{errors[id].message}</p>}
    </div>
  );
};
