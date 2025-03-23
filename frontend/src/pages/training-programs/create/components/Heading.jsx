import { InputField } from '../../../../components/inputs';

export const Heading = () => {
  return (
    <>
      <h1 className='p-4 text-2xl font-bold md:text-3xl'>
        Create Training Program
      </h1>

      <div className='mb-4 px-4'>
        <div className='w-full max-w-xs'>
          <InputField label='Name' id='programName' />
        </div>
      </div>
    </>
  );
};
