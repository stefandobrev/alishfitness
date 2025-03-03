import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { profileMenuItems } from '../../config/navigation';

const ProfileMenu = ({ profile, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleSignOut = () => {
    setIsOpen(false);
    onSignOut();
  };

  // Close the menu if click happens outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false); // Close the menu if the click is outside
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
        className='flex cursor-pointer items-center gap-3 rounded-lg bg-gray-700 p-2 transition duration-150 hover:bg-gray-600 sm:px-4 sm:py-2'
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
        <div className='ring-opacity-5 absolute left-1/2 z-10 mt-2 w-56 origin-top-right -translate-x-1/2 transform rounded-lg bg-white py-2 ring-1 shadow-lg ring-black'>
          {profileMenuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className='flex w-full items-center px-4 py-3 text-sm text-gray-700 transition duration-150 hover:bg-gray-300'
            >
              {item.icon && (
                <item.icon
                  className='mr-3 h-5 w-5 text-gray-500'
                  aria-hidden='true'
                />
              )}
              {item.name}
            </NavLink>
          ))}

          <div className='my-1 border-t border-gray-100' />

          <button
            onClick={handleSignOut}
            className='flex w-full cursor-pointer items-center px-4 py-3 text-left text-sm text-gray-700 transition duration-150 hover:bg-gray-300'
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
