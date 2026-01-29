import React from "react";

function PlanTable({ plans, planType = "monthly" }) {
  if (!plans || plans.length === 0) {
    return (
      <div className="empty-plans">
        <div className="empty-icon">📊</div>
        <h3>No Investment Plans Available</h3>
        <p>Check back later or try changing your investment type</p>
      </div>
    );
  }

  return (
    <div className="plans-container">
      <div className="plans-grid">
        {plans.map((plan, index) => (
          <div key={index} className="plan-card">
            {/* Use the CSS classes from App.css */}
            <div className="plan-header">
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-badge">
                {plan.amount <= 1000 ? "Beginner" : 
                 plan.amount <= 5000 ? "Intermediate" : "Advanced"}
              </div>
            </div>
            
            <div className="plan-details">
              <div className="detail-row">
                <span className="detail-label">Investment</span>
                <span className="detail-value highlight">
                  ₹{plan.amount} {planType === 'monthly' ? '/month' : '/year'}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Duration</span>
                <span className="detail-value">{plan.years} years</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Expected Return</span>
                <span className="detail-value return-highlight">
                  ₹{plan.return}
                </span>
              </div>
            </div>
            
            <div className="plan-actions">
              <button className="select-btn">Select Plan</button>
              <button className="details-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlanTable;