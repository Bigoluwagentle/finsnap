import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { loadData, saveData } from "../utils/storage";
import "../styles/Auth.css";

export default function SignUp({ onLogin }) {
  const navigate = useNavigate();
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    const users = loadData("finsnap_users", []);
    if (users.find(u => u.email === email)) { setError("Email already registered."); return; }
    const user = { id: Date.now(), name, email, password };
    saveData("finsnap_users", [...users, user]);
    onLogin(user);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><Wallet size={20} color="#fff" /></div>
          <span>FinSnap</span>
        </div>
        <h2 className="auth-heading">Create account</h2>
        <p className="auth-sub">Start tracking your finances today</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Full Name</label>
            <input type="text" placeholder="Big Gentle" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input type="email" placeholder="gentle@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="auth-btn">Create Account</button>
        </form>

        <p className="auth-switch">Already have an account? <span onClick={() => navigate("/signin")}>Sign In</span></p>
      </div>
    </div>
  );
}