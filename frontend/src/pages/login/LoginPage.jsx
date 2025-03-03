import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { loginUser } from './helpersLogin';
import LoginForm from './LoginForm';
import { setUser } from '../../store/slices/authSlice';
import { setLoading } from '../../store/slices/loadingSlice';
import { useTitle } from '../../hooks/useTitle.hook';

export const LoginPage = () => {
  const methods = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useTitle('Member Login');

  const onSubmit = async (userData) => {
    dispatch(setLoading(true));
    const { type, text } = await loginUser(userData);

    if (type === 'error') {
      toast.error(text);
      dispatch(setLoading(false));
      return;
    }

    const data = text;
    dispatch(
      setUser({
        isAuthenticated: true,
        isAdmin: data.is_admin,
        user: {
          username: data.username,
        },
        accessToken: data.access,
        refreshToken: data.refresh,
      }),
    );

    toast.success('User logged in successfully!');
    if (data.is_admin) {
      navigate('/manage');
    } else {
      navigate('/exercises');
    }

    dispatch(setLoading(false));
  };

  return (
    <div className='flex h-[calc(100vh-108px)] items-center justify-center'>
      <div className='w-full max-w-xs'>
        <h2 className='mb-3 text-center text-2xl font-semibold'>
          Member Login
        </h2>
        <FormProvider {...methods}>
          <LoginForm loginUserData={onSubmit} />
        </FormProvider>
      </div>
    </div>
  );
};
