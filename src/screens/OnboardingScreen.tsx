import { useState } from 'react';
import { Icon } from '../components/Icons';

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

        <div className="ob-illustration">🧑‍🦱 📦</div>
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
