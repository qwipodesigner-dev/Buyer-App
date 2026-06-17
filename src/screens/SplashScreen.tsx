import { useEffect } from 'react';

// Splash animation per the attached reference (Splash Screen 5 → 8).
// Now uses the two brand SVGs as the source of truth. Both SVGs share the
// exact same viewBox (735.55 × 985.52) and shape geometry; only the fills
// differ — so cross-fading them gives a true seamless colour-morph:
//
//   0.00–0.45s  full lavender background, mark hidden
//   0.45–1.10s  qwipo-primary-white.svg scales in (1.25 → 1.0) and holds
//   1.10–1.80s  background fades lavender → white while the white SVG
//               cross-fades into qwipo-primary.svg at the SAME size
//   1.80–2.40s  steady on white with the colored primary mark
//   2.40s       advance to Login
//
// Tap-to-skip remains available.

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
        {/* Stage 1: white version of the primary brand SVG */}
        <img
          className="splash-logo splash-logo-white"
          src="/brand/qwipo-primary-white.svg"
          alt=""
        />
        {/* Stage 2: the standard primary brand SVG */}
        <img
          className="splash-logo splash-logo-primary"
          src="/brand/qwipo-primary.svg"
          alt="Qwipo"
        />
      </div>
    </div>
  );
}
