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
  { id: "education",     label: "Education",            icon: BookOpen,    color: "#06b6d4" },
  { id: "travel",        label: "Travel",               icon: Plane,       color: "#f97316" },
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
  education:     200,
  travel:        300,
};

export const SEED_TRANSACTIONS = [];

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