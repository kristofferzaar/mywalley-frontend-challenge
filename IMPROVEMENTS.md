# IMPROVEMENTS

## Language & locale

- Proper localization of messages using formatjs, react-i18next or similar

## Needs attention list

- Right now we assume a small amount of transactions here. and show them all. If the attention list grows large, add a link to the filtered transactions view.

## Before production

- Remove the 1500ms simulated delay in `getTransactions`
- `QueryWrapper` error message is a static "Something went wrong" - should reflect the actual error type (network failure vs 404 vs 500) so users know whether to retry or contact support
