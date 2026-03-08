import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { loadData } from "../utils/storage";
import "../styles/Auth.css";

export default function SignIn({ onLogin }) {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const users = loadData("finsnap_users", []);
    const user  = users.find(u => u.email === email && u.password === password);
    if (!user) { setError("Invalid email or password."); return; }
    onLogin(user);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><Wallet size={20} color="#fff" /></div>
          <span>FinSnap</span>
        </div>
        <h2 className="auth-heading">Welcome back</h2>
        <p className="auth-sub">Sign in to your account</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Email</label>
            <input type="email" placeholder="gentle@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="auth-btn">Sign In</button>
        </form>

        <p className="auth-switch">Don't have an account? <span onClick={() => navigate("/signup")}>Sign Up</span></p>
      </div>
    </div>
  );
}