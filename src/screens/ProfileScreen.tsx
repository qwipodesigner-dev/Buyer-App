import { useState } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import BottomNav from '../components/BottomNav';
import { SheetHeader, useSheetSwipe } from '../components/SheetBase';
import { userProfile } from '../data/mockData';

const SignOutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function ProfileScreen({ cartCount, onNavigate, onOpenSubPage }: any) {
  const [signOutOpen, setSignOutOpen] = useState(false);

  const initials = userProfile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const creditPct = (userProfile.creditUsed / userProfile.creditLimit) * 100;

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        {/* Top bar */}
        <div className="top-bar">
          <div className="top-title" style={{ paddingLeft: 4 }}>
            <h1>My Account</h1>
          </div>
          <button className="icon-btn" onClick={() => onOpenSubPage('settings')}>
            <Icon.Settings />
          </button>
        </div>

        {/* Profile hero */}
        <div className="profile-hero">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-name-row">
            <span className="profile-name">{userProfile.name}</span>
            {userProfile.kycVerified && (
              <span className="verified-badge" style={{ background: '#10b981' }}>
                <Icon.Check />
              </span>
            )}
          </div>
          <div className="profile-business">{userProfile.businessName}</div>
          <div className="profile-meta">
            <span>{userProfile.businessType}</span>
            <span className="seller-meta-dot"></span>
            <span>{userProfile.location}</span>
          </div>
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-value">{userProfile.totalOrders}</div>
              <div className="profile-stat-label">Orders</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">₹{userProfile.totalSavings.toLocaleString('en-IN')}</div>
              <div className="profile-stat-label">Saved</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{userProfile.memberSince}</div>
              <div className="profile-stat-label">Member since</div>
            </div>
          </div>
        </div>

        {/* Credit card */}
        <div className="profile-section">
          <button className="credit-card" onClick={() => onOpenSubPage('credit')}>
            <div className="credit-card-head">
              <div>
                <div className="credit-card-label">Qwipo Credit</div>
                <div className="credit-card-value">
                  ₹{(userProfile.creditLimit - userProfile.creditUsed).toLocaleString('en-IN')} available
                </div>
              </div>
              <span className="credit-card-cta">View →</span>
            </div>
            <div className="mov-bar" style={{ marginTop: 10 }}>
              <div className="mov-fill met" style={{ width: `${creditPct}%` }}></div>
            </div>
            <div className="mov-detail" style={{ marginTop: 6 }}>
              <span>
                Used: <strong>₹{userProfile.creditUsed.toLocaleString('en-IN')}</strong>
              </span>
              <span>
                Limit: <strong>₹{userProfile.creditLimit.toLocaleString('en-IN')}</strong>
              </span>
            </div>
          </button>
        </div>

        {/* Business details */}
        <div className="profile-section">
          <div className="profile-section-title">Business Details</div>
          <div className="profile-card">
            <ProfileRow label="Phone" value={userProfile.phone} />
            <ProfileRow label="Email" value={userProfile.email} />
            <ProfileRow label="GST" value={userProfile.gst} mono />
            <ProfileRow label="FSSAI" value={userProfile.fssai} mono last />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="profile-section">
          <div className="profile-section-title">Quick Actions</div>
          <div className="profile-card">
            <ProfileMenuItem icon="📍" label="Saved addresses" detail="3 addresses" onClick={() => onOpenSubPage('addresses')} />
            <ProfileMenuItem icon="🚚" label="Track orders" detail="2 in transit" onClick={() => onOpenSubPage('orders')} />
            <ProfileMenuItem icon="💳" label="Payment methods" detail="UPI, Card, Credit" onClick={() => onOpenSubPage('payment')} />
            <ProfileMenuItem icon="📄" label="Tax invoices" detail="Download GST reports" onClick={() => onOpenSubPage('invoices')} />
            <ProfileMenuItem icon="🎁" label="Refer & earn" detail="Earn ₹500 per referral" onClick={() => onOpenSubPage('refer')} last />
          </div>
        </div>

        {/* Settings */}
        <div className="profile-section" style={{ paddingBottom: 110 }}>
          <div className="profile-section-title">Settings & Support</div>
          <div className="profile-card">
            <ProfileMenuItem icon="🔔" label="Notification preferences" onClick={() => onOpenSubPage('notif-prefs')} />
            <ProfileMenuItem icon="🌐" label="Language" detail="English" onClick={() => onOpenSubPage('language')} />
            <ProfileMenuItem icon="🆘" label="Help & support" onClick={() => onOpenSubPage('help')} />
            <ProfileMenuItem icon="📜" label="Terms & privacy" onClick={() => onOpenSubPage('terms')} />
            <ProfileMenuItem icon="🚪" label="Sign out" danger last onClick={() => setSignOutOpen(true)} />
          </div>
        </div>
      </div>

      {/* Sign out confirmation */}
      {signOutOpen && (
        <SignOutSheet onClose={() => setSignOutOpen(false)} />
      )}

      <BottomNav active="profile" cartCount={cartCount} onNavigate={onNavigate} />
    </>
  );
}

function SignOutSheet({ onClose }: any) {
  const { dragHandlers, sheetStyle } = useSheetSwipe(onClose);
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet"
        style={{ ...sheetStyle, paddingBottom: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <SheetHeader
          icon={<SignOutIcon />}
          title="Sign out of Qwipo?"
          subtitle="You'll need to enter your phone number again to log back in."
          onClose={onClose}
          dragHandlers={dragHandlers}
        />
        <div style={{ display: 'flex', gap: 10, padding: '14px 20px 0' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 12,
              background: '#f3f4f6',
              color: '#111827',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 12,
              background: 'var(--destructive)',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ label, value, mono, last }: any) {
  return (
    <div className={`profile-row ${last ? 'last' : ''}`}>
      <span className="profile-row-label">{label}</span>
      <span className={`profile-row-value ${mono ? 'mono' : ''}`}>{value}</span>
    </div>
  );
}

function ProfileMenuItem({ icon, label, detail, danger, last, onClick }: any) {
  return (
    <button className={`profile-menu-item ${last ? 'last' : ''} ${danger ? 'danger' : ''}`} onClick={onClick}>
      <span className="profile-menu-icon">{icon}</span>
      <div className="profile-menu-text">
        <div className="profile-menu-label">{label}</div>
        {detail && <div className="profile-menu-detail">{detail}</div>}
      </div>
      <Icon.ChevronRight />
    </button>
  );
}
