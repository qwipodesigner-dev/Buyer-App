import { useState } from 'react';
import { Icon, StatusBar } from '../components/Icons';

// PDF page 17 — Apply Offers / Coupons.
// User enters a code or picks one from the list. Selected coupon is highlighted; Apply CTA at the bottom.

type Coupon = {
  id: string;
  code: string;
  title: string;
  sub: string;
  type: 'flat' | 'percent' | 'free' | 'cashback';
  value: number;
  minOrder: number;
  expires: string;
  tag?: string;
};

const COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'QWIPO500',
    title: 'Flat ₹500 OFF',
    sub: 'On orders above ₹6,000',
    type: 'flat',
    value: 500,
    minOrder: 6000,
    expires: '30 Jun',
    tag: 'BEST OFFER',
  },
  {
    id: 'c2',
    code: 'WELCOME10',
    title: '10% OFF up to ₹400',
    sub: 'For new business — first 3 orders',
    type: 'percent',
    value: 10,
    minOrder: 2500,
    expires: '15 Jul',
  },
  {
    id: 'c3',
    code: 'FREESHIP',
    title: 'Free delivery',
    sub: 'On all orders above ₹3,500',
    type: 'free',
    value: 0,
    minOrder: 3500,
    expires: '20 Jun',
  },
  {
    id: 'c4',
    code: 'GROC200',
    title: '₹200 OFF on Groceries',
    sub: 'Min order ₹4,000 from Sri Sai Krishna',
    type: 'flat',
    value: 200,
    minOrder: 4000,
    expires: '28 Jun',
  },
  {
    id: 'c5',
    code: 'CASHBACK5',
    title: '5% Cashback to wallet',
    sub: 'Credited within 24 hours',
    type: 'cashback',
    value: 5,
    minOrder: 5000,
    expires: '31 Jul',
    tag: 'WALLET',
  },
];

function CouponIcon({ type }: { type: Coupon['type'] }) {
  const stroke = '#2563eb';
  if (type === 'flat')
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
        <path d="M20 12v4H6a2 2 0 0 0-2 2c0 1.1.9 2 2 2h12v-4" />
      </svg>
    );
  if (type === 'percent')
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="5" x2="5" y2="19" />
        <circle cx="6.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    );
  if (type === 'free')
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

export default function CouponsScreen({ onBack, onApply, cartTotal = 4250 }: any) {
  const [code, setCode] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = code.trim()
    ? COUPONS.filter((c) => c.code.toLowerCase().includes(code.trim().toLowerCase()))
    : COUPONS;

  const selected = COUPONS.find((c) => c.id === selectedId);
  const canApply = !!selected && cartTotal >= selected.minOrder;

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        {/* Top app bar */}
        <div className="cp-top-bar">
          <button className="icon-btn" onClick={onBack} aria-label="Back">
            <Icon.Back />
          </button>
          <div className="cp-top-title">Apply Coupon</div>
        </div>

        {/* Manual code entry */}
        <div className="cp-code-wrap">
          <div className="cp-code-label">Have a coupon code?</div>
          <div className="cp-code-row">
            <input
              className="cp-code-input"
              placeholder="Enter coupon code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
            <button
              className="cp-code-check"
              onClick={() => {
                const match = COUPONS.find(
                  (c) => c.code.toUpperCase() === code.trim().toUpperCase()
                );
                if (match) setSelectedId(match.id);
              }}
            >
              Check
            </button>
          </div>
        </div>

        {/* Coupons list */}
        <div className="cp-section-title">Available offers</div>
        <div className="cp-list">
          {filtered.map((c) => {
            const eligible = cartTotal >= c.minOrder;
            const isSelected = selectedId === c.id;
            return (
              <button
                key={c.id}
                className={`cp-card ${isSelected ? 'on' : ''} ${
                  eligible ? '' : 'disabled'
                }`}
                onClick={() => eligible && setSelectedId(c.id)}
              >
                <div className="cp-card-left">
                  <div className="cp-card-icon">
                    <CouponIcon type={c.type} />
                  </div>
                  {c.tag && <div className="cp-card-tag">{c.tag}</div>}
                </div>

                <div className="cp-card-mid">
                  <div className="cp-card-title">{c.title}</div>
                  <div className="cp-card-sub">{c.sub}</div>
                  <div className="cp-card-code-row">
                    <span className="cp-card-code">{c.code}</span>
                    <span className="cp-card-expires">Expires {c.expires}</span>
                  </div>
                  {!eligible && (
                    <div className="cp-card-warn">
                      Add ₹
                      {(c.minOrder - cartTotal).toLocaleString('en-IN')} more to use
                    </div>
                  )}
                </div>

                <div className={`cp-radio ${isSelected ? 'on' : ''}`}>
                  {isSelected && <span className="cp-radio-dot" />}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ paddingBottom: 110 }} />
      </div>

      {/* Sticky apply footer */}
      <div className="cp-footer">
        {selected ? (
          <div className="cp-footer-summary">
            <div className="cp-footer-code">{selected.code}</div>
            <div className="cp-footer-savings">
              You save{' '}
              <strong>
                {selected.type === 'percent'
                  ? `${selected.value}%`
                  : selected.type === 'free'
                  ? 'Free delivery'
                  : selected.type === 'cashback'
                  ? `${selected.value}% cashback`
                  : `₹${selected.value}`}
              </strong>
            </div>
          </div>
        ) : (
          <div className="cp-footer-empty">Select a coupon to apply</div>
        )}
        <button
          className="cp-apply"
          disabled={!canApply}
          onClick={() => canApply && onApply?.(selected)}
        >
          Apply
        </button>
      </div>
    </>
  );
}
