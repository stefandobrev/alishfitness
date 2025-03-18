import { NavLink } from 'react-router-dom';

const NavbarLogo = () => {
  return (
    <div className='flex shrink-0 items-center'>
      <NavLink to='/'>
        <img
          alt='Alish Fitness'
          src='/images/alish-logo.png'
          className='h-12 w-auto transition-transform duration-200 hover:scale-110'
        />
      </NavLink>
    </div>
  );
};

export default NavbarLogo;
