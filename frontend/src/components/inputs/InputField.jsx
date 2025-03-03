import { useFormContext } from 'react-hook-form';

const InputField = ({ label, id, type = 'text', required = true, ...rest }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label htmlFor={id} className='block text-lg font-semibold'>
        {label}:
      </label>
      <div className='relative'>
        <input
          id={id}
          type={type}
          {...register(id, { required })}
          className='focus:border-logored focus:ring-logored flex w-full rounded-sm border border-gray-300 p-2 focus:ring-2 focus:outline-hidden'
          {...rest}
        />
      </div>

      {errors && errors[id] && (
        <p className='text-red-500'>{errors[id].message}</p>
      )}
    </div>
  );
};
export default InputField;
