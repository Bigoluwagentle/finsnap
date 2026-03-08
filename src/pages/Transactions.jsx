import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, FileDown, Search, MoreHorizontal, Pencil, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header  from "../components/Header";
import { CATEGORIES, getCat, fmtAbs } from "../utils/constants";
import "../styles/Transactions.css";

const PAGE_SIZE = 10;

export default function Transactions({ transactions, deleteTransaction, user, onLogout }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [search,      setSearch]      = useState("");
  const [catFilter,   setCatFilter]   = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [page,        setPage]        = useState(1);
  const [openMenu,    setOpenMenu]    = useState(null);

  const months = useMemo(() => {
    const set = new Set(transactions.filter(t => t.date).map(t => t.date.slice(0, 7)));
    return [...set].sort().reverse();
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions
      .filter(t => {
        const matchSearch = !search ||
          t.description?.toLowerCase().includes(search.toLowerCase()) ||
          getCat(t.category).label.toLowerCase().includes(search.toLowerCase());
        const matchCat   = catFilter === "all"   || t.category === catFilter;
        const matchMonth = monthFilter === "all" || t.date?.startsWith(monthFilter);
        return matchSearch && matchCat && matchMonth;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, search, catFilter, monthFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function exportCSV() {
    const rows = [["Date","Description","Category","Method","Amount"]];
    filtered.forEach(t => rows.push([t.date, t.description, getCat(t.category).label, t.method, t.amount]));
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "finsnap-transactions.csv";
    a.click();
  }

  const Pagination = () => totalPages > 1 ? (
    <div className="tx-pagination">
      <span className="tx-pag-info">
        Showing <strong>{(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong>
      </span>
      <div className="tx-pag-controls">
        <button className="tx-page-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>‹</button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
          <button key={i+1} className={`tx-page-btn${page === i+1 ? " active" : ""}`} onClick={() => setPage(i+1)}>{i+1}</button>
        ))}
        {totalPages > 5 && <span className="tx-pag-ellipsis">... {totalPages}</span>}
        <button className="tx-page-btn" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>›</button>
      </div>
    </div>
  ) : null;

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header user={user} onLogout={onLogout} pathname={pathname} />
        <div className="page-content">

          <div className="tx-top">
            <div>
              <h1 className="tx-heading">Transactions</h1>
              <p className="tx-sub">Viewing all financial activity</p>
            </div>
            <div className="tx-actions">
              <button className="tx-export-btn" onClick={exportCSV}><FileDown size={15} /> Export CSV</button>
              <button className="tx-add-btn" onClick={() => navigate("/add-transaction")}><Plus size={15} /> New Transaction</button>
            </div>
          </div>

          <div className="tx-filters">
            <div className="tx-search-wrap">
              <Search size={13} className="tx-search-icon" />
              <input
                className="tx-search"
                placeholder="Search descriptions, merchants..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <select className="tx-select" value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}>
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <select className="tx-select" value={monthFilter} onChange={e => { setMonthFilter(e.target.value); setPage(1); }}>
              <option value="all">All Time</option>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            {(search || catFilter !== "all" || monthFilter !== "all") && (
              <button className="tx-clear" onClick={() => { setSearch(""); setCatFilter("all"); setMonthFilter("all"); setPage(1); }}>Clear</button>
            )}
          </div>

          <div className="tx-table-wrap">
            <table className="tx-table">
              <thead>
                <tr className="tx-thead-row">
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Method</th>
                  <th className="tx-right">Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 && (
                  <tr><td colSpan={6} className="tx-empty">No transactions found</td></tr>
                )}
                {paginated.map(t => {
                  const cat = getCat(t.category);
                  return (
                    <tr key={t.id} className="tx-row">
                      <td className="tx-cell tx-date">{new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                      <td className="tx-cell tx-desc">{t.description || cat.label}</td>
                      <td className="tx-cell"><span className="tx-badge" style={{ background: cat.color + "22", color: cat.color }}>{cat.label.split(" ")[0]}</span></td>
                      <td className="tx-cell">{t.method}</td>
                      <td className={`tx-cell tx-right tx-amount ${t.type}`}>{t.type === "income" ? "+" : ""}{fmtAbs(t.amount)}</td>
                      <td className="tx-cell tx-menu-cell">
                        <button className="tx-menu-btn" onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}><MoreHorizontal size={16} /></button>
                        {openMenu === t.id && (
                          <div className="tx-menu">
                            <button className="tx-menu-item" onClick={() => { setOpenMenu(null); navigate("/add-transaction", { state: { editing: t } }); }}><Pencil size={13} />Edit</button>
                            <button className="tx-menu-item danger" onClick={() => { deleteTransaction(t.id); setOpenMenu(null); }}><X size={13} /> Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination />
          </div>

          <div className="tx-card-list">
            {paginated.length === 0 && (
              <p className="tx-empty">No transactions found</p>
            )}
            {paginated.map(t => {
              const cat  = getCat(t.category);
              const Icon = cat.icon;
              return (
                <div key={t.id} className="tx-card">
                  <div className="tx-card-left">
                    <div className="tx-card-icon" style={{ background: cat.color + "22" }}>
                      <Icon size={17} color={cat.color} />
                    </div>
                    <div className="tx-card-info">
                      <p className="tx-card-desc">{t.description || cat.label}</p>
                      <div className="tx-card-meta">
                        <span>{new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        <span style={{ color: cat.color }}>· {cat.label.split(" ")[0]}</span>
                      </div>
                    </div>
                  </div>
                  <div className="tx-card-right">
                    <p className={`tx-card-amount ${t.type}`}>{t.type === "income" ? "+" : ""}{fmtAbs(t.amount)}</p>
                    <p className="tx-card-method">{t.method}</p>
                  </div>
                </div>
              );
            })}
            <Pagination />
          </div>

        </div>
        <footer className="page-footer">© 2026 Gentle FinSnap Assessment. Your financial clarity, simplified.</footer>
      </div>
    </div>
  );
}