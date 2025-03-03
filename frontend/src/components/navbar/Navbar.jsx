import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { fetchProfileData } from '../../store/slices/userSlice';
import { logoutWithBlacklist } from '../../store/slices/authSlice';
import { getNavigation } from '../../config/navigation';
import ProfileMenu from './ProfileMenu';
import { classNames } from '../../utils/classNames';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const profile = useSelector((state) => state.user.profile);
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfileData());
    }
  }, [dispatch, isAuthenticated]);

  const navigation = getNavigation(isAuthenticated, isAdmin);

  const handleSignOut = async () => {
    dispatch(logoutWithBlacklist());
    navigate('/login');
  };

  const isCurrent = (href) => (href === location.pathname ? 'page' : undefined);

  return (
    <nav className='sticky top-0 z-50 h-20 bg-gray-800 shadow-lg'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='relative flex h-20 items-center justify-between'>
          {/* Mobile menu button */}
          <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 hover:bg-gray-700 hover:text-white focus:outline-hidden'
            >
              <span className='absolute -inset-0.5' />
              <span className='sr-only'>Open main menu</span>
              {isOpen ? (
                <XMarkIcon className='block h-7 w-7' aria-hidden='true' />
              ) : (
                <Bars3Icon className='block h-7 w-7' aria-hidden='true' />
              )}
            </button>
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
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    aria-current={isCurrent(item.href)}
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-4 py-3 text-base font-medium transition duration-150',
                        'hover:translate-y-[-2px] hover:transform',
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Profile menu */}
          <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
            {isAuthenticated && (
              <ProfileMenu
                profile={profile}
                onSignOut={handleSignOut}
                className='transition duration-150 hover:opacity-90'
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className='sm:hidden'>
          <div className='space-y-2 px-3 pt-2 pb-4'>
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)} // Close menu when clicking a link
                className={({ isActive }) =>
                  classNames(
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-600 hover:text-white',
                    'block rounded-md px-4 py-3 text-base font-medium transition duration-150',
                    'hover:translate-x-2 hover:transform',
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
