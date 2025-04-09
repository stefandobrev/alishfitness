import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import registration from '@/schemas/registration';
import { registerUser } from './helpersRegistration';
import RegistrationForm from './RegistrationForm';

import { useTitle } from '@/hooks/useTitle.hook';

export const RegistrationPage = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const methods = useForm({
    resolver: zodResolver(registration),
  });
  useTitle('Create Profile');

  const onSubmit = async (userData) => {
    const { type, text } = await registerUser(userData);

    if (type === 'error') {
      setMessage({ type, text });
      return;
    }

    if (type === 'success') {
      toast.success(text);
      navigate('/login');
    }
  };

  return (
    <div className='flex h-[calc(100vh-108px)] items-center justify-center overflow-auto'>
      <div className='mx-4 w-full max-w-xs'>
        <h2 className='mb-3 text-center text-2xl font-semibold'>
          Create Profile
        </h2>
        <FormProvider {...methods}>
          <RegistrationForm registerUser={onSubmit} message={message} />
        </FormProvider>
      </div>
    </div>
  );
};
