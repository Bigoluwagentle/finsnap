# FinSnap — Personal Finance Tracker

A clean, responsive personal finance tracker built with React. FinSnap helps users visualize their monthly income and expenses, manage budgets, and track spending across categories.

---

## Features

- **Dashboard** — Monthly overview with income, expense, and balance stats, a pie chart for expense breakdown by category, and a bar chart showing the last 6 months of income vs expenses
- **Transactions** — Full transaction history with search, category filter, and month filter. Supports adding, editing, and deleting transactions
- **Budget** — Set monthly budget limits per category and track how much you've spent vs your limit
- **Add Transaction** — Simple form to log income or expenses with amount, category, date, payment method, and description
- **Auth** — Sign up and sign in with per-user data isolation — each account only sees its own transactions
- **Persistent storage** — All data saved to localStorage, no backend required
- **Responsive** — Works on desktop, tablet, and mobile

---

## Tech Stack

- React (Create React App)
- React Router DOM
- Recharts (pie chart, bar chart)
- Lucide React (icons)
- localStorage for persistence

---

## Getting Started

### 1. Create the app

```bash
npx create-react-app finsnap
cd finsnap
```

### 2. Install dependencies

```bash
npm install react-router-dom recharts lucide-react
```

### 3. Replace the src folder

Copy all files from this project into your `src/` folder, replacing the defaults.

### 4. Add the DM Sans font

In `public/index.html`, add this inside the `<head>` tag:

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 5. Run the app

```bash
npm start
```

The app will open at `gentlefinsnapassessment.vercel.app`

---

## Project Structure

```
src/
├── App.js
├── App.css
├── index.js
├── components/
│   ├── Sidebar.jsx
│   └── Header.jsx
├── pages/
│   ├── SignIn.jsx
│   ├── SignUp.jsx
│   ├── Dashboard.jsx
│   ├── Transactions.jsx
│   ├── Budget.jsx
│   └── AddTransaction.jsx
├── styles/
│   ├── auth.css
│   ├── Dashboard.css
│   ├── Transactions.css
│   ├── Budget.css
│   ├── AddTransaction.css
│   ├── Sidebar.css
│   └── Header.css
└── utils/
    ├── constants.js
    └── storage.js
```

---

## Categories

| Category | Color |
|---|---|
| Housing & Utilities | Blue |
| Food & Dining | Green |
| Transportation | Yellow |
| Entertainment | Purple |
| Health | Red |
| Shopping | Pink |
| Education | Cyan |
| Travel | Orange |

---

## Future Improvements

- **Backend integration** — Replace localStorage with a real database (e.g. Firebase, Supabase or write my own backend code using Nodejs) so data persists across devices and browsers
- **Export to PDF** — Allow users to download a monthly financial report as a PDF
- **Recurring transactions** — Let users mark transactions as recurring (e.g. monthly rent, subscriptions) so they auto-populate each month
- **Multiple currencies** — Support different currencies with live exchange rate conversion
- **Spending insights** — Smart suggestions like "You spent 40% more on food this month than last month"
- **Transaction attachments** — Let users attach a photo of a receipt to a transaction
- **Dark/light mode toggle** — Currently dark mode only, add a theme switcher
- **Category customization** — Let users create, rename, and delete their own categories
- **Budget alerts** — Send a browser notification when a user is close to or over a budget limit
- **Data import** — Allow users to import transactions from a bank CSV export

---

## Notes

- No backend or database required all data persists via localStorage
- Each user account stores data separately signing in as a different user shows only their own transactions
- The app starts with no transactions users add their own data from scratch