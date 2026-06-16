import { useState } from 'react';
import { Icon } from '../components/Icons';

export default function LoginScreen({ onBack, onSubmit }: any) {
  const [phone, setPhone] = useState('');
  const valid = /^\d{10}$/.test(phone);

  return (
    <div className="auth-screen login-screen">
      <button className="icon-btn auth-back" onClick={onBack} aria-label="Back">
        <Icon.Back />
      </button>

      <div className="auth-brand">
        <div className="splash-q-circle small">
          <svg viewBox="0 0 248 248" fill="none">
            <circle cx="124" cy="124" r="124" fill="#BC77FF" />
            <path
              d="M130 156l27-15v-40l-34-19-33 19v40l36 21 19 11s5 4 15 5c0 0 6 1 18-3 0 0-1 5-6 8-5 3-5 7-18 9-13 3-26-5-27-6l-2-1-31-18-24-15V94l54-31 54 31v65l-27 16-21-13z"
              fill="#fff"
            />
          </svg>
        </div>
        <div className="splash-wordmark sm">
          <span className="qm-q">Q</span>wipo
        </div>
        <div className="splash-powered">
          <img src="/brand/digidukaan-logo.svg" alt="Powered by ONDC DigiDukaan" />
        </div>
      </div>

      <div className="auth-sheet">
        <h1 className="auth-title">Login</h1>
        <p className="auth-sub">Please enter your phone number</p>

        <div className="auth-phone-input">
          <div className="auth-cc">
            <span>+91</span>
            <Icon.ChevronDown />
          </div>
          <div className="auth-cc-sep" />
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            placeholder="Phone number"
          />
        </div>

        <button
          className={`auth-cta ${valid ? 'on' : ''}`}
          disabled={!valid}
          onClick={() => onSubmit(phone)}
        >
          Get OTP
        </button>

        <p className="auth-terms">
          By continuing, you agree to our <a>Terms of Service</a> and <a>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
