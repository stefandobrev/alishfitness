import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { logoutWithBlacklist } from '../../store/slices/authSlice';
import { profileMenuItems } from '../../config/navigation';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const profile = useSelector((state) => state.user.profile);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-gray-800 shadow-lg ring-1 ring-gray-700'>
          {profileMenuItems.map((item, index) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex w-full items-center px-4 py-3 text-sm text-gray-300 transition duration-150 hover:bg-gray-700 hover:text-white ${
                index === 0 ? 'rounded-t-lg' : ''
              }`}
            >
              {item.icon && (
                <item.icon
                  className='mr-3 h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
              )}
              {item.name}
            </NavLink>
          ))}
          <div className='my-1 border-t border-gray-700' />
          <button
            onClick={handleSignOut}
            className='flex w-full cursor-pointer items-center rounded-b-lg px-4 py-3 text-left text-sm text-gray-300 transition duration-150 hover:bg-gray-700 hover:text-white'
          >
            <ArrowRightStartOnRectangleIcon
              className='mr-3 h-5 w-5 text-gray-400'
              aria-hidden='true'
            />
            {/* Sign Out icon */}
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
