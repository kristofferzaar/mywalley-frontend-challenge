# Solution

## Project Setup & Architecture

### Data Fetching: TanStack Query
Even though the data comes from a static JSON file, I chose to use TanStack Query to simulate a real API integration. This gives loading, error, and success states for free and mirrors how the app would behave against a real backend. As a direct result of this, I moved the data/transactions to ./public/api, this ensures that a real HTTP request will be fired.

### API Layer
Added a `transactionsApi.ts` that will ensure correct typed responses - it's also using `requests.ts`, a small fetch-wrapper to make it easy to add shared headers, swap the base URL, error handling etc.

### Routing & Layout
Created a React Router layout wrapper + opted for a separate page instead of a modal - simpler accessibility (no focus trap), natural navigation.
