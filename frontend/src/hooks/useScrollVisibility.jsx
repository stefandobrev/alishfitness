import { useState, useEffect, useRef } from 'react';

export const useScrollVisibility = (options = {}) => {
  const { threshold = 20, initialVisibility = true, topOffset = 10 } = options;

  const [isVisible, setIsVisible] = useState(initialVisibility);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY <= topOffset) {
            setIsVisible(true);
          } else if (currentScrollY < lastScrollY.current - threshold) {
            setIsVisible(true); // Scrolling up
          } else if (currentScrollY > lastScrollY.current + threshold) {
            setIsVisible(false); // Scrolling down
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, topOffset]);

  return isVisible;
};
