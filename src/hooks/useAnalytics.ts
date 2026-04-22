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

import { useCallback } from 'react';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  timestamp?: string;
}

export const useAnalytics = () => {
  const track = useCallback((event: string, properties?: Record<string, unknown>) => {
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
  }, []);

  return { track };
};

export const ANALYTICS_EVENTS = {
  // Page views
  PAGE_VIEW: 'page_view',
  TRANSACTION_LIST_VIEWED: 'transaction_list_viewed',
  TRANSACTION_VIEWED: 'transaction_viewed',

  // Filter funnel - did opening the panel lead to action?
  FILTER_PANEL_OPENED: 'filter_panel_opened',
  FILTER_PANEL_ABANDONED: 'filter_panel_abandoned',
  FILTERS_APPLIED: 'filters_applied',
  FILTERS_CLEARED: 'filters_cleared',
  SEARCH_PERFORMED: 'search_performed',

  // Needs attention - highest-stakes interactions
  ATTENTION_TRANSACTION_CLICKED: 'attention_transaction_clicked',
  PAY_NOW_INITIATED: 'pay_now_initiated',
  PAY_NOW_CONFIRMED: 'pay_now_confirmed',
  PAY_NOW_CANCELLED: 'pay_now_cancelled',

  // Future interactions (sort, search not yet implemented)
  SORT_CHANGED: 'sort_changed',
  PAYMENT_METHOD_CLICKED: 'payment_method_clicked',
} as const;
