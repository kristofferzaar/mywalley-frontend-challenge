# Solution

## Project Setup & Architecture

### Test data

Most of the `nextPaymentDate` were overdue (old, static dates), but the instructions only mentioned `txn_012` as being in the past - modified the file to be more realistic.

### Data Fetching: TanStack Query
Even though the data comes from a static JSON file, I chose to use TanStack Query to simulate a real API integration. This gives loading, error, and success states for free and mirrors how the app would behave against a real backend. As a direct result of this, I moved the data/transactions to ./public/api, this ensures that a real HTTP request will be fired.

### API Layer
Added a `transactionsApi.ts` that will ensure correct typed responses - it's also using `requests.ts`, a small fetch-wrapper to make it easy to add shared headers, swap the base URL, error handling etc.

### QueryWrapper
A generic wrapper component that handles loading, error and empty states in one place. Uses a render prop (`children` as a function) so the wrapper can pass typed, non-undefined data down - no `data &&` guards needed at the call site. Error state includes a retry button wired to TanStack Query `refetch`.

### Routing & Layout
Created a React Router layout wrapper + opted for a separate page instead of a modal - simpler accessibility (no focus trap), natural navigation.

### Overview page
The home page is a dashboard rather than a flat list. It prioritises transactions that need action (failed payments, overdue installments) in a visually distinct section at the top, followed by the 5 most recent non-attention transactions and a link to the full list.

### Transaction List
Each transaction renders as a card - this works well on mobile without needing a table or grid. Status is shown as a colored badge using the existing SCSS variables. The link has an `aria-label` with a formatted summary so screen readers announce something human-friendly rather than reading each span separately.

### Transaction List filters
Filters are form-based rather than live - changes to the selects update local draft state inside `FilterPanel`, and the list only updates when the user submits the form. This is more accessible than live filtering: screen reader users aren't interrupted by list updates while navigating the controls, and keyboard users can adjust multiple filters before committing.

Filter state is split between `FilterPanel` (draft - what's in the form) and `useTransactionFilters` (applied - what filters the list). Submitting promotes draft to applied; clearing resets both.

The custom date range uses native `<input type="date">`, which provides a built-in accessible picker on all modern browsers. In a production environment this would be replaced with a fully custom date picker, or a vetted third party library.

