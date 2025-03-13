import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';

import { fetchProfileData } from '../../store/slices/userSlice';
import { getNavigation } from '../../config/navigation';
import MobileMenu from './MobileMenu';
import ProfileMenu from './ProfileMenu';
import DropdownMenu from './DropdownMenu';
import HambButton from './HambButton';
import { getNavItemStyles } from '../../utils/classNames';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);

  const hamburgerButtonRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfileData());
    }
  }, [dispatch, isAuthenticated]);

  const navigation = getNavigation(isAuthenticated, isAdmin);

  const isCurrent = (href) => (href === location.pathname ? 'page' : undefined);

  return (
    <nav className='sticky top-0 z-50 h-20 bg-gray-800 shadow-lg'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='relative flex h-20 items-center justify-between'>
          {/* Mobile menu button */}
          <div
            className='absolute inset-y-0 left-0 flex items-center sm:hidden'
            ref={hamburgerButtonRef}
          >
            <HambButton isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>

          {/* Logo and navigation */}
          <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
            <div className='flex shrink-0 items-center'>
              <NavLink to='/'>
                <img
                  alt='Alish Fitness'
                  src='/AlishLogo.png'
                  className='h-12 w-auto transition-transform duration-200 hover:scale-110'
                />
              </NavLink>
            </div>
            <div className='hidden sm:ml-8 sm:block'>
              <div className='flex space-x-6'>
                {navigation.map((item) =>
                  item.menuItems ? (
                    <DropdownMenu
                      key={item.name}
                      item={item}
                      currentPath={location.pathname}
                    />
                  ) : (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      aria-current={isCurrent(item.href)}
                      className={({ isActive }) => getNavItemStyles(isActive)}
                    >
                      {item.name}
                    </NavLink>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Profile menu */}
          <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
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
