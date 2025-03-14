export const ExpertiseCard = ({ title, items }) => {
  return (
    <div className='group rounded-xl bg-white/5 p-6 transition-all duration-300 hover:bg-white/10 sm:p-8'>
      <h3 className='mb-6 text-2xl font-bold text-white sm:mb-8 sm:text-3xl'>
        {title}
      </h3>
      <ul className='space-y-3 text-gray-300 sm:space-y-4'>
        {items.map((item, index) => (
          <li key={index} className='flex items-center text-base sm:text-lg'>
            <span className='mr-3 text-red-500'>›</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
