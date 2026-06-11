import { useState } from 'react';
import { Icon, StatusBar } from '../../components/Icons';
import { paymentMethods as initialMethods } from '../../data/mockData';

export default function PaymentScreen({ onBack }: any) {
  const [methods, setMethods] = useState(initialMethods);

  const setDefault = (id) => {
    setMethods(methods.map((m) => ({ ...m, isDefault: m.id === id })));
  };

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        <div className="top-bar">
          <button className="icon-btn" onClick={onBack}>
            <Icon.Back />
          </button>
          <div className="top-title">
            <h1>Payment Methods</h1>
            <p>{methods.length} saved</p>
          </div>
        </div>

        <div className="profile-section">
          <div className="profile-section-title">Linked Accounts</div>
          <div className="profile-card">
            {methods.map((m, i) => (
              <div
                key={m.id}
                className={`payment-row ${i === methods.length - 1 ? 'last' : ''} ${m.isDefault ? 'is-default' : ''}`}
              >
                <div className="payment-icon">{m.icon}</div>
                <div className="payment-info">
                  <div className="payment-label-row">
                    <span className="payment-label">{m.label}</span>
                    {m.isDefault && <span className="addr-default-pill">Default</span>}
                  </div>
                  <div className="payment-identifier">{m.identifier}</div>
                  <div className="payment-name">{m.name}</div>
                </div>
                <button
                  className="payment-action"
                  onClick={() => (m.isDefault ? null : setDefault(m.id))}
                >
                  {m.isDefault ? '✓' : 'Set default'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-section" style={{ paddingBottom: 30 }}>
          <div className="profile-section-title">Add Payment Method</div>
          <div className="profile-card">
            <button className="profile-menu-item">
              <span className="profile-menu-icon">🏦</span>
              <div className="profile-menu-text">
                <div className="profile-menu-label">Link a bank account</div>
                <div className="profile-menu-detail">Connect via account number + IFSC</div>
              </div>
              <Icon.ChevronRight />
            </button>
            <button className="profile-menu-item">
              <span className="profile-menu-icon">💳</span>
              <div className="profile-menu-text">
                <div className="profile-menu-label">Add credit/debit card</div>
                <div className="profile-menu-detail">Visa, Mastercard, RuPay</div>
              </div>
              <Icon.ChevronRight />
            </button>
            <button className="profile-menu-item last">
              <span className="profile-menu-icon">🟣</span>
              <div className="profile-menu-text">
                <div className="profile-menu-label">Add UPI ID</div>
                <div className="profile-menu-detail">Pay instantly via UPI</div>
              </div>
              <Icon.ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
