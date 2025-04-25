import { useTitle } from '@/hooks/useTitle.hook';

export const ViewAllPage = () => {
  useTitle('All Programs');

  return (
    <div className='flex flex-col'>
      <h1 className='flex justify-center p-4 text-2xl font-bold md:text-3xl'>
        All Programs
      </h1>
      <p className='w-full text-center text-gray-600 lg:mx-auto dark:text-gray-300'>
        1000 programs available
      </p>
      <div className='flex flex-col lg:flex-row'></div>
    </div>
  );
};
