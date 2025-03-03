import { useFormContext } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const PasswordField = ({
  label,
  id,
  required = true,
  isPasswordVisible,
  togglePasswordVisibility,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label htmlFor={id} className='block text-lg font-semibold'>
        {label}:
        <div className='relative'>
          <input
            id={id}
            type={isPasswordVisible ? 'text' : 'password'}
            {...register(id, { required })}
            className='focus:border-logored focus:ring-logored w-full rounded-sm border border-gray-300 p-2 focus:ring-2 focus:outline-hidden'
          />
          <button
            type='button'
            onClick={togglePasswordVisibility}
            className='absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500'
            tabIndex='-1'
          >
            {isPasswordVisible ? (
              <EyeSlashIcon className='h-5 w-5' />
            ) : (
              <EyeIcon className='h-5 w-5' />
            )}
          </button>
        </div>
      </label>
      {errors && errors[id] && (
        <p className='text-red-500'>{errors[id].message}</p>
      )}
    </div>
  );
};
export default PasswordField;
