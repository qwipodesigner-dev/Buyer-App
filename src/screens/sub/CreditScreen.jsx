import { Icon, StatusBar } from '../../components/Icons';
import { userProfile } from '../../data/mockData';

const recentCreditTxns = [
  { id: 't1', date: '2026-06-05', label: 'Order #QW2401', amount: -7128, type: 'purchase' },
  { id: 't2', date: '2026-06-01', label: 'Repayment via UPI', amount: 5000, type: 'repay' },
  { id: 't3', date: '2026-05-25', label: 'Order #QW2395', amount: -11280, type: 'purchase' },
  { id: 't4', date: '2026-05-20', label: 'Repayment via UPI', amount: 10000, type: 'repay' },
  { id: 't5', date: '2026-05-15', label: 'Order #QW2390', amount: -1860, type: 'purchase' },
];

export default function CreditScreen({ onBack }) {
  const available = userProfile.creditLimit - userProfile.creditUsed;
  const creditPct = (userProfile.creditUsed / userProfile.creditLimit) * 100;
  const formatDate = (s) => new Date(s).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        <div className="top-bar">
          <button className="icon-btn" onClick={onBack}>
            <Icon.Back />
          </button>
          <div className="top-title">
            <h1>Qwipo Credit</h1>
            <p>30-day net terms</p>
          </div>
        </div>

        <div className="credit-hero">
          <div className="credit-hero-label">AVAILABLE TO SPEND</div>
          <div className="credit-hero-value">₹{available.toLocaleString('en-IN')}</div>
          <div className="mov-bar" style={{ background: 'rgba(255,255,255,0.25)', marginTop: 16 }}>
            <div className="mov-fill" style={{ width: `${creditPct}%`, background: '#ffffff' }} />
          </div>
          <div className="credit-hero-grid">
            <div>
              <div className="credit-hero-meta">Used</div>
              <div className="credit-hero-strong">₹{userProfile.creditUsed.toLocaleString('en-IN')}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="credit-hero-meta">Limit</div>
              <div className="credit-hero-strong">₹{userProfile.creditLimit.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <div className="credit-due-card">
            <div>
              <div className="credit-due-label">Next payment due</div>
              <div className="credit-due-date">15 June 2026</div>
            </div>
            <button className="credit-pay-btn">Pay ₹{userProfile.creditUsed.toLocaleString('en-IN')}</button>
          </div>
        </div>

        <div className="profile-section" style={{ paddingBottom: 30 }}>
          <div className="profile-section-title">Recent Activity</div>
          <div className="profile-card">
            {recentCreditTxns.map((t, i) => (
              <div
                key={t.id}
                className={`credit-txn ${i === recentCreditTxns.length - 1 ? 'last' : ''}`}
              >
                <div className="credit-txn-icon" style={{ background: t.type === 'repay' ? '#d1fae5' : '#fef3c7' }}>
                  {t.type === 'repay' ? '↑' : '↓'}
                </div>
                <div className="credit-txn-info">
                  <div className="credit-txn-label">{t.label}</div>
                  <div className="credit-txn-date">{formatDate(t.date)}</div>
                </div>
                <div className={`credit-txn-amount ${t.type === 'repay' ? 'pos' : ''}`}>
                  {t.amount > 0 ? '+' : ''}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
