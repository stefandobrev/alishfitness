import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { classNames } from '../../utils/classNames';

const MobileMenu = ({
  navigation,
  location,
  manageMenuItems,
  setIsOpen,
  hamburgerButtonRef,
}) => {
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState(null);
  const { isAdmin } = useSelector((state) => state.auth);
  const menuRef = useRef(null);

  const toggleMobileSubMenu = (name) => {
    setOpenMobileSubMenu(openMobileSubMenu === name ? null : name);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        hamburgerButtonRef.current &&
        !hamburgerButtonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [setIsOpen, hamburgerButtonRef]);

  return (
    <div className='space-y-2 px-3 pt-2 pb-4' ref={menuRef}>
      {navigation.map((item) =>
        item.name === 'Manage' && isAdmin ? (
          <div key={item.name}>
            <button
              onClick={() => toggleMobileSubMenu('Manage')}
              className={classNames(
                location.pathname.startsWith('/manage')
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-800 text-gray-300',
                'flex w-full cursor-pointer items-center justify-between rounded-md px-4 py-3 text-base font-medium',
              )}
            >
              <span>Manage</span>
              <svg
                className={`h-5 w-5 transition-transform ${openMobileSubMenu === 'Manage' ? 'rotate-180' : ''}`}
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
            {openMobileSubMenu === 'Manage' && (
              <div className='mt-2 space-y-2 pl-4'>
                {manageMenuItems.map((subItem) => (
                  <NavLink
                    key={subItem.name}
                    to={subItem.href}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-800 text-gray-300',
                        'block rounded-md px-4 py-2 text-sm',
                      )
                    }
                  >
                    {subItem.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ) : (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              classNames(
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-800 text-gray-300',
                'block rounded-md px-4 py-3 text-base font-medium',
              )
            }
          >
            {item.name}
          </NavLink>
        ),
      )}
    </div>
  );
};

export default MobileMenu;
