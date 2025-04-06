import { useTitle } from '@/hooks/useTitle.hook';

export const TemplatesPage = () => {
  useTitle('Templates');
  return (
    <div className='flex flex-col'>
      <h1 className='flex justify-center p-4 text-2xl font-bold md:text-3xl'>
        Templates
      </h1>
      <div className='flex flex-col lg:flex-row'></div>
    </div>
  );
};
