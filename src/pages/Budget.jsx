import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Pencil } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header  from "../components/Header";
import { EXPENSE_CATEGORIES, fmtAbs } from "../utils/constants";
import "../styles/Budget.css";

export default function Budget({ transactions, budgets, setBudgets, user, onLogout }) {
  const { pathname } = useLocation();
  const now = new Date();

  const [editingId, setEditingId] = useState(null);
  const [editVal,   setEditVal]   = useState("");

  const thisMonth = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === "expense";
  });

  const totalBudgeted = Object.values(budgets).reduce((s, v) => s + v, 0);
  const totalSpent    = thisMonth.reduce((s, t) => s + Math.abs(t.amount), 0);
  const remaining     = totalBudgeted - totalSpent;

  function saveEdit(id) {
    const val = parseFloat(editVal);
    if (!isNaN(val) && val >= 0) setBudgets(prev => ({ ...prev, [id]: val }));
    setEditingId(null);
  }

  function getStatus(spent, budget) {
    const pct = budget > 0 ? (spent / budget) * 100 : 0;
    if (spent > budget) return { label: "Over Budget", cls: "exceeded", pct: 100 };
    if (pct >= 75)      return { label: "Near Limit",  cls: "nearing",  pct };
    return                     { label: "Healthy",     cls: "safe",     pct };
  }

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header user={user} onLogout={onLogout} pathname={pathname} />
        <div className="page-content">

          <div className="budget-top">
            <div>
              <h1 className="budget-heading">Overview</h1>
              <p className="budget-sub">Monitoring your monthly allocation across categories.</p>
            </div>
          </div>

          <div className="budget-summary">
            {[
              { label: "Total Budgeted", value: totalBudgeted, sub: "Allocated for this month",  mod: "neutral" },
              { label: "Total Spent",    value: totalSpent,    sub: `${Math.round((totalSpent/totalBudgeted)*100)||0}% of total limit`, mod: "spent" },
              { label: "Remaining",      value: remaining,     sub: "Available to allocate",     mod: remaining >= 0 ? "safe" : "over" },
            ].map(({ label, value, sub, mod }) => (
              <div key={label} className="budget-summary-card">
                <p className="budget-summary-label">{label}</p>
                <p className={`budget-summary-value ${mod}`}>{fmtAbs(value)}</p>
                <p className="budget-summary-sub">{sub}</p>
              </div>
            ))}
          </div>

          <div className="budget-legend-row">
            <p className="budget-section-title">Spending Categories</p>
            <div className="budget-legend">
              <span>Safe</span>
              <span className="nearing">● Nearing</span>
              <span className="exceeded">● Exceeded</span>
            </div>
          </div>

          <div className="budget-list">
            {EXPENSE_CATEGORIES.map(cat => {
              const Icon   = cat.icon;
              const spent  = thisMonth.filter(t => t.category === cat.id).reduce((s, t) => s + Math.abs(t.amount), 0);
              const budget = budgets[cat.id] || 0;
              const status = getStatus(spent, budget);
              const left   = budget - spent;

              return (
                <div key={cat.id} className="budget-row">
                  <div className="budget-row-top">
                    <div className="budget-row-left">
                      <div className="budget-cat-icon" style={{ background: cat.color + "22" }}>
                        <Icon size={17} color={cat.color} />
                      </div>
                      <div>
                        <p className="budget-cat-name">{cat.label}</p>
                        <div className="budget-cat-meta">
                          <span className={`budget-status ${status.cls}`}>{status.label}</span>
                          <span className="budget-left">{left < 0 ? "-" : ""}${Math.abs(left).toFixed(2)} left</span>
                        </div>
                      </div>
                    </div>

                    <div className="budget-row-right">
                      {editingId === cat.id ? (
                        <div className="budget-edit-row">
                          <span>$</span>
                          <input type="number" className="budget-edit-input" value={editVal} onChange={e => setEditVal(e.target.value)} onKeyDown={e => { if (e.key === "Enter") saveEdit(cat.id); if (e.key === "Escape") setEditingId(null); }} autoFocus />
                          <button className="budget-save-btn" onClick={() => saveEdit(cat.id)}>Save</button>
                        </div>
                      ) : (
                        <>
                          <span className="budget-amounts">{fmtAbs(spent)} / {fmtAbs(budget)}</span>
                          <button className="budget-edit-btn" onClick={() => { setEditingId(cat.id); setEditVal(budget.toString()); }}><Pencil size={14} /></button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="budget-bar-track">
                    <div className={`budget-bar-fill ${status.cls}`} style={{ width: `${status.pct}%` }} />
                  </div>
                  <div className="budget-bar-labels">
                    <span>0%</span>
                    <span>{Math.round(status.pct)}% OF BUDGET UTILIZED</span>
                    <span>100%</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
        <footer className="page-footer">© 2026 Gentle FinSnap Assessment. Your financial clarity, simplified.</footer>
      </div>
    </div>
  );
}