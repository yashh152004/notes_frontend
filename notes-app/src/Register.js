import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validatePassword(pwd) {
    const regex = /^(?=.*[A-Z])(?=.*\d).{7,}$/;
    return regex.test(pwd);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!validatePassword(password)) {
      setError("Password must be at least 7 chars, include 1 uppercase & 1 number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/notes/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      localStorage.setItem("token", data.token);
      setAuth(true);
      navigate("/notes");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <h2 className="auth-title">Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          value={email}
          placeholder="Email"
          required
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          required
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
      <p className="auth-footer">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
