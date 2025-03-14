import { useState, useCallback, useEffect, useRef } from 'react';

export const useScrollEffects = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [blurAmount, setBlurAmount] = useState(0);
  const rafRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const scrollThreshold = 100;
      const isPassedThreshold = window.scrollY > scrollThreshold;
      setIsScrolled(isPassedThreshold);

      // Calculate blur based on scroll position
      const maxBlur = 10; // maximum blur in pixels
      const scrollProgress = Math.min(window.scrollY / 500, 1);
      setBlurAmount(scrollProgress * maxBlur);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    document.body.classList.add('is-homepage');

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
      document.body.classList.remove('is-homepage');
    };
  }, [handleScroll]);

  return { isScrolled, blurAmount };
};
