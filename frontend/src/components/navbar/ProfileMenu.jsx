import { useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';

import { logoutWithBlacklist } from '../../store/slices/authSlice';
import { profileMenuItems } from '../../config/navigation';
import { getNavMobileItemStyles } from '../../utils/classNames';

const ProfileMenu = ({ isOpen, setIsOpen }) => {
  const profile = useSelector((state) => state.user.profile);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = window.innerWidth < 640;

  const handleSignOut = async () => {
    setIsOpen(false);
    dispatch(logoutWithBlacklist());
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className='relative ml-3' ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex cursor-pointer items-center gap-3 rounded-lg border-2 border-gray-600 bg-gray-700 p-2 hover:bg-gray-600 sm:px-4 sm:py-2'
      >
        <img
          alt='User Avatar'
          src='/defaultProfile.png'
          className='h-8 w-8 rounded-full border-2 border-gray-600 object-cover'
        />
        <span className='hidden text-base font-medium text-white sm:inline'>
          {profile.first_name} {profile.last_name}
        </span>
      </button>

      {/* Dropdown Menu - Desktop version */}
      {isOpen && !isMobile && (
        <div className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-gray-800 shadow-lg ring-1 ring-gray-700'>
          {profileMenuItems.map((item, index) => {
            const isItemActive = currentPath === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex w-full items-center px-4 py-3 text-sm ${
                  isItemActive
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } transition duration-150 ${index === 0 ? 'rounded-t-lg' : ''}`}
              >
                {item.icon && (
                  <item.icon
                    className={`mr-3 h-5 w-5 ${isItemActive ? 'text-white' : 'text-gray-400'}`}
                    aria-hidden='true'
                  />
                )}
                {item.name}
              </NavLink>
            );
          })}
          <div className='my-1 border-t border-gray-700' />
          <button
            onClick={handleSignOut}
            className='flex w-full cursor-pointer items-center rounded-b-lg px-4 py-3 text-left text-sm text-gray-300 transition duration-150 hover:bg-gray-700 hover:text-white'
          >
            <ArrowRightStartOnRectangleIcon
              className='mr-3 h-5 w-5 text-gray-400'
              aria-hidden='true'
            />
            Sign out
          </button>
        </div>
      )}

      {/* Mobile Dropdown Menu*/}
      {isOpen && isMobile && (
        <div className='fixed inset-x-0 top-16 z-10 mt-4 bg-gray-800'>
          <div className='space-y-2 bg-gray-800 px-3 pt-2 pb-4'>
            {/* Profile Menu Items */}
            {profileMenuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  getNavMobileItemStyles(isActive) + ' text-base font-medium'
                }
              >
                <div className='flex w-full items-center'>
                  {item.icon && (
                    <item.icon
                      className='mr-3 h-5 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                  )}
                  {item.name}
                </div>
              </NavLink>
            ))}

            {/* Sign Out Button */}
            <div className='my-5 border-t border-gray-700' />
            <button
              onClick={handleSignOut}
              className={
                getNavMobileItemStyles(false) + ' text-base font-medium'
              }
            >
              <div className='flex w-full items-center'>
                <ArrowRightStartOnRectangleIcon
                  className='mr-3 h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
                Sign out
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
