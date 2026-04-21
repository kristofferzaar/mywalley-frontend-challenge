# IMPROVEMENTS

## Language & locale

- Proper localization of messages using formatjs, react-i18next or similar

## Needs attention list

- Right now we assume a small amount of transactions here. and show them all. If the attention list grows large, add a link to the filtered transactions view.

## Date picker

- The custom date picker uses native `<input type="date">`, which provides a built-in accessible picker on all modern browsers. In a production environment this would be replaced with a fully custom date picker built to WCAG 2.1 AA, or a vetted library, to ensure consistent cross-browser styling and behaviour.

## Pay Now mutation

- The current "Pay now" action patches the TanStack Query cache directly via `queryClient.setQueryData`. With a real backend this should use `useMutation` to call the API endpoint, then either invalidate the relevant queries or update the cache from the mutation response. This ensures the UI reflects the server's actual state.

## Before production

- Remove the 1500ms simulated delay in `getTransactions`
- `QueryWrapper` error message is a static "Something went wrong" - should reflect the actual error type (network failure vs 404 vs 500) so users know whether to retry or contact support
- Remove DEMO_RECENT in transactionApi
- Re-enable TanStack Query's default refetching behaviour (`staleTime`, `refetchOnWindowFocus`, `refetchOnReconnect`) - currently disabled since the data is static
