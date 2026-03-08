import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import AddTransaction from "./pages/AddTransaction";

import { loadData, saveData } from "./utils/storage";
import { SEED_TRANSACTIONS, DEFAULT_BUDGETS } from "./utils/constants";

export default function App() {
  const [user,         setUser]         = useState(() => loadData("finsnap_session", null));
  const [transactions, setTransactions] = useState(() => loadData("finsnap_transactions", SEED_TRANSACTIONS));
  const [budgets,      setBudgets]      = useState(() => loadData("finsnap_budgets", DEFAULT_BUDGETS));

  useEffect(() => { saveData("finsnap_transactions", transactions); }, [transactions]);
  useEffect(() => { saveData("finsnap_budgets", budgets);           }, [budgets]);

  function handleLogin(u)  { saveData("finsnap_session", u); setUser(u); }
  function handleLogout()  { localStorage.removeItem("finsnap_session"); setUser(null); }

  function addTransaction(tx) {
    setTransactions(prev => [tx, ...prev]);
  }

  function updateTransaction(updated) {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
  }

  function deleteTransaction(id) {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  const txProps = { transactions, addTransaction, updateTransaction, deleteTransaction };

  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/signin" element={!user ? <SignIn onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <SignUp onLogin={handleLogin} /> : <Navigate to="/" />} />

     
        <Route path="/"                 element={user ? <Dashboard    {...txProps} user={user} onLogout={handleLogout} /> : <Navigate to="/signin" />} />
        <Route path="/transactions"     element={user ? <Transactions {...txProps} user={user} onLogout={handleLogout} /> : <Navigate to="/signin" />} />
        <Route path="/budget"           element={user ? <Budget       {...txProps} user={user} onLogout={handleLogout} budgets={budgets} setBudgets={setBudgets} /> : <Navigate to="/signin" />} />
        <Route path="/add-transaction"  element={user ? <AddTransaction addTransaction={addTransaction} user={user} onLogout={handleLogout} /> : <Navigate to="/signin" />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}