# Walley Frontend Developer Code Challenge

## Submission

See [Solution write-up](SOLUTION.md) and [Improvements & production considerations](IMPROVEMENTS.md) for details.

Regards,
Kristoffer Zaar

## Introduction

Welcome! We're excited to see how you approach building user-facing payment features at Walley.

This challenge simulates real work on our "My Payments" dashboard - a critical part of our product used by millions across the Nordics. You'll build features that help users understand and manage their payment history.

**Time expectation:** 3-4 hours

**What we're looking for:**
- Accessibility-first development (WCAG 2.1 AA)
- Clean, maintainable code
- Product thinking and pragmatic decisions
- Mobile-responsive design
- Modern React patterns with TypeScript

## The Challenge

Build a **"My Payments" dashboard** where users can:

1. **View their transaction history** - Display a list of past and upcoming payments
2. **Filter transactions** - By payment status, date range, and payment type
3. **View transaction details** - Click any transaction to see the full breakdown

### Context

- Our app runs on web **and** in mobile webviews (iOS/Android native shells)
- Users trust us with their money - clarity and accessibility are paramount
- We ship to production multiple times per week
- We work data-driven and track user interactions


## Requirements

### Must Have

✅ **Transaction List**
- Display all transactions from `transactions.json`
- Show: merchant name, amount, date, status, payment method
- Responsive grid/list layout that works on mobile and desktop

✅ **Filtering**
- Filter by payment status (all, completed, pending, failed, cancelled, active)
- Filter by payment type (all, full payment, installment)
- Filter by date range (last 30 days, last 3 months, last year, custom)
- Filters should work together (multiple active at once)

✅ **Transaction Detail View**
- Click transaction → show full details (modal or separate view)
- Display complete payment breakdown
- For installment payments: show payment schedule with past/upcoming installments
- Show payment method details
- Handle different transaction states appropriately

✅ **Accessibility (WCAG 2.1 AA)**
- Semantic HTML
- Keyboard navigation
- Screen reader support
- Proper focus management
- Color contrast compliance
- ARIA labels where appropriate

✅ **States & Error Handling**
- Loading states (can be simulated)
- Empty states (no transactions, no results from filters)
- Error states (graceful handling)

✅ **Code Quality**
- TypeScript throughout (minimal `any` usage)
- Clean component architecture
- Proper CSS organization using SCSS
- Reusable components where appropriate

### Nice to Have (Bonus Points)

🎁 **Analytics Integration**
- Use the provided `useAnalytics` hook to track user interactions
- Examples: filter applied, transaction viewed, etc.

🎁 **Advanced Features**
- Search transactions by merchant name
- Sort options (date, amount)
- Pagination or virtual scrolling for large lists
- Optimistic UI updates

🎁 **Testing**
- Unit tests for critical logic (filters, calculations)
- Component tests

🎁 **Performance**
- Code splitting
- Memoization where beneficial
- Bundle size awareness


## Design Guidelines

- **Mobile-first**: Design for small screens first, then enhance for larger screens
- **Touch targets**: Minimum 44x44px for mobile (use `$touch-target-min`)
- **Color contrast**: All text must meet WCAG AA standards (4.5:1 for normal text)
- **Status colors**: Use semantic colors from variables
  - Success: `$color-success`
  - Warning: `$color-warning`
  - Error: `$color-error`
  - Info: `$color-info`

## Edge Cases in the Data

The provided transaction data includes various edge cases to test your handling:

- **Overdue payments**: Transaction `txn_012` has a `nextPaymentDate` in the past
- **Failed payments**: Transactions with `status: "failed"` need special handling
- **Completed installments**: Some transactions have all installments paid
- **Cancelled transactions**: Status `"cancelled"` should be handled differently
- **Various frequencies**: Both `"biweekly"` and `"monthly"` payment schedules

## Deliverables

### 1. Working Code
- Push to a Git repository (GitHub, GitLab, Bitbucket, etc.)
- Include a commit history (we want to see your thought process)
- Ensure `npm install && npm run dev` works out of the box

### 3. Optional: Screen Recording
If you'd like, include a quick screen recording (2-3 min) walking through your solution and explaining key decisions.

## Tips

- **Start simple, iterate** - Get the core working before adding polish
- **Mobile first** - Remember the webview context
- **Think about real users** - They're checking their payments, possibly with concern
- **Document your thinking** - We want to understand your process
- **Don't over-engineer** - We value pragmatism over perfection
- **Use what's provided** - The utilities, types, and styles are there to help you

## Questions?

If anything is unclear or you need clarification, please reach out to bob.jelica@walley.se

We're happy to answer questions - we value good communication!

---

**Note:** This challenge represents 3-4 hours of focused work. We don't expect perfection - we want to see how you prioritize, solve problems, and write maintainable code. Quality over quantity.

Good luck! 🚀
