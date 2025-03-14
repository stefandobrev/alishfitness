import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchProfileData } from '../../store/slices/userSlice';
import { getNavigation } from '../../config/navigation';
import { useNavbarState } from './hooks/useNavbarState';
import { useNavbarStyles } from './hooks/useNavbarStyles';

import MobileMenu from './MobileMenu';
import ProfileMenu from './ProfileMenu';
import HambButton from './HambButton';
import NavigationItems from './NavigationItems';
import NavbarLogo from './NavbarLogo';

const Navbar = () => {
  const { isOpen, setIsOpen, isScrolled, isHomePage, location } =
    useNavbarState();
  const { navClasses, getTransparentTextClass } = useNavbarStyles(
    isHomePage,
    isScrolled,
    isOpen,
  );

  const dispatch = useDispatch();
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);
  const hamburgerButtonRef = useRef(null);
  const navigation = getNavigation(isAuthenticated, isAdmin);
  const isTransparent = isHomePage && !isScrolled && !isOpen;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfileData());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <nav className={navClasses}>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='relative flex h-20 items-center justify-between'>
          {/* Mobile menu button */}
          <div
            className={`absolute inset-y-0 left-0 flex items-center sm:hidden ${getTransparentTextClass()}`}
            ref={hamburgerButtonRef}
          >
            <HambButton isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>

          {/* Logo and navigation */}
          <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
            <NavbarLogo />
            <div className='hidden sm:ml-8 sm:block'>
              <NavigationItems
                navigation={navigation}
                currentPath={location.pathname}
                isTransparent={isTransparent}
              />
            </div>
          </div>

          {/* Profile menu */}
          <div
            className={`absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 ${getTransparentTextClass()}`}
          >
            {isAuthenticated && (
              <ProfileMenu className='transition duration-150 hover:opacity-90' />
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className='sm:hidden'>
          <MobileMenu
            navigation={navigation}
            location={location}
            setIsOpen={setIsOpen}
            hamburgerButtonRef={hamburgerButtonRef}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
