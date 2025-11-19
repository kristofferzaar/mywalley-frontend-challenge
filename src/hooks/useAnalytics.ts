/**
 * Mock Analytics Hook
 * 
 * This is a stub implementation of an analytics tracking hook.
 * In production, this would send events to your analytics service.
 * 
 * Usage:
 * const analytics = useAnalytics();
 * analytics.track('transaction_viewed', { transactionId: 'txn_001' });
 */

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  timestamp?: string;
}

export const useAnalytics = () => {
  const track = (event: string, properties?: Record<string, unknown>) => {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date().toISOString(),
    };

    // In production, this would send to your analytics service
    // For now, we'll just log to console
    if (import.meta.env.DEV) {
      console.log('📊 Analytics Event:', analyticsEvent);
    }

    // TODO: Send to actual analytics service
    // Example: sendToAnalyticsService(analyticsEvent);
  };

  return { track };
};

// Common event names you might want to track:
export const ANALYTICS_EVENTS = {
  // Page views
  PAGE_VIEW: 'page_view',
  
  // Transaction events
  TRANSACTION_LIST_VIEWED: 'transaction_list_viewed',
  TRANSACTION_VIEWED: 'transaction_viewed',
  
  // Filter events
  FILTER_APPLIED: 'filter_applied',
  FILTER_CLEARED: 'filter_cleared',
  SEARCH_PERFORMED: 'search_performed',
  
  // Interaction events
  SORT_CHANGED: 'sort_changed',
  PAYMENT_METHOD_CLICKED: 'payment_method_clicked',
} as const;
