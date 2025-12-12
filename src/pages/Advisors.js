// src/pages/Advisors.js
import React from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import "./Advisors.css";

function Advisors() {
  // This page uses the premium/modal style layout from your Figma attachment.
  return (
    <div className="advisors-modal-page">
      <Header />

      <main className="advisors-modal-wrap">
        <div className="advisors-modal">
          <button className="modal-close" aria-label="Close">×</button>
          <div className="modal-top">
            <h1>Upgrade to Premium</h1>
            <p>Choose the perfect plan for your immigration journey</p>

            <div className="billing-toggle">
              <button className="toggle-btn active">Monthly</button>
              <button className="toggle-btn">Annual <span className="save">Save 20%</span></button>
            </div>
          </div>

          <div className="modal-body">
            <div className="plans-grid">
              <div className="plan-card">
                <div className="plan-icon">★</div>
                <h3>Free</h3>
                <p className="plan-sub">Perfect for getting started</p>
                <div className="plan-price">$0<span className="per">/mo</span></div>
                <div className="plan-cta disabled">Current Plan</div>
                <ul className="plan-features">
                  <li>Basic visa timeline tracking</li>
                  <li>Document storage (up to 10 files)</li>
                  <li>Immigration news feed</li>
                  <li>Community access</li>
                </ul>
              </div>

              <div className="plan-card popular">
                <div className="popular-badge">Most Popular</div>
                <div className="plan-icon">👑</div>
                <h3>Premium</h3>
                <p className="plan-sub">Most popular for individuals</p>
                <div className="plan-price">$6.5<span className="per">/mo</span></div>
                <div className="plan-cta primary">Upgrade Now</div>
                <ul className="plan-features">
                  <li>Everything in Free</li>
                  <li>Unlimited document storage</li>
                  <li>AI-powered document analysis</li>
                  <li>24/7 AI assistant access</li>
                </ul>
              </div>

              <div className="plan-card">
                <div className="plan-icon">🔒</div>
                <h3>University</h3>
                <p className="plan-sub">For institutions and businesses</p>
                <div className="plan-price">Contact Sales</div>
                <div className="plan-cta outline">Contact Sales</div>
                <ul className="plan-features">
                  <li>Everything in Premium</li>
                  <li>Unlimited student accounts</li>
                  <li>Advisor management system</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <div className="guarantees">
                <div>256-bit SSL<br/><span>Secure payments</span></div>
                <div>30-day<br/><span>Money-back guarantee</span></div>
                <div>24/7<br/><span>Premium support</span></div>
                <div>Cancel anytime<br/><span>No commitments</span></div>
              </div>

              <div className="faq">
                <h4>Frequently Asked Questions</h4>
                <p><strong>Can I switch plans later?</strong><br/>Yes, you can upgrade or downgrade your plan at any time.</p>
                <p><strong>Is my data secure?</strong><br/>We use bank-level encryption and comply with data protection regulations.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

export default Advisors;
