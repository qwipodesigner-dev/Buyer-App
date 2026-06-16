import { useState } from 'react';
import { Icon } from './Icons';
import { SheetHeader, useSheetSwipe } from './SheetBase';

// Map-picker sheet for adding a new delivery address.
// Real impl would embed a Google Maps / Mapbox view; here we render an
// illustrative map background with a centered pin so the flow is testable
// end-to-end without API keys.

type AddressType = 'Shop' | 'Home' | 'Warehouse';

const TYPE_ICONS: Record<AddressType, string> = {
  Shop: '🏪',
  Home: '🏠',
  Warehouse: '📦',
};

export default function AddAddressSheet({ onClose, onSave }: any) {
  const { dragHandlers, sheetStyle } = useSheetSwipe(onClose);
  const [step, setStep] = useState<'map' | 'form'>('map');
  const [type, setType] = useState<AddressType>('Shop');
  const [name, setName] = useState('Sri Venkateswara Kirana Store');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [pincode, setPincode] = useState('');
  const [contact, setContact] = useState('+91 ');

  const canSave = line1.trim().length > 0 && pincode.length === 6;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet sheet-tall"
        style={sheetStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <SheetHeader
          icon={<Icon.MapPin />}
          title={step === 'map' ? 'Select location' : 'Address details'}
          subtitle={
            step === 'map'
              ? 'Move the pin to mark your shop'
              : 'Confirm the address that came back from the map'
          }
          onClose={onClose}
          dragHandlers={dragHandlers}
        />

        {step === 'map' ? (
          <>
            <div className="map-canvas">
              {/* Stylised map background — gridded roads, parks, labels */}
              <svg
                className="map-canvas-svg"
                viewBox="0 0 320 240"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
              >
                <rect width="320" height="240" fill="#E5F0FF" />
                <rect x="30" y="60" width="120" height="50" fill="#D4E8C7" rx="4" />
                <rect x="180" y="140" width="100" height="50" fill="#D4E8C7" rx="4" />
                {/* Road grid */}
                <g stroke="#ffffff" strokeWidth="8" strokeLinecap="round">
                  <line x1="0" y1="120" x2="320" y2="120" />
                  <line x1="0" y1="200" x2="320" y2="200" />
                  <line x1="160" y1="0" x2="160" y2="240" />
                  <line x1="60" y1="0" x2="60" y2="240" />
                  <line x1="260" y1="0" x2="260" y2="240" />
                </g>
                <g stroke="#FFE9A8" strokeWidth="3">
                  <line x1="0" y1="60" x2="320" y2="60" />
                  <line x1="220" y1="0" x2="220" y2="240" />
                </g>
                {/* Building blocks */}
                <g fill="#F5F5F7">
                  <rect x="68" y="128" width="20" height="20" />
                  <rect x="92" y="128" width="20" height="20" />
                  <rect x="116" y="128" width="20" height="20" />
                  <rect x="172" y="68" width="20" height="20" />
                  <rect x="196" y="68" width="20" height="20" />
                  <rect x="172" y="92" width="20" height="20" />
                </g>
                <text x="10" y="20" fill="#6B7280" fontSize="9" fontWeight="600">
                  HITECH CITY
                </text>
                <text x="220" y="220" fill="#6B7280" fontSize="9" fontWeight="600">
                  RAI DURG
                </text>
              </svg>

              {/* Pin pinned to centre */}
              <div className="map-pin" aria-hidden="true">
                <svg viewBox="0 0 24 32" width="32" height="40">
                  <path
                    d="M12 0C5.4 0 0 5.4 0 12c0 8 12 20 12 20s12-12 12-20C24 5.4 18.6 0 12 0z"
                    fill="#2563EB"
                  />
                  <circle cx="12" cy="12" r="5" fill="#ffffff" />
                </svg>
                <div className="map-pin-shadow" />
              </div>

              <button className="map-locate-btn" aria-label="Use my current location">
                <span className="map-locate-icon">⊙</span>
              </button>
            </div>

            <div className="map-current">
              <span className="map-current-icon">
                <Icon.MapPin />
              </span>
              <div>
                <div className="map-current-label">Selected location</div>
                <div className="map-current-value">
                  Hitech City Main Road, near Raheja Mindspace, Hyderabad
                </div>
              </div>
            </div>

            <div className="sheet-footer-static">
              <button className="dlg-btn ghost" onClick={onClose}>
                Cancel
              </button>
              <button
                className="dlg-btn primary"
                onClick={() => setStep('form')}
              >
                Confirm location
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="sheet-body" style={{ padding: '14px 16px 90px' }}>
              {/* Address-type tabs */}
              <div className="addr-type-row">
                {(['Shop', 'Home', 'Warehouse'] as AddressType[]).map((t) => (
                  <button
                    key={t}
                    className={`addr-type-chip ${type === t ? 'on' : ''}`}
                    onClick={() => setType(t)}
                  >
                    <span>{TYPE_ICONS[t]}</span>
                    {t}
                  </button>
                ))}
              </div>

              <FormField label="Name on this location">
                <input
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormField>

              <FormField label="House / Shop number" required>
                <input
                  className="form-input"
                  placeholder="e.g. Shop 14, Lit Box Complex"
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                />
              </FormField>

              <FormField label="Street / Area">
                <input
                  className="form-input"
                  placeholder="e.g. Rai Durg"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                />
              </FormField>

              <div className="form-row-2">
                <FormField label="City">
                  <input
                    className="form-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </FormField>
                <FormField label="Pincode" required>
                  <input
                    className="form-input"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="500032"
                    value={pincode}
                    onChange={(e) =>
                      setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                  />
                </FormField>
              </div>

              <FormField label="State">
                <input
                  className="form-input"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </FormField>

              <FormField label="Contact number">
                <input
                  className="form-input"
                  inputMode="tel"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </FormField>
            </div>

            <div className="sheet-footer-static">
              <button className="dlg-btn ghost" onClick={() => setStep('map')}>
                Back to map
              </button>
              <button
                className="dlg-btn primary"
                disabled={!canSave}
                onClick={() =>
                  onSave({
                    type,
                    name,
                    line1,
                    line2,
                    city,
                    state,
                    pincode,
                    contact,
                    icon: TYPE_ICONS[type],
                  })
                }
              >
                Save address
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: any;
}) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        {required && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
      {children}
    </div>
  );
}
