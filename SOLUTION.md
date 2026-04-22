# Solution

The app is structured around two main pages: an **Overview** dashboard that surfaces what needs attention first, and a **Transactions** list with filtering and sorting. Selecting a transaction opens a detail page where installment schedules and pay-now actions live. Accessibility, analytics, and clean data-fetching patterns were treated as first-class requirements throughout.

---

## App structure

### Routing & Layout
Created a React Router layout wrapper + opted for a separate page instead of a modal - simpler accessibility (no focus trap), natural navigation.

### Overview page
The home page is a dashboard rather than a flat list. It prioritises transactions that need action (failed payments, overdue installments) in a visually distinct section at the top, followed by the 5 most recent non-attention transactions and a link to the full list.

### Transaction List
Each transaction renders as a card - this works well on mobile without needing a table or grid. Status is shown as a colored badge using the existing SCSS variables. The link has an `aria-label` with a formatted summary so screen readers announce something human-friendly rather than reading each span separately.

### Transaction List filters & sort
Filters are form-based rather than live - changes to the selects update local draft state inside `FilterPanel`, and the list only updates when the user submits the form. This is more accessible than live filtering: screen reader users aren't interrupted by list updates while navigating the controls, and keyboard users can adjust multiple filters before committing.

Filter state is split between `FilterPanel` (draft - what's in the form) and `useTransactionFilters` (applied - what filters the list). Submitting promotes draft to applied; clearing resets both.

The custom date range uses native `<input type="date">`, which provides a built-in accessible picker on all modern browsers. In a production environment this would be replaced with a fully custom date picker, or a vetted third party library.

Opted to use url query params to save the filter state between navigation & page loads, rather than relying on context or global state.

### Transaction Detail & Pay Now
The detail page derives the installment payment schedule from the plan's `nextPaymentDate` & paidInstallments, since individual installment dates aren't part of the data model.

It uses screen reader-friendly description lists for semantic key/value details.

The "Pay now" action optimistically patches the TanStack Query cache directly via `queryClient.setQueryData` - both the individual transaction entry and the list. Since the data is static there is no real mutation endpoint to call. With a real backend this would use TanStack Query's `useMutation`, which would call the API and then either invalidate the relevant queries (triggering a refetch) or update the cache from the mutation response.

Background refetching is also disabled (`staleTime: Infinity`, `refetchOnWindowFocus: false`) since static data never changes - a real app would remove these defaults and let TanStack Query's normal stale-while-revalidate behaviour apply.

### Accessibility

WCAG 2.1 AA compliance was treated as a strict requirement. [`@axe-core/react`](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/react) is wired into the dev build and logs violations to the console automatically - this caught several issues early that would otherwise have slipped through.

All pages score 100% on Lighthouse accessibility.

Specific things addressed along the way:

- Contrast ratios across status badges and secondary text - required introducing darker color tokens (`$color-error-dark`, `$color-warning-dark`, `$color-success-dark`) for text on light backgrounds
- Bullet masking characters (`••••`) were read aloud by screen readers - wrapped in `aria-hidden` and added an `sr-only` "ending in" to replace it
- Skip link placement: must be inside the `<main>` landmark to satisfy axe's landmark rules
- Transaction list items use a single `aria-label` via `formatTransactionLabel()` so screen readers announce a complete sentence rather than individual spans
- Overdue installment rows that show a "Pay now" button had no visible status text - a `sr-only` "Overdue" span was added so the state is announced before the action
- The transaction detail `<h1>` gets an `aria-label` that summarises the page context (installment plan, overdue status) so users know what needs attention before reading the full page

---

## Technical architecture

### Data Fetching: TanStack Query
Even though the data comes from a static JSON file, I chose to use TanStack Query to simulate a real API integration. This gives loading, error, and success states for free and mirrors how the app would behave against a real backend. As a direct result of this, I moved the data/transactions to ./public/api, this ensures that a real HTTP request will be fired.

### API Layer
Added a `transactionsApi.ts` that will ensure correct typed responses - it's also using `requests.ts`, a small fetch-wrapper to make it easy to add shared headers, swap the base URL, error handling etc.

### QueryWrapper
A generic wrapper component that handles loading, error and empty states in one place. Uses a render prop (`children` as a function) so the wrapper can pass typed, non-undefined data down - no `data &&` guards needed at the call site. Error state includes a retry button wired to TanStack Query `refetch`.

### Analytics
The README mentions working data-driven, so tried to focus on a few important sections.

Filter behaviour - do users who open the filter panel actually apply filters, or do they close it without acting? Events track panel opened, filters applied (with which filters and how many results), panel abandoned, and filters cleared.

Needs attention - the highest-stakes part of the UI. Events track when a user clicks into an attention transaction from the overview, and the full pay-now funnel: initiated, confirmed, and cancelled. This makes it possible to see drop-off between intent and completion.

Page views are tracked via a dedicated `usePageViewTracking` hook wired into the router, so every navigation fires a `page_view` event automatically. In development, React 18 StrictMode mounts effects twice intentionally - this causes duplicate events in dev but has no impact in production.

---

## Notes

### Test data
Most of the `nextPaymentDate` were overdue (old, static dates), but the instructions only mentioned `txn_012` as being in the past - modified the file to be more realistic.

### Error simulation
Transaction `txn_019` from XXL will throw an backend error, in case you want to test the friendly error handler.
