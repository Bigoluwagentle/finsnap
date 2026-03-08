import {
  Home, Utensils, Car, Zap, Heart, ShoppingBag, TrendingUp, BookOpen, Plane
} from "lucide-react";

export const CATEGORIES = [
  { id: "housing",       label: "Housing & Utilities", icon: Home,        color: "#3b82f6" },
  { id: "food",          label: "Food & Dining",        icon: Utensils,    color: "#10b981" },
  { id: "transport",     label: "Transportation",       icon: Car,         color: "#f59e0b" },
  { id: "entertainment", label: "Entertainment",        icon: Zap,         color: "#8b5cf6" },
  { id: "health",        label: "Health",               icon: Heart,       color: "#ef4444" },
  { id: "shopping",      label: "Shopping",             icon: ShoppingBag, color: "#ec4899" },
  { id: "income",        label: "Income",               icon: TrendingUp,  color: "#10b981" },
];

export const EXPENSE_CATEGORIES = CATEGORIES.filter(c => c.id !== "income");

export const PAYMENT_METHODS = [
  "Credit Card", "Debit Card", "Bank Transfer",
  "Cash", "PayPal", "Apple Pay", "Direct Deposit", "Auto-pay",
];

export const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export const DEFAULT_BUDGETS = {
  housing:       1600,
  food:          600,
  transport:     250,
  entertainment: 150,
  health:        200,
  shopping:      300,
};

export const SEED_TRANSACTIONS = [
  { id: 1,  date: "2026-03-24", description: "Apple Store - MacBook Air",  category: "shopping",      method: "Credit Card",    amount: -1299.00, type: "expense" },
  { id: 2,  date: "2026-03-23", description: "Monthly Salary - TechCorp",  category: "income",        method: "Direct Deposit", amount:  5400.00, type: "income"  },
  { id: 3,  date: "2026-03-22", description: "Whole Foods Market",         category: "food",          method: "Debit Card",     amount:  -145.20, type: "expense" },
  { id: 4,  date: "2026-03-21", description: "Starbucks Coffee",           category: "food",          method: "Apple Pay",      amount:    -6.75, type: "expense" },
  { id: 5,  date: "2026-03-20", description: "Rent Payment - March",       category: "housing",       method: "Bank Transfer",  amount: -2100.00, type: "expense" },
  { id: 6,  date: "2026-03-19", description: "Freelance Design Project",   category: "income",        method: "PayPal",         amount:   850.00, type: "income"  },
  { id: 7,  date: "2026-03-18", description: "Shell Gas Station",          category: "transport",     method: "Credit Card",    amount:   -55.00, type: "expense" },
  { id: 8,  date: "2026-03-17", description: "Netflix Subscription",       category: "entertainment", method: "Auto-pay",       amount:   -19.99, type: "expense" },
  { id: 9,  date: "2026-03-16", description: "City Gym Membership",        category: "health",        method: "Debit Card",     amount:   -45.00, type: "expense" },
  { id: 10, date: "2026-03-15", description: "Dividend Payout",            category: "income",        method: "Brokerage",      amount:   125.40, type: "income"  },
  { id: 11, date: "2026-03-14", description: "Electricity Bill",           category: "housing",       method: "Auto-pay",       amount:   -89.00, type: "expense" },
  { id: 12, date: "2026-03-13", description: "Spotify Premium",            category: "entertainment", method: "Credit Card",    amount:    -9.99, type: "expense" },

  { id: "education", label: "Education", icon: BookOpen, color: "#06b6d4" },
  { id: "travel",    label: "Travel",    icon: Plane,    color: "#f97316" },

];

export function getCat(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[0];
}

export function fmtMoney(n) {
  const abs = Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (n >= 0 ? "+" : "-") + "$" + abs;
}

export function fmtAbs(n) {
  return "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}