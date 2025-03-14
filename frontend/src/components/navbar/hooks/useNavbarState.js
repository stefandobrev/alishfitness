import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useNavbarState = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 100;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  useEffect(() => {
    // Add a class to the body when not on homepage
    document.body.classList.toggle('has-navbar-padding', !isHomePage);

    return () => {
      document.body.classList.remove('has-navbar-padding');
    };
  }, [isHomePage]);

  return {
    isMenuOpen,
    setIsMenuOpen,
    isProfileOpen,
    setIsProfileOpen,
    isScrolled,
    isHomePage,
    location,
  };
};
