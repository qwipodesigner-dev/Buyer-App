import { useState } from 'react';
import { Icon, StatusBar } from '../components/Icons';

const BUSINESS_TYPES = [
  'Kirana Store',
  'Supermarket',
  'Pharmacy',
  'FMCG Retailer',
  'Restaurant / HORECA',
  'General Store',
];

export default function OnboardingScreen({ onBack, onProceed }: any) {
  const [location, setLocation] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [typeOpen, setTypeOpen] = useState(false);

  const valid = location.trim() && businessName.trim() && businessType;

  return (
    <div className="screen-body onboarding-screen">
      <StatusBar />
      <div className="top-bar">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          <Icon.Back />
        </button>
        <div className="top-title">
          <h1>On Boarding</h1>
        </div>
      </div>

      <div className="onboarding-body">
        <div className="ob-field">
          <label className="ob-label">
            Shop Location<span className="ob-req">*</span>
          </label>
          <div className="ob-input">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Fetch using GPS"
            />
            <button
              className="ob-suffix"
              onClick={() => setLocation('Rai Durg, Hitech City, Hyderabad')}
              aria-label="Use GPS"
            >
              <Icon.MapPin />
            </button>
          </div>
        </div>

        <div className="ob-field">
          <label className="ob-label">
            Business Name<span className="ob-req">*</span>
          </label>
          <div className="ob-input">
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter Business name"
            />
          </div>
        </div>

        <div className="ob-field">
          <label className="ob-label">
            Business Type<span className="ob-req">*</span>
          </label>
          <button className="ob-input ob-select" onClick={() => setTypeOpen(!typeOpen)}>
            <span className={businessType ? 'on' : 'placeholder'}>
              {businessType || 'Select business type'}
            </span>
            <Icon.ChevronDown />
          </button>
          {typeOpen && (
            <div className="ob-dropdown">
              {BUSINESS_TYPES.map((t) => (
                <button
                  key={t}
                  className={`ob-option ${t === businessType ? 'on' : ''}`}
                  onClick={() => {
                    setBusinessType(t);
                    setTypeOpen(false);
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        <OnboardingIllustration />
      </div>

      <div className="ob-footer">
        <button
          className={`auth-cta ${valid ? 'on' : ''}`}
          disabled={!valid}
          onClick={onProceed}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}

// Loads /onboarding-illustration.png if present; falls back to a brand-aligned
// inline SVG (man with thumbs-up + stacked purple boxes on a dolly) so the
// screen never looks empty.
function OnboardingIllustration() {
  return (
    <div className="ob-illustration">
      <img
        src="/onboarding-illustration.png"
        alt=""
        onError={(e) => {
          // Hide the broken image, reveal the SVG fallback sibling
          const el = e.currentTarget as HTMLImageElement;
          el.style.display = 'none';
          (el.nextElementSibling as HTMLElement | null)?.style.setProperty(
            'display',
            'block'
          );
        }}
      />
      <svg
        className="ob-illustration-fallback"
        viewBox="0 0 240 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ display: 'none' }}
      >
        {/* ground shadow */}
        <ellipse cx="160" cy="178" rx="64" ry="6" fill="#EDE9FE" />
        <ellipse cx="58" cy="184" rx="34" ry="4" fill="#EDE9FE" />
        {/* dolly wheels */}
        <circle cx="124" cy="172" r="9" fill="#3F2D6B" />
        <circle cx="124" cy="172" r="3" fill="#fff" />
        <circle cx="200" cy="172" r="9" fill="#3F2D6B" />
        <circle cx="200" cy="172" r="3" fill="#fff" />
        {/* dolly platform */}
        <rect x="116" y="158" width="92" height="8" rx="2" fill="#3F2D6B" />
        <rect x="208" y="60" width="4" height="106" fill="#9CA3AF" />
        {/* boxes — large, medium, small */}
        <rect x="124" y="120" width="78" height="38" fill="#C4A0FF" />
        <rect x="124" y="120" width="78" height="6" fill="#A788E8" />
        <rect x="132" y="88" width="64" height="32" fill="#B589FF" />
        <rect x="132" y="88" width="64" height="5" fill="#9C70E8" />
        <rect x="142" y="62" width="46" height="26" fill="#A576FF" />
        <rect x="142" y="62" width="46" height="4" fill="#8C5DE8" />
        {/* barcode bits */}
        <rect x="134" y="135" width="20" height="14" fill="#fff" />
        <rect x="136" y="137" width="1" height="10" fill="#252525" />
        <rect x="139" y="137" width="1.5" height="10" fill="#252525" />
        <rect x="143" y="137" width="1" height="10" fill="#252525" />
        <rect x="146" y="137" width="1.5" height="10" fill="#252525" />
        {/* speech bubble with checklist */}
        <rect x="170" y="20" width="46" height="36" rx="6" fill="#fff" stroke="#D1C4F0" strokeWidth="1.5" />
        <circle cx="180" cy="28" r="2.5" fill="#BC77FF" />
        <rect x="186" y="26.5" width="22" height="3" rx="1" fill="#BC77FF" />
        <circle cx="180" cy="38" r="2.5" fill="#BC77FF" />
        <rect x="186" y="36.5" width="22" height="3" rx="1" fill="#BC77FF" />
        <circle cx="180" cy="48" r="2.5" fill="#BC77FF" />
        <rect x="186" y="46.5" width="22" height="3" rx="1" fill="#BC77FF" />
        {/* character — head + body simplified */}
        <circle cx="58" cy="56" r="14" fill="#F3D5B5" />
        <path d="M44 50 Q58 38 72 50 L72 44 Q58 30 44 44 Z" fill="#2A2F3A" />
        <path
          d="M40 78 Q40 70 58 70 Q76 70 76 78 L80 130 Q80 138 72 138 L44 138 Q36 138 36 130 Z"
          fill="#BC77FF"
        />
        <path d="M58 88 L58 138 M36 130 L40 168 M80 130 L78 168" stroke="#3F2D6B" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* shoes */}
        <ellipse cx="42" cy="178" rx="9" ry="4" fill="#1F2937" />
        <ellipse cx="78" cy="178" rx="9" ry="4" fill="#1F2937" />
        {/* clipboard */}
        <rect x="30" y="92" width="20" height="26" rx="2" fill="#fff" stroke="#D1C4F0" strokeWidth="1.5" />
        <rect x="34" y="98" width="12" height="2" fill="#BC77FF" />
        <rect x="34" y="103" width="9" height="2" fill="#D1C4F0" />
        <rect x="34" y="108" width="11" height="2" fill="#D1C4F0" />
        {/* thumbs up arm */}
        <path d="M70 64 Q92 56 96 38" stroke="#F3D5B5" strokeWidth="10" fill="none" strokeLinecap="round" />
        <circle cx="96" cy="34" r="7" fill="#F3D5B5" />
        <rect x="92" y="22" width="6" height="9" rx="2" fill="#F3D5B5" />
      </svg>
    </div>
  );
}
