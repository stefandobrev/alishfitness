import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

const ManageMenu = ({ menuItems, currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

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

  const isActive = menuItems.some((item) => currentPath === item.href);

  return (
    <div className='relative' ref={menuRef}>
      {/* Manage Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`cursor-pointer rounded-md px-4 py-3 text-base font-medium transition duration-150 hover:translate-y-[-2px] hover:transform ${
          isActive || isOpen
            ? 'bg-gray-900 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        Manage
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-lg bg-gray-800 shadow-lg ring-1 ring-gray-700'>
          {menuItems.map((item, index) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 text-sm transition duration-150 ${
                  isActive
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } ${index === 0 ? 'rounded-t-lg' : ''} ${
                  index === menuItems.length - 1 ? 'rounded-b-lg' : ''
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMenu;
