export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const getNavItemStyles = (isActive) => {
  return classNames(
    isActive
      ? 'bg-gray-700 text-white hover:bg-gray-600'
      : ' text-gray-300 hover:bg-gray-600 hover:text-white',
    'cursor-pointer rounded-md px-4 py-3 text-base font-medium',
  );
};

export const getNavMobileItemStyles = (isActive) => {
  return classNames(
    isActive ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-300',
    'flex w-full cursor-pointer block rounded-md px-4 py-3',
  );
};
