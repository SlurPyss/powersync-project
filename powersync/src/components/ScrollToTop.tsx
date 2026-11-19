import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // If navigating to an anchor hash (e.g., #lokasi, #cara-kerja), scroll smoothly to that section
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Wait briefly for target DOM to mount if coming from another route
        const timer = setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
        return () => clearTimeout(timer);
      }
    } else {
      // When navigating to any route without hash (e.g. /login, /register, /catalog), immediately scroll to top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;

