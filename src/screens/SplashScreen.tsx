import { useEffect } from 'react';

// Splash animation per the attached reference (Splash Screen 5 → 8):
//   0.00–0.45s  full lavender background, no logo
//   0.45–1.10s  white Q icon scales in (1.6 → 1.0), staying centred
//   1.10–1.80s  background fades lavender → white, white icon dissolves
//               into the primary (lavender) Qwipo logo at the same spot
//   1.80–2.40s  steady on white with primary logo
//   2.40s       advance to Login
//
// The whole choreography lives in CSS keyframes so a tap-to-skip still works
// — clicking the splash advances immediately.

const TOTAL_MS = 2400;

export default function SplashScreen({ onContinue }: any) {
  useEffect(() => {
    const t = setTimeout(onContinue, TOTAL_MS);
    return () => clearTimeout(t);
  }, [onContinue]);

  return (
    <div
      className="auth-screen splash-screen-v2"
      onClick={onContinue}
      role="button"
      aria-label="Tap to continue"
    >
      <div className="splash-stage" aria-hidden="true">
        {/* Stage 1: White icon-only logo, visible on the lavender bg */}
        <img
          className="splash-logo splash-logo-white"
          src="/brand/qwipo-icon-white.png"
          alt=""
        />
        {/* Stage 2: Primary logo (lavender ring + wipo wordmark) on white bg */}
        <img
          className="splash-logo splash-logo-primary"
          src="/brand/qwipo-primary.png"
          alt="Qwipo"
        />
      </div>
    </div>
  );
}
