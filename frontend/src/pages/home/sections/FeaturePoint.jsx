export const FeaturePoint = ({ title, description }) => {
  return (
    <div className='border-l-4 border-red-600 pl-6 sm:pl-8'>
      <h3 className='mb-2 text-xl font-bold sm:text-2xl'>{title}</h3>
      <p className='text-sm text-gray-600 sm:text-base'>{description}</p>
    </div>
  );
};
