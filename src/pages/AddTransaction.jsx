import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header  from "../components/Header";
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from "../utils/constants";
import "../styles/Addtransaction.css";

export default function AddTransaction({ addTransaction, user, onLogout }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [amount,      setAmount]      = useState("");
  const [type,        setType]        = useState("expense");
  const [category,    setCategory]    = useState("");
  const [date,        setDate]        = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [method,      setMethod]      = useState("Credit Card");
  const [error,       setError]       = useState("");

  function handleSave(e) {
    e.preventDefault();
    if (!amount || !category) { setError("Amount and category are required."); return; }
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) { setError("Please enter a valid amount."); return; }
    addTransaction({
      id: Date.now(),
      amount: type === "expense" ? -Math.abs(val) : Math.abs(val),
      type, category, date, description, method,
    });
    navigate("/transactions");
  }

  const availableCategories = type === "income"
    ? [{ id: "income", label: "Income", color: "#10b981" }]
    : EXPENSE_CATEGORIES;

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-main">
        <Header user={user} onLogout={onLogout} pathname={pathname} />
        <div className="page-content">
          <div className="addtx-page">
            <div className="addtx-card">
              <div className="addtx-card-header">
                <h2 className="addtx-title">Add Transaction</h2>
                <p className="addtx-subtitle">Fill in the details for your new record</p>
              </div>

              <div className="addtx-form">
                {error && <div className="addtx-error">{error}</div>}

                <div className="addtx-field">
                  <label className="addtx-label">Transaction Amount</label>
                  <div className="addtx-amount-wrap">
                    <span className="addtx-dollar">$</span>
                    <input type="number" className="addtx-amount-input" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} min="0" step="0.01"/>
                  </div>
                </div>

                <div className="addtx-field">
                  <label className="addtx-label">Transaction Type</label>
                  <div className="addtx-type-row">
                    <button type="button" className={`addtx-type-btn${type === "expense" ? " expense-active" : ""}`} onClick={() => { setType("expense"); setCategory(""); }}><ArrowUpRight size={16} /> Expense {type === "expense" && "✓"}</button>
                    <button type="button" className={`addtx-type-btn${type === "income" ? " income-active" : ""}`} onClick={() => { setType("income"); setCategory("income"); }}><ArrowDownLeft size={16} /> Income {type === "income" && "✓"}</button>
                  </div>
                </div>

               
                <div className="addtx-row">
                  <div className="addtx-field">
                    <label className="addtx-label">Category</label>
                    <select className="addtx-select" value={category} onChange={e => setCategory(e.target.value)}>
                      <option value="">Select Category</option>
                      {availableCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="addtx-field">
                    <label className="addtx-label">Date</label>
                    <div className="addtx-date-wrap">
                      <Calendar size={15} className="addtx-date-icon" />
                      <input type="date" className="addtx-date-input" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="addtx-field">
                  <label className="addtx-label">Payment Method</label>
                  <select className="addtx-select" value={method} onChange={e => setMethod(e.target.value)}>{PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}</select>
                </div>

                <div className="addtx-field">
                  <label className="addtx-label">Description (Optional)</label>
                  <textarea className="addtx-textarea" placeholder="What was this for?" value={description} onChange={e => setDescription(e.target.value)} rows={3}/>
                </div>

                <div className="addtx-actions">
                  <button type="button" className="addtx-cancel" onClick={() => navigate(-1)}>Cancel</button>
                  <button type="button" className="addtx-submit" onClick={handleSave}>Save Transaction</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="page-footer">© 2026 Gentle FinSnap Assessment. Your financial clarity, simplified.</footer>
      </div>
    </div>
  );
}