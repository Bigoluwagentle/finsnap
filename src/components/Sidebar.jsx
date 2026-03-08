import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ListOrdered, PieChart, Plus, Settings, Wallet } from "lucide-react";
import "../styles/Sidebar.css"


const NAV = [
  { path: "/",             label: "Dashboard",    Icon: LayoutDashboard },
  { path: "/transactions", label: "Transactions", Icon: ListOrdered     },
  { path: "/budget",       label: "Budgets",      Icon: PieChart        },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate("/")}>
        <div className="sidebar-logo-icon"><Wallet size={18} color="#fff" /></div>
        <span className="sidebar-logo-text">FinSnap</span>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(({ path, label, Icon }) => (
          <button key={path} className={`sidebar-nav-btn${pathname === path ? " active" : ""}`} onClick={() => navigate(path)}><Icon size={17} /><span>{label}</span></button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-add-btn" onClick={() => navigate("/add-transaction")}><Plus size={16} /><span>Add Transaction</span></button>
        <button className="sidebar-settings-btn" onClick={() => navigate("/settings")}><Settings size={16} /><span>Settings</span></button>
      </div>
    </aside>
  );
}