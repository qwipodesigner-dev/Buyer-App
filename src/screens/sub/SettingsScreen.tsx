import { useState } from 'react';
import { Icon, StatusBar } from '../../components/Icons';

export default function SettingsScreen({ onBack, page = 'settings' }: any) {
  // Notification preferences
  const [notifPrefs, setNotifPrefs] = useState({
    orderUpdates: true,
    promotions: true,
    stockAlerts: true,
    priceDrops: false,
    creditReminders: true,
    weeklyDigest: false,
  });
  const toggle = (key) => setNotifPrefs((p) => ({ ...p, [key]: !p[key] }));

  // Language
  const [lang, setLang] = useState('en');
  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  ];

  const titles = {
    settings: 'Settings',
    'notif-prefs': 'Notification Preferences',
    language: 'Language',
    terms: 'Terms & Privacy',
    invoices: 'Tax Invoices',
    refer: 'Refer & Earn',
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
            <h1>{titles[page] || 'Settings'}</h1>
          </div>
        </div>

        {page === 'notif-prefs' && (
          <div className="profile-section" style={{ paddingBottom: 30 }}>
            <div className="profile-section-title">Choose what to be notified about</div>
            <div className="profile-card">
              <Toggle label="Order updates" detail="Dispatch, delivery, delays" value={notifPrefs.orderUpdates} onToggle={() => toggle('orderUpdates')} />
              <Toggle label="Promotions & offers" detail="Distributor and brand offers" value={notifPrefs.promotions} onToggle={() => toggle('promotions')} />
              <Toggle label="Stock alerts" detail="When favourite SKUs are restocked" value={notifPrefs.stockAlerts} onToggle={() => toggle('stockAlerts')} />
              <Toggle label="Price drops" detail="Alerts when prices fall on saved items" value={notifPrefs.priceDrops} onToggle={() => toggle('priceDrops')} />
              <Toggle label="Credit reminders" detail="Due date and limit alerts" value={notifPrefs.creditReminders} onToggle={() => toggle('creditReminders')} />
              <Toggle label="Weekly digest" detail="Summary of your savings and orders" value={notifPrefs.weeklyDigest} onToggle={() => toggle('weeklyDigest')} last />
            </div>
          </div>
        )}

        {page === 'language' && (
          <div className="profile-section" style={{ paddingBottom: 30 }}>
            <div className="profile-section-title">Choose your language</div>
            <div className="profile-card">
              {languages.map((l, i) => (
                <button
                  key={l.code}
                  className={`profile-menu-item ${i === languages.length - 1 ? 'last' : ''}`}
                  onClick={() => setLang(l.code)}
                >
                  <span className="profile-menu-icon">🌐</span>
                  <div className="profile-menu-text">
                    <div className="profile-menu-label">{l.name}</div>
                    <div className="profile-menu-detail">{l.native}</div>
                  </div>
                  {lang === l.code ? (
                    <span className="lang-check">✓</span>
                  ) : (
                    <Icon.ChevronRight />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {page === 'terms' && (
          <div className="profile-section" style={{ paddingBottom: 30 }}>
            <div className="terms-body">
              <h3>Terms of Service</h3>
              <p>By using Qwipo's B2B Commerce Platform, you agree to procure goods through verified distributors, wholesalers, and manufacturers. Orders, pricing, and delivery commitments are between you and the respective seller.</p>
              <h3>Privacy</h3>
              <p>We collect order, address, GST and contact information to operate this service. Your data is encrypted in transit and at rest. We never sell your information.</p>
              <h3>Returns & Refunds</h3>
              <p>Returns are processed per the policy of the originating seller. Refunds are credited to your original payment method within 7 working days.</p>
              <h3>Credit Terms</h3>
              <p>Qwipo Credit operates on 30-day net terms. Late payments incur 2% monthly interest. Credit limits are reviewed quarterly based on transaction history.</p>
              <h3>Contact</h3>
              <p>For grievances, write to grievance@qwipo.com or call our support helpline.</p>
            </div>
          </div>
        )}

        {page === 'invoices' && (
          <div className="profile-section" style={{ paddingBottom: 30 }}>
            <div className="profile-section-title">Download GST Reports</div>
            <div className="profile-card">
              {['June 2026', 'May 2026', 'April 2026', 'March 2026', 'February 2026', 'January 2026'].map((m, i, arr) => (
                <button key={m} className={`profile-menu-item ${i === arr.length - 1 ? 'last' : ''}`}>
                  <span className="profile-menu-icon">📄</span>
                  <div className="profile-menu-text">
                    <div className="profile-menu-label">{m}</div>
                    <div className="profile-menu-detail">B2B invoice GSTR-1 ready</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#2563eb' }}>Download</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {page === 'refer' && (
          <>
            <div className="refer-hero">
              <div style={{ fontSize: 48, marginBottom: 8 }}>🎁</div>
              <div className="refer-headline">Earn ₹500 per friend</div>
              <div className="refer-sub">Refer a kirana store. When they place their first order over ₹2,000, you both get ₹500 in Qwipo Credit.</div>
            </div>
            <div className="profile-section">
              <div className="refer-code-card">
                <div>
                  <div className="refer-code-label">YOUR CODE</div>
                  <div className="refer-code-value">VIKAS500</div>
                </div>
                <button className="credit-pay-btn" style={{ padding: '10px 16px' }}>Share</button>
              </div>
            </div>
            <div className="profile-section" style={{ paddingBottom: 30 }}>
              <div className="profile-section-title">Your earnings</div>
              <div className="profile-card">
                <div className="profile-row">
                  <span className="profile-row-label">Total referrals</span>
                  <span className="profile-row-value">8</span>
                </div>
                <div className="profile-row">
                  <span className="profile-row-label">Successful orders</span>
                  <span className="profile-row-value">5</span>
                </div>
                <div className="profile-row last">
                  <span className="profile-row-label">Credit earned</span>
                  <span className="profile-row-value" style={{ color: '#059669' }}>₹2,500</span>
                </div>
              </div>
            </div>
          </>
        )}

        {page === 'settings' && (
          <div className="profile-section" style={{ paddingBottom: 30 }}>
            <div className="profile-section-title">General</div>
            <div className="profile-card">
              <Toggle label="Dark mode" detail="Use dark theme" value={false} onToggle={() => {}} />
              <Toggle label="Biometric login" detail="Use fingerprint or face unlock" value={true} onToggle={() => {}} />
              <Toggle label="Sound effects" detail="Tap and success tones" value={true} onToggle={() => {}} last />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Toggle({ label, detail, value, onToggle, last }: any) {
  return (
    <button className={`toggle-row ${last ? 'last' : ''}`} onClick={onToggle}>
      <div className="profile-menu-text">
        <div className="profile-menu-label">{label}</div>
        {detail && <div className="profile-menu-detail">{detail}</div>}
      </div>
      <span className={`toggle-switch ${value ? 'on' : ''}`}>
        <span className="toggle-knob" />
      </span>
    </button>
  );
}
