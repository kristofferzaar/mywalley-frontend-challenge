import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const h1 = document.querySelector<HTMLHeadingElement>('#main-content h1');
    if (h1) {
      h1.tabIndex = -1;
      h1.focus();
    } else {
      document.getElementById('main-content')?.focus();
    }
  }, [pathname]);
}
