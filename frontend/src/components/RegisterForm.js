import React, { useState } from "react";
import "./RegisterForm.css"; // CSS import karo

function RegisterForm({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || name.length < 2) {
      setMessage("❌ Please enter a valid name (minimum 2 characters)");
      return;
    }
    
    if (!isValidEmail(email)) {
      setMessage("❌ Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    setMessage("");
    
    try {
      const res = await fetch("https://futurexyours-backend.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.toLowerCase().trim() 
        }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.message) {
        setMessage(`✅ ${data.message}`);
        setName("");
        setEmail("");
        if (onRegister) {
          onRegister(email.toLowerCase().trim());
        }
      } else {
        setMessage(`❌ ${data.error || "Registration failed. Please try again."}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("❌ Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form-container">
      <form onSubmit={handleSubmit} className="register-form" aria-label="Registration form">
        <div className="form-header">
          <h2>Create Your Investor Profile</h2>
          <p>Join thousands of smart investors</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="name">
            <span className="label-icon" aria-hidden="true">👤</span>
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
            minLength="2"
            maxLength="50"
            aria-required="true"
            aria-label="Full name"
          />
          <small className="hint">Minimum 2 characters</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">
            <span className="label-icon" aria-hidden="true">✉️</span>
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
            aria-required="true"
            aria-label="Email address"
            autoComplete="email"
          />
          <small className="hint">We'll never share your email</small>
        </div>
        
        <button
          type="submit"
          disabled={loading || !name.trim() || !email.trim()}
          className="submit-btn"
          aria-label={loading ? "Creating account..." : "Start investing"}
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true"></span>
              Creating Account...
            </>
          ) : (
            <>
              <span className="btn-icon" aria-hidden="true">🚀</span>
              Start Investing
            </>
          )}
        </button>
        
        {message && (
          <div 
            className={`message ${message.includes("✅") ? "success" : "error"}`}
            role="alert"
            aria-live="polite"
          >
            {message}
          </div>
        )}
        
        <div className="form-footer">
          <p className="terms">
            By registering, you agree to our 
            <a href="#" aria-label="Terms of Service"> Terms of Service</a> and 
            <a href="#" aria-label="Privacy Policy"> Privacy Policy</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;