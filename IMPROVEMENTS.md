# IMPROVEMENTS

## Language & locale

- Proper localization of messages using formatjs, react-i18next or similar

## Needs attention list

- Right now we assume a small amount of transactions here. and show them all. If the attention list grows large, add a link to the filtered transactions view.

## Date picker

- The custom date picker uses native `<input type="date">`, which provides a built-in accessible picker on all modern browsers. In a production environment this would be replaced with a fully custom date picker built to WCAG 2.1 AA, or a vetted library, to ensure consistent cross-browser styling and behaviour.

## Before production

- Remove the 1500ms simulated delay in `getTransactions`
- `QueryWrapper` error message is a static "Something went wrong" - should reflect the actual error type (network failure vs 404 vs 500) so users know whether to retry or contact support
