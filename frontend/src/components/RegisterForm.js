import React, { useState } from "react";

function RegisterForm({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const res = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.message) {
        setMessage(`✅ ${data.message}`);
        onRegister(email);
      } else {
        setMessage(`❌ ${data.error || "Registration failed"}`);
      }
    } catch {
      setMessage("❌ Network error. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form-container">
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-header">
          <h3>Create Your Investor Profile</h3>
          <p>Join thousands of smart investors</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="name">
            <span className="label-icon">👤</span>
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">
            <span className="label-icon">✉️</span>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Creating Account...
            </>
          ) : (
            <>
              <span className="btn-icon">🚀</span>
              Start Investing
            </>
          )}
        </button>
        
        {message && (
          <div className={`message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </div>
        )}
        
        <div className="form-footer">
          <p className="terms">
            By registering, you agree to our 
            <a href="#"> Terms of Service</a> and 
            <a href="#"> Privacy Policy</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;