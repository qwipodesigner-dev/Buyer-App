import { useEffect, useRef, useState } from 'react';
import { Icon } from '../components/Icons';

export default function OTPScreen({ phone, onBack, onVerify }: any) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [secs, setSecs] = useState(23);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (secs <= 0) return;
    const t = setInterval(() => setSecs((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secs]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const setAt = (i: number, v: string) => {
    const clean = v.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = clean;
    setDigits(next);
    if (clean && i < 5) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const code = digits.join('');
  const filled = code.length === 6;

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
        <h1 className="auth-title">OTP Verification</h1>
        <p className="auth-sub">
          Enter the verification code we just sent on your phone number{phone ? ` +91 ${phone}` : ''}.
        </p>

        <div className="otp-row">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className={`otp-cell ${d ? 'filled' : ''}`}
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => setAt(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
            />
          ))}
        </div>

        <button
          className={`auth-cta ${filled ? 'on' : ''}`}
          disabled={!filled}
          onClick={() => onVerify(code)}
        >
          Verify
        </button>

        <p className="auth-resend">
          Resend OTP in {secs}s{' '}
          <a
            className={secs === 0 ? 'active' : 'disabled'}
            onClick={() => {
              if (secs === 0) setSecs(23);
            }}
          >
            Resend OTP
          </a>
        </p>
      </div>
    </div>
  );
}
