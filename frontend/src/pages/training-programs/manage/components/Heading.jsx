import { InputField } from '@/components/inputs';

export const Heading = ({ isAssignedMode, setIsAssignedMode, pageMode }) => {
  const toggleIsAssignedMode = () => {
    setIsAssignedMode((prev) => !prev);
  };

  return (
    <>
      <h1 className='p-4 text-2xl font-bold md:text-3xl'>
        {isAssignedMode ? 'Create Training Program' : 'Create Template'}
      </h1>

      <div className='flex flex-col justify-between md:flex-row md:pl-4'>
        <div className='w-full md:max-w-xs'>
          <InputField label='Name' id='programTitle' />
        </div>
        {pageMode === 'create' && (
          <label className='mt-4 inline-flex cursor-pointer items-center md:mt-0'>
            <div className='flex gap-2'>
              <span className='text-m font-semibold text-gray-700 dark:text-gray-200'>
                Template Mode
              </span>
              <input
                type='checkbox'
                value=''
                className='peer sr-only'
                onClick={toggleIsAssignedMode}
              />
              <div className="peer peer-checked:bg-logored relative h-6 w-11 rounded-full bg-gray-600 peer-focus:ring-1 peer-focus:ring-black after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
            </div>
          </label>
        )}
      </div>
    </>
  );
};
