import { useFormContext } from 'react-hook-form';
import { classNames } from '@/utils';

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

  // for nested errors
  const error = id.split('.').reduce((acc, key) => acc?.[key], errors);

  return (
    <div className='w-full'>
      {label && (
        <label
          htmlFor={id}
          className='mb-1 block text-lg font-semibold text-gray-700'
        >
          {label}
        </label>
      )}
      <div className='relative'>
        <input
          id={id}
          type={type}
          {...register(id, { required })}
          className={classNames(
            'flex w-full rounded-sm p-2.5 transition-all duration-200 focus:outline-none',
            rest.readOnly
              ? 'border-none bg-transparent focus:ring-0'
              : 'focus:ring-logored focus:border-logored border border-gray-300 focus:ring-2',
            errors && errors[id] ? 'border-red-500' : '',
            className,
          )}
          {...rest}
        />
      </div>
      {error && (
        <p className='mt-1 text-sm font-medium text-red-500'>
          {error.message || 'This field is required'}
        </p>
      )}
    </div>
  );
};
