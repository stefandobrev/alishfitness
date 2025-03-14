export const useNavbarStyles = (isHomePage, isScrolled, isOpen) => {
  const navClasses = `${isHomePage ? 'fixed' : 'sticky'} w-full top-0 z-50 h-20 transition-colors duration-400 ${
    isHomePage
      ? isScrolled || isOpen
        ? 'bg-gray-800 shadow-lg'
        : 'bg-transparent'
      : 'bg-gray-800 shadow-lg'
  }`;

  const getTransparentTextClass = () => {
    return isHomePage && !isScrolled && !isOpen ? 'text-white' : '';
  };

  return {
    navClasses,
    getTransparentTextClass,
  };
};
