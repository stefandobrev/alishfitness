export const NoDataDiv = ({ heading = '', content = '' }) => {
  return (
    <div className='flex flex-col items-center justify-center py-16 text-gray-500'>
      <p className='text-lg'>{heading}</p>
      <p className='mt-1'>{content}</p>
    </div>
  );
};
