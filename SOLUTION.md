# Solution

## Project Setup & Architecture

### Data Fetching: TanStack Query
Even though the data comes from a static JSON file, I chose to use TanStack Query to simulate a real API integration. This gives loading, error, and success states for free and mirrors how the app would behave against a real backend. As a direct result of this, I moved the data/transactions to ./public/api, this ensures that a real HTTP request will be fired.

### API Layer
Added a `transactionsApi.ts` that will ensure correct typed responses - it's also using `requests.ts`, a small fetch-wrapper to make it easy to add shared headers, swap the base URL, error handling etc.

### Routing & Layout
Created a React Router layout wrapper + opted for a separate page instead of a modal - simpler accessibility (no focus trap), natural navigation.

### Transaction List
Each transaction renders as a card - this works well on mobile without needing a table or grid. Status is shown as a colored badge using the existing SCSS variables. The link has an `aria-label` with a formatted summary so screen readers announce something human-friendly rather than reading each span separately.

### QueryWrapper
A generic wrapper component that handles loading, error and empty states in one place. Uses a render prop (`children` as a function) so the wrapper can pass typed, non-undefined data down - no `data &&` guards needed at the call site. Error state includes a retry button wired to TanStack Query `refetch`.

