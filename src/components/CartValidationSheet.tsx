import { useState } from 'react';
import { Icon } from './Icons';
import { SheetHeader, useSheetSwipe } from './SheetBase';

// Bottom sheet shown before checkout — surfaces MOV, stock, and serviceability issues.
// Matches PDF page 16 "Cart validation".

const AlertsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
  </svg>
);

const BoxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const StoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M3 9l1.5-6h15L21 9" />
    <path d="M3 9v12h18V9" />
  </svg>
);

export default function CartValidationSheet({ cart, onClose, onProceed }: any) {
  const { dragHandlers, sheetStyle } = useSheetSwipe(onClose);
  const [open, setOpen] = useState<Record<string, boolean>>({ mov: true });

  // Identify sellers below MOV
  const movSellers = cart.sellers
    .map((s: any) => {
      const subtotal = s.items.reduce((a: number, i: any) => a + i.price * i.quantity, 0);
      const balance = s.mov - subtotal;
      return { ...s, subtotal, balance, meets: balance <= 0 };
    })
    .filter((s: any) => !s.meets);

  const toggle = (key: string) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  // Static demo counts for the other sections
  const sections: { key: string; icon: any; title: string; count: number }[] = [
    { key: 'stock', icon: BoxIcon, title: 'Stock Adjustments', count: 2 },
    { key: 'unavailable', icon: PinIcon, title: 'Unavailable Items', count: 1 },
    { key: 'seller', icon: StoreIcon, title: 'Seller unavailable', count: 2 },
    { key: 'location', icon: PinIcon, title: 'Location not serviceable', count: 2 },
  ];

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" style={sheetStyle} onClick={(e) => e.stopPropagation()}>
        <SheetHeader
          icon={<AlertsIcon />}
          title="Alerts"
          subtitle="Please review the following Alerts before proceeding"
          onClose={onClose}
          dragHandlers={dragHandlers}
        />

        <div className="sheet-body" style={{ padding: '14px 16px 90px' }}>
          {/* MOV section — expanded by default */}
          <div className={`cv-section ${open.mov ? 'open' : ''}`}>
            <button className="cv-section-head" onClick={() => toggle('mov')}>
              <span className="cv-section-icon"><CartIcon /></span>
              <span className="cv-section-title">
                Minimum Order Value({movSellers.length} Sellers)
              </span>
              <span className={`cv-section-chev ${open.mov ? 'open' : ''}`}>
                <Icon.ChevronDown />
              </span>
            </button>
            {open.mov && movSellers.length > 0 && (
              <div className="cv-section-body">
                {movSellers.map((s: any) => (
                  <div key={s.id} className="cv-seller">
                    <div className="cv-seller-left">
                      <div className="cv-seller-name">{s.name}</div>
                      <div className="cv-seller-balance">
                        Balance to Order: <span>₹{Math.round(s.balance).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="cv-seller-delivery">Delivery By: Sunday</div>
                    </div>
                    <div className="cv-seller-right">
                      <div className="cv-seller-mov">
                        MOV: <strong>₹{s.mov.toLocaleString('en-IN')}</strong>
                      </div>
                      <button className="cv-add-items">
                        <Icon.Plus /> Add items
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {sections.map((sec) => {
            const Ic = sec.icon;
            return (
              <div key={sec.key} className={`cv-section ${open[sec.key] ? 'open' : ''}`}>
                <button className="cv-section-head" onClick={() => toggle(sec.key)}>
                  <span className="cv-section-icon"><Ic /></span>
                  <span className="cv-section-title">
                    {sec.title}({sec.count})
                  </span>
                  <span className={`cv-section-chev ${open[sec.key] ? 'open' : ''}`}>
                    <Icon.ChevronDown />
                  </span>
                </button>
                {open[sec.key] && (
                  <div className="cv-section-body">
                    <div className="cv-empty">
                      Demo data — {sec.count} {sec.title.toLowerCase()} issue
                      {sec.count > 1 ? 's' : ''}.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="cv-footer">
          <button className="cv-proceed" onClick={onProceed}>
            Proceed Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
