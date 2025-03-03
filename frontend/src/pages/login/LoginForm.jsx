import { useFormContext } from 'react-hook-form';
import { Link } from 'react-router-dom';

import InputField from '../../components/inputs/InputField';
import PasswordField from '../../components/inputs/PasswordField';
import { SaveButton } from '../../components/buttons/EditButtons';

const LoginForm = ({ loginUserData }) => {
  const { handleSubmit, register } = useFormContext();

  return (
    <form onSubmit={handleSubmit(loginUserData)} className='space-y-3'>
      <InputField
        label='Username'
        id='login_username'
        registration={register('login_username')}
      />
      <PasswordField
        label='Password'
        id='login_password'
        registration={register('login_password')}
      />

      <div className='flex flex-col items-center justify-center space-y-2'>
        <SaveButton>Sign In</SaveButton>
        <Link to='/register' className='text-gray-900 hover:underline'>
          Don't have an account? Register
        </Link>
      </div>
    </form>
  );
};
export default LoginForm;
