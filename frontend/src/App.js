import React, { useState } from "react";
import RegisterForm from "./components/RegisterForm";
import PlanTable from "./components/PlanTable";
import "./App.css"; // We'll create this CSS file

function App() {
  const [plans, setPlans] = useState([]);
  const [planType, setPlanType] = useState("monthly");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterSuccess = async (email) => {
    setRegisteredEmail(email);
    setLoading(true);
    
    try {
      const response = await fetch(
        `http://localhost:3001/plans?type=${planType}&email=${encodeURIComponent(email)}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load plans");
      }
      
      const data = await response.json();
      setPlans(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanTypeChange = async (e) => {
    const newType = e.target.value;
    setPlanType(newType);
    
    if (registeredEmail) {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3001/plans?type=${newType}&email=${encodeURIComponent(registeredEmail)}`
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to load plans");
        }
        
        const data = await response.json();
        setPlans(data);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="app-container">
      {/* Header with Gradient */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-gradient">Future</span>
            <span className="title-accent">X</span>
            <span className="title-gradient">Yours</span>
          </h1>
          <p className="app-subtitle">Smart Investment Plans for Your Future</p>
        </div>
      </header>

      <main className="app-main">
        {/* Hero Section */}
        {!registeredEmail ? (
          <div className="hero-section">
            <div className="hero-card">
              <h2 className="hero-title">
                Start Your <span className="highlight">Investment Journey</span>
              </h2>
              <p className="hero-description">
                Register now to explore personalized investment plans tailored for your financial goals.
                Choose between monthly SIP or yearly investment options.
              </p>
              
              <div className="stats-container">
                <div className="stat-item">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">Investors</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">₹100Cr+</div>
                  <div className="stat-label">Assets Managed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">15%</div>
                  <div className="stat-label">Avg. Returns</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="welcome-section">
            <div className="welcome-card">
              <div className="welcome-header">
                <h2 className="welcome-title">
                  Welcome back, <span className="user-email">{registeredEmail}</span>
                </h2>
                <div className="user-badge">
                  <span className="badge-icon">👤</span>
                  <span>Premium Investor</span>
                </div>
              </div>
              
              <div className="plan-type-selector">
                <div className="selector-header">
                  <h3>Select Investment Type</h3>
                  <p>Choose your preferred investment frequency</p>
                </div>
                
                <div className="plan-buttons">
                  <button
                    className={`plan-button ${planType === 'monthly' ? 'active' : ''}`}
                    onClick={() => handlePlanTypeChange({ target: { value: 'monthly' } })}
                  >
                    <div className="button-icon">📅</div>
                    <div className="button-content">
                      <div className="button-title">Monthly SIP</div>
                      <div className="button-subtitle">Systematic Investment Plan</div>
                    </div>
                  </button>
                  
                  <button
                    className={`plan-button ${planType === 'yearly' ? 'active' : ''}`}
                    onClick={() => handlePlanTypeChange({ target: { value: 'yearly' } })}
                  >
                    <div className="button-icon">💰</div>
                    <div className="button-content">
                      <div className="button-title">Yearly Investment</div>
                      <div className="button-subtitle">Lump Sum Investment</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form */}
        {!registeredEmail && (
          <div className="registration-section">
            <div className="form-container">
              <RegisterForm onRegister={handleRegisterSuccess} />
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="error-alert">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <div className="alert-title">Something went wrong</div>
              <div className="alert-message">{error}</div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading investment plans...</p>
          </div>
        )}

        {/* Plans Display */}
        {!loading && plans.length > 0 && (
          <div className="plans-section">
            <div className="section-header">
              <h2 className="section-title">
                Available {planType === 'monthly' ? 'Monthly' : 'Yearly'} Plans
                <span className="plans-count"> ({plans.length} plans)</span>
              </h2>
              <p className="section-subtitle">
                Select a plan that matches your investment goals
              </p>
            </div>
            
            <PlanTable plans={plans} />
          </div>
        )}

        {/* Empty State */}
        {!loading && registeredEmail && plans.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3 className="empty-title">No plans available</h3>
            <p className="empty-description">
              Try changing the investment type or check back later for new plans.
            </p>
          </div>
        )}

        {/* Features Section */}
        <div className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h4 className="feature-title">Secure & Safe</h4>
              <p className="feature-description">
                Bank-level security with encrypted transactions
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h4 className="feature-title">High Returns</h4>
              <p className="feature-description">
                Curated plans with proven track records
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h4 className="feature-title">Flexible Investing</h4>
              <p className="feature-description">
                Start with as low as ₹500 per month
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👨‍💼</div>
              <h4 className="feature-title">Expert Guidance</h4>
              <p className="feature-description">
                Free consultation with financial experts
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>Future<span className="footer-accent">X</span>Yours</h3>
            <p>Building financial futures since 2024</p>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
            </div>
            
            <div className="link-group">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Contact Us</a>
              <a href="#">Privacy Policy</a>
            </div>
            
            <div className="link-group">
              <h4>Connect</h4>
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 FutureXYours. All rights reserved.</p>
          <p className="disclaimer">
            Investments are subject to market risks. Read all scheme related documents carefully.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;