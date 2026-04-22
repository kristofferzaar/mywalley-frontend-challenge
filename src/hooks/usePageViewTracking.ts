import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics, ANALYTICS_EVENTS } from './useAnalytics';

export function usePageViewTracking() {
  const { pathname } = useLocation();
  const { track } = useAnalytics();

  useEffect(() => {
    track(ANALYTICS_EVENTS.PAGE_VIEW, { path: pathname });
  }, [pathname, track]);
}
