import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const HambButton = ({ isOpen, setIsOpen }) => {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className='group relative inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 hover:bg-gray-700 hover:text-white focus:outline-none'
    >
      <span className='absolute -inset-0.5' />
      <span className='sr-only'>Open main menu</span>
      {isOpen ? (
        <XMarkIcon className='block h-7 w-7' aria-hidden='true' />
      ) : (
        <Bars3Icon className='block h-7 w-7' aria-hidden='true' />
      )}
    </button>
  );
};
export default HambButton;
