import { Icon, StatusBar } from '../components/Icons';

// Shown after Onboarding when the retailer's KYC verification fails or
// stays pending. Non-blocking dead-end for the demo: gives the user
// a clear reason, a Qwipo Support contact, and options to retry or
// return to Login.
const SUPPORT_PHONE = '+91 91212 22836';
const SUPPORT_EMAIL = 'info@qwipo.com';

export default function KycFailedScreen({ onBack, onRetry, onCallSupport }: any) {
  return (
    <div className="screen-body kyc-failed-screen">
      <StatusBar />
      <div className="top-bar">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          <Icon.Back />
        </button>
        <div className="top-title">
          <h1>KYC Verification</h1>
        </div>
      </div>

      <div className="kyc-body">
        <div className="kyc-icon" aria-hidden="true">
          <svg viewBox="0 0 96 96" width="96" height="96" fill="none">
            <circle cx="48" cy="48" r="44" fill="#FEF2F2" />
            <circle cx="48" cy="48" r="44" stroke="#EE404C" strokeWidth="2" />
            <path
              d="M48 30v22"
              stroke="#EE404C"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="48" cy="62" r="3" fill="#EE404C" />
          </svg>
        </div>

        <h2 className="kyc-title">Your KYC is Pending</h2>
        <p className="kyc-sub">
          We couldn't verify your KYC details right now. You won't be able
          to place orders until your KYC is completed.
        </p>

        <div className="kyc-support-card">
          <div className="kyc-support-head">
            <Icon.Phone />
            <div>
              <div className="kyc-support-title">Contact Qwipo Support</div>
              <div className="kyc-support-note">
                24/7 live assistance for orders, business essentials, and
                general inquiries.
              </div>
            </div>
          </div>
          <a
            className="kyc-support-phone"
            href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`}
            onClick={onCallSupport}
          >
            {SUPPORT_PHONE}
          </a>
          <a
            className="kyc-support-email"
            href={`mailto:${SUPPORT_EMAIL}`}
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>

      <div className="kyc-footer">
        <button className="kyc-retry-btn" onClick={onRetry}>
          Retry KYC
        </button>
        <a
          className="kyc-call-btn"
          href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`}
          onClick={onCallSupport}
        >
          <Icon.Phone /> Call Support
        </a>
      </div>
    </div>
  );
}
