import { useState } from 'react';
import { Icon, StatusBar } from '../components/Icons';

export default function LoginScreen({ onBack, onSubmit }: any) {
  const [phone, setPhone] = useState('');
  const valid = /^\d{10}$/.test(phone);

  return (
    <div className="auth-screen login-screen">
      <StatusBar />
      <button className="icon-btn auth-back" onClick={onBack} aria-label="Back">
        <Icon.Back />
      </button>

      <div className="auth-brand">
        <img
          className="auth-brand-logo"
          src="/brand/qwipo-primary.png"
          alt="Qwipo"
        />
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
