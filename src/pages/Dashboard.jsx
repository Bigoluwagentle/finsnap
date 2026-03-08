import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  PieChart as RPieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header  from "../components/Header";
import { EXPENSE_CATEGORIES, MONTHS, getCat, fmtAbs } from "../utils/constants";
import "../styles/Dashboard.css";

export default function Dashboard({ transactions, user, onLogout }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const now = new Date();

  const monthOptions = [0, 1, 2].map(i => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return { key: i, label: MONTHS[d.getMonth()], month: d.getMonth(), year: d.getFullYear() };
  });

  const [selectedKey, setSelectedKey] = useState(0);
  const sel = monthOptions[selectedKey];

  const filtered = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === sel.month && d.getFullYear() === sel.year;
  });

  const totalIncome   = filtered.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = filtered.filter(t => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);
  const netBalance    = totalIncome - totalExpenses;

  const pieData = EXPENSE_CATEGORIES.map(c => ({
    name:  c.label.split(" ")[0],
    value: filtered.filter(t => t.category === c.id).reduce((s, t) => s + Math.abs(t.amount), 0),
    color: c.color,
  })).filter(d => d.value > 0);

  const topCat = [...pieData].sort((a, b) => b.value - a.value)[0];

  const barData = Array.from({ length: 6 }, (_, i) => {
    const d  = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const mo = d.getMonth();
    const yr = d.getFullYear();
    const slice = transactions.filter(t => {
      const td = new Date(t.date);
      return td.getMonth() === mo && td.getFullYear() === yr;
    });
    return {
      name:     MONTHS[mo],
      Income:   slice.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0),
      Expenses: slice.filter(t => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0),
    };
  });

  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header user={user} onLogout={onLogout} pathname={pathname} />
        <div className="page-content">

          <div className="dash-top">
            <div>
              <h1 className="dash-heading">Financial Overview</h1>
              <p className="dash-sub">Monitor your income and spending for {sel.label} {sel.year}</p>
            </div>
            <div className="dash-month-tabs">
              {monthOptions.map(m => (
                <button key={m.key} className={`dash-month-tab${selectedKey === m.key ? " active" : ""}`} onClick={() => setSelectedKey(m.key)}>{m.label}</button>
              ))}
            </div>
          </div>

          <div className="dash-stats">
            {[
              { label: "Total Income",   value: totalIncome,   Icon: ArrowDownLeft, mod: "income"  },
              { label: "Total Expenses", value: totalExpenses, Icon: ArrowUpRight,  mod: "expense" },
              { label: "Net Balance",    value: netBalance,    Icon: Wallet,        mod: "balance" },
            ].map(({ label, value, Icon, mod }) => (
              <div key={label} className="stat-card">
                <div className="stat-card-body">
                  <div>
                    <p className="stat-label">{label}</p>
                    <p className="stat-value">{fmtAbs(value)}</p>
                  </div>
                  <div className={`stat-icon stat-icon-${mod}`}>
                    <Icon size={18} color="#fff" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="dash-charts">
            <div className="chart-card">
              <p className="chart-title">Expense Breakdown</p>
              <p className="chart-sub">Distribution by category</p>
              {pieData.length === 0 ? (
                <div className="chart-empty">No expense data this month</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <RPieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={2}>
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={v => fmtAbs(v)} contentStyle={{ background: "#1e2d3d", border: "none", borderRadius: 8, color: "#f1f5f9", fontSize: 12 }} />
                    </RPieChart>
                  </ResponsiveContainer>
                  <div className="chart-legend">
                    {pieData.map((d, i) => (
                      <div key={i} className="chart-legend-item">
                        <span className="chart-legend-dot" style={{ background: d.color }} />
                        {d.name}
                      </div>
                    ))}
                  </div>
                  {topCat && <p className="chart-top-cat">TOP CATEGORY · <strong>{topCat.name} ({fmtAbs(topCat.value)})</strong></p>}
                </>
              )}
            </div>

            <div className="chart-card">
              <p className="chart-title">Monthly Trend</p>
              <p className="chart-sub">Income vs Expenses (Last 6 Months)</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={barData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => "$" + (v/1000).toFixed(0) + "k"} />
                  <Tooltip formatter={v => fmtAbs(v)} contentStyle={{ background: "#1e2d3d", border: "none", borderRadius: 8, color: "#f1f5f9", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
                  <Bar dataKey="Income"   fill="#10b981" radius={[4,4,0,0]} />
                  <Bar dataKey="Expenses" fill="#ef4444" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="recent-card">
            <div className="recent-header">
              <p className="recent-title">Recent Transactions</p>
              <span className="recent-link" onClick={() => navigate("/transactions")}>View all transactions</span>
            </div>
            {recent.length === 0 ? (
              <p className="recent-empty">No transactions yet. <span onClick={() => navigate("/add-transaction")}>Add one →</span></p>
            ) : (
              recent.map(t => {
                const cat  = getCat(t.category);
                const Icon = cat.icon;
                return (
                  <div key={t.id} className="recent-row">
                    <div className="recent-left">
                      <div className="recent-icon" style={{ background: cat.color + "22" }}>
                        <Icon size={16} color={cat.color} />
                      </div>
                      <div>
                        <p className="recent-desc">{t.description || cat.label}</p>
                        <p className="recent-meta">
                          {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          {" · "}<span style={{ color: cat.color }}>{cat.label}</span>
                        </p>
                      </div>
                    </div>
                    <div className="recent-right">
                      <p className={`recent-amount ${t.type}`}>{t.type === "income" ? "+" : ""}{fmtAbs(t.amount)}</p>
                      <p className="recent-usd">USD</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
        <footer className="page-footer">© 2026 Gentle FinSnap Assessment. Your financial clarity, simplified.</footer>
      </div>
    </div>
  );
}