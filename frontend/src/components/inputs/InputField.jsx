import { useFormContext } from 'react-hook-form';

export const InputField = ({
  label,
  id,
  type = 'text',
  required = true,
  className = '',
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className='mb-3'>
      <label
        htmlFor={id}
        className='mb-1 block text-lg font-semibold text-gray-700'
      >
        {label}:
      </label>
      <div className='relative'>
        <input
          id={id}
          type={type}
          {...register(id, { required })}
          className={`flex w-full rounded-sm p-2.5 transition-all duration-200 ${
            rest.readOnly
              ? 'border-none bg-transparent focus:ring-0'
              : 'focus:ring-logored focus:border-logored border border-gray-300 focus:ring-2'
          } focus:outline-none ${errors && errors[id] ? 'border-red-500' : ''} ${className} `}
          {...rest}
        />
      </div>
      {errors && errors[id] && (
        <p className='mt-1 text-sm font-medium text-red-500'>
          {errors[id].message || 'This field is required'}
        </p>
      )}
    </div>
  );
};
