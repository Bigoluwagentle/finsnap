import React from "react";
import { Bell, LogOut } from "lucide-react";
import "../styles/Header.css";

const TITLES = {
  "/":                "Dashboard",
  "/transactions":    "Transaction History",
  "/budget":          "Budget Management",
  "/add-transaction": "Add Transaction",
  "/settings":        "Settings",
};

export default function Header({ user, onLogout, pathname }) {
  return (
    <header className="topbar">
      <span className="topbar-title">{TITLES[pathname] || "FinSnap"}</span>

      <div className="topbar-right">
        <Bell size={18} className="topbar-bell" />
        <div className="topbar-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <button className="topbar-logout" onClick={onLogout}><LogOut size={16} /></button>
      </div>
    </header>
  );
}