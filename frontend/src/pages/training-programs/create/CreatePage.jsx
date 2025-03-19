import { FormProvider, useForm } from 'react-hook-form';

import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

import { InputField } from '../../../components/inputs';
import { useTitle } from '../../../hooks/useTitle.hook';

export const CreatePage = () => {
  const methods = useForm();
  useTitle('Create');
  return (
    <div className='flex flex-col'>
      <h1 className='flex justify-center p-4 text-2xl font-bold md:text-3xl'>
        Create Training Program
      </h1>

      <FormProvider {...methods}>
        <div className='flex w-full justify-center'>
          <div className='w-full max-w-xs'>
            <InputField label='Name' id='name' />
          </div>
        </div>

        <div className='flex flex-col lg:flex-row'></div>
      </FormProvider>
    </div>
  );
};
