export const AnatomyLegend = () => {
  return (
    <div className='flex flex-col gap-2 text-sm'>
      <div className='flex flex-row justify-center gap-4'>
        <div className='flex items-center gap-2'>
          <span className='bg-logored h-4 w-4 rounded'></span>
          <span>Primary</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='h-4 w-4 rounded bg-amber-300'></span>
          <span>Secondary</span>
        </div>
      </div>
      <div className='flex justify-center p-2'>
        <p className='text-gray-500 italic'>* Click to select another group</p>
      </div>
    </div>
  );
};
