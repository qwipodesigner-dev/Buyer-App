import { useEffect } from 'react';

export default function SplashScreen({ onContinue }: any) {
  useEffect(() => {
    const t = setTimeout(onContinue, 2500);
    return () => clearTimeout(t);
  }, [onContinue]);

  return (
    <div className="auth-screen splash-screen" onClick={onContinue}>
      <div className="splash-stack">
        <div className="splash-q-circle">
          <svg viewBox="0 0 248 248" fill="none">
            <circle cx="124" cy="124" r="124" fill="#BC77FF" />
            <path
              d="M130 156l27-15v-40l-34-19-33 19v40l36 21 19 11s5 4 15 5c0 0 6 1 18-3 0 0-1 5-6 8-5 3-5 7-18 9-13 3-26-5-27-6l-2-1-31-18-24-15V94l54-31 54 31v65l-27 16-21-13z"
              fill="#fff"
            />
          </svg>
        </div>
        <div className="splash-wordmark">
          <span className="qm-q">Q</span>wipo
        </div>
        <div className="splash-powered">
          <img src="/brand/digidukaan-logo.svg" alt="Powered by ONDC DigiDukaan" />
        </div>
      </div>
    </div>
  );
}
