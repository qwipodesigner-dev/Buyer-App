import { useState } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import { movSuggestions } from '../data/mockData';

type DeliveryKind = 'tomorrow' | 'beat' | 'pickup';

const DELIVERY_OPTIONS: Record<DeliveryKind, { label: string; day: string; fee: number }> = {
  tomorrow: { label: 'Tomorrow', day: 'Tomorrow',          fee: 50 },
  beat:     { label: 'Friday',   day: 'Friday (Beat day)', fee: 0  },
  pickup:   { label: 'Self pickup', day: 'Self pickup',    fee: 0  },
};

export default function MultiSellerCart({ cart, deliveryBySeller, onUpdateDelivery, onBack, onUpdateItemQty, onAddSuggestion: _onAddSuggestion, onContinueShopping: _onContinueShopping, onCheckout, onAddItems }: any) {
  // Per-seller delivery selection lives on App so it stays in sync with the
  // product cards. Keyed by seller NAME; defaults to 'beat' (Friday) when
  // missing. Wholesalers ignore this — their delivery is locked to Tomorrow.
  const getDelivery = (name: string): DeliveryKind =>
    (deliveryBySeller && deliveryBySeller[name]) || 'beat';

  // Which seller cards have their "View items" list expanded.
  const [openItemsBySeller, setOpenItemsBySeller] = useState<Record<string, boolean>>({});
  const toggleItems = (id: string) =>
    setOpenItemsBySeller((prev) => ({ ...prev, [id]: !prev[id] }));

  // Compute subtotals per seller. MOV is driven by the chosen delivery
  // option (Beat = 500, Tomorrow = 2500) rather than the seller's static mov.
  const sellerData = cart.sellers.map((seller) => {
    let subtotal = 0;
    let mrpTotal = 0;
    let schemeSavings = 0;

    seller.items.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;
      mrpTotal += item.mrp * item.quantity;
      if (item.extraDiscount) {
        schemeSavings += itemSubtotal * item.extraDiscount;
      }
      if (item.flatOff) {
        schemeSavings += item.flatOff;
      }
    });

    // Wholesalers are always Tomorrow; distributors honour the shared
    // per-seller selection (keyed by seller name so product cards mirror).
    const deliveryKind: DeliveryKind =
      seller.type === 'wholesaler' ? 'tomorrow' : getDelivery(seller.name);
    const deliveryFee = DELIVERY_OPTIONS[deliveryKind].fee;
    const itemsSubtotal = subtotal - schemeSavings;
    const final = itemsSubtotal + deliveryFee;
    const effectiveMov = seller.mov;
    const movMet = itemsSubtotal >= effectiveMov;
    const movProgress = Math.min((itemsSubtotal / effectiveMov) * 100, 100);
    const movRemaining = Math.max(effectiveMov - itemsSubtotal, 0);

    return {
      ...seller,
      subtotal,
      mrpTotal,
      schemeSavings,
      itemsSubtotal,
      deliveryKind,
      deliveryFee,
      final,
      mov: effectiveMov,
      movMet,
      movProgress,
      movRemaining,
      itemSavings: mrpTotal - subtotal,
      totalSavings: mrpTotal - itemsSubtotal,
    };
  });

  const grandTotal = sellerData.reduce((sum, s) => sum + s.final, 0);
  const totalSavings = sellerData.reduce((sum, s) => sum + s.totalSavings, 0);
  const sellersMetMov = sellerData.filter((s) => s.movMet).length;
  const canCheckout = sellerData.every((s) => s.movMet);

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        {/* Top bar */}
        <div className="top-bar">
          <button className="icon-btn" onClick={onBack}>
            <Icon.Back />
          </button>
          <div className="top-title">
            <h1>Your Cart</h1>
            <p>
              {cart.sellers.length} sellers · {cart.sellers.reduce((n, s) => n + s.items.length, 0)} items
            </p>
          </div>
        </div>

        <div className="cart-screen">
          {/* Savings banner */}
          {totalSavings > 0 && (
            <div className="savings-banner">
              <div className="savings-icon">
                <Icon.Tag />
              </div>
              <div className="savings-text">
                <strong>You're saving ₹{Math.round(totalSavings).toLocaleString('en-IN')}</strong>
                <p>Discounts and schemes applied across this order</p>
              </div>
            </div>
          )}

          {/* Sellers grouped by type. Distributors render per seller;
              wholesalers are pooled into a single "Qwipo Wholesalers" block
              with delivery locked to Tomorrow. */}
          {(['distributor', 'wholesaler'] as const).map((groupType) => {
            const raw = sellerData.filter((s: any) => (s.type || 'distributor') === groupType);
            if (raw.length === 0) return null;
            const label = groupType === 'distributor' ? 'Distributors' : 'Wholesalers';

            // For wholesalers, fold every seller into one virtual block so
            // the buyer sees a single Qwipo Wholesalers card.
            let group: any[];
            if (groupType === 'wholesaler') {
              const itemsSubtotal = raw.reduce((n: number, s: any) => n + s.itemsSubtotal, 0);
              const deliveryFee = DELIVERY_OPTIONS.tomorrow.fee;
              const combined: any = {
                id: 'qwipo-wholesalers',
                name: 'Qwipo Wholesalers',
                logo: 'QW',
                logoColor: '#7C3AED',
                deliveryTime: 'Tomorrow',
                type: 'wholesaler',
                deliveryKind: 'tomorrow' as DeliveryKind,
                deliveryFee,
                items: raw.flatMap((s: any) => s.items),
                subtotal: raw.reduce((n: number, s: any) => n + s.subtotal, 0),
                mrpTotal: raw.reduce((n: number, s: any) => n + s.mrpTotal, 0),
                schemeSavings: raw.reduce((n: number, s: any) => n + s.schemeSavings, 0),
                itemsSubtotal,
                final: itemsSubtotal + deliveryFee,
                itemSavings: raw.reduce((n: number, s: any) => n + s.itemSavings, 0),
                totalSavings: raw.reduce((n: number, s: any) => n + s.totalSavings, 0),
                mov: Math.max(...raw.map((s: any) => s.mov)),
              };
              combined.movMet = itemsSubtotal >= combined.mov;
              combined.movProgress = Math.min((itemsSubtotal / combined.mov) * 100, 100);
              combined.movRemaining = Math.max(combined.mov - itemsSubtotal, 0);
              group = [combined];
            } else {
              group = raw;
            }

            return (
              <div key={groupType} className="cart-group">
                <div className="cart-group-head">
                  <div className="cart-group-title">{label}</div>
                  <div className="cart-group-count">
                    {groupType === 'wholesaler' ? '1 seller' : `${group.length} sellers`}
                  </div>
                </div>
                {group.map((s: any) => (
                  <div key={s.id} className="seller-block">
              {/* Head — for wholesaler the delivery is fixed to Tomorrow
                  and no toggle is shown. */}
              <div className="seller-block-head">
                <div
                  className="seller-block-logo"
                  style={{ background: s.logoColor }}
                >
                  {s.logo}
                </div>
                <div className="seller-block-info">
                  <div className="seller-block-name">{s.name}</div>
                  <div className="seller-block-delivery">
                    <Icon.Truck /> Delivery: {DELIVERY_OPTIONS[s.deliveryKind].day}
                  </div>
                </div>
                <div className="seller-block-chevron">
                  <Icon.ChevronRight />
                </div>
              </div>

              {s.type !== 'wholesaler' && (
                <div className="cart-delivery-chips" role="radiogroup" aria-label="Delivery option">
                  {(['beat', 'tomorrow', 'pickup'] as DeliveryKind[]).map((kind) => {
                    const active = s.deliveryKind === kind;
                    return (
                      <button
                        key={kind}
                        role="radio"
                        aria-checked={active}
                        className={`cart-delivery-chip ${active ? 'active' : ''}`}
                        onClick={() => onUpdateDelivery?.(s.name, kind)}
                      >
                        {DELIVERY_OPTIONS[kind].label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* MOV bar */}
              <div className="mov-block">
                <div className="mov-row">
                  <span className="mov-label">Minimum Order Value</span>
                  <span className={`mov-status ${s.movMet ? 'met' : 'pending'}`}>
                    {s.movMet ? '✓ MOV Met' : `₹${Math.round(s.movRemaining).toLocaleString('en-IN')} to go`}
                  </span>
                </div>
                <div className="mov-bar">
                  <div
                    className={`mov-fill ${s.movMet ? 'met' : 'pending'}`}
                    style={{ width: `${s.movProgress}%` }}
                  ></div>
                </div>
                <div className="mov-detail">
                  <span>
                    Current: <strong>₹{Math.round(s.final).toLocaleString('en-IN')}</strong>
                  </span>
                  <span>
                    MOV: <strong>₹{s.mov.toLocaleString('en-IN')}</strong>
                  </span>
                </div>
              </div>

              {/* Action row — Add items + View items. Items list collapses
                  by default; the toggle expands it inline. */}
              <div className="cart-seller-actions">
                <button
                  className="cart-action-btn cart-action-add"
                  onClick={() => onAddItems?.(s)}
                >
                  <Icon.Plus /> Add items
                </button>
                <button
                  className="cart-action-btn cart-action-view"
                  onClick={() => toggleItems(s.id)}
                  aria-expanded={!!openItemsBySeller[s.id]}
                >
                  {openItemsBySeller[s.id] ? 'Hide items' : `View items (${s.items.length})`}
                </button>
              </div>

              {openItemsBySeller[s.id] && (
                <div className="cart-items">
                  {s.items.map((item, idx) => (
                    <div key={idx} className="cart-item">
                      <div className="cart-item-img" style={{ background: item.bgColor }}>
                        {item.image}
                      </div>
                      <div className="cart-item-info">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-variant">{item.variant} · {item.brand}</div>
                        <div className="cart-item-pricing">
                          <span className="cart-item-price">₹{item.price}</span>
                          <span className="cart-item-mrp">₹{item.mrp}</span>
                          <span style={{ fontSize: 11, color: '#6b7280' }}>per pc</span>
                        </div>
                        {item.scheme && (
                          <div className="cart-item-scheme">
                            <Icon.Gift /> {item.scheme}
                          </div>
                        )}
                        {item.freeQty > 0 && (
                          <div className="free-tag">+ {item.freeQty} Free Pc applied</div>
                        )}
                      </div>
                      <div className="cart-item-qty">
                        <button onClick={() => onUpdateItemQty(s.id, idx, item.quantity - 1)}>
                          <Icon.Minus />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdateItemQty(s.id, idx, item.quantity + 1)}>
                          <Icon.Plus />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* MOV suggestions when MOV is not met */}
              {!s.movMet && (
                <div className="mov-suggest">
                  <div className="mov-suggest-head">
                    <Icon.Lightning />
                    <div className="mov-suggest-title">
                      Add these to reach MOV
                    </div>
                  </div>
                  <div className="suggest-rail">
                    {movSuggestions.map((sug) => (
                      <div key={sug.id} className="suggest-card">
                        <div className="suggest-img" style={{ background: sug.bgColor }}>
                          {sug.image}
                        </div>
                        <div className="suggest-name">{sug.name}</div>
                        <div className="suggest-price">₹{sug.price}/pc</div>
                        <button className="suggest-add" onClick={() => _onAddSuggestion?.(s.id, sug)}>
                          + Add Case
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtotal */}
              <div className="seller-subtotal">
                <div className="subtotal-row">
                  <span>Item total ({s.items.reduce((n, i) => n + i.quantity, 0)} pcs)</span>
                  <span>₹{s.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {s.itemSavings > 0 && (
                  <div className="subtotal-row">
                    <span>Bulk discount</span>
                    <span className="saving">- ₹{s.itemSavings.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {s.schemeSavings > 0 && (
                  <div className="subtotal-row">
                    <span>Scheme savings</span>
                    <span className="saving">- ₹{Math.round(s.schemeSavings).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="subtotal-row">
                  <span>Delivery fee</span>
                  <span className={s.deliveryFee > 0 ? '' : 'saving'}>
                    {s.deliveryFee > 0 ? `+ ₹${s.deliveryFee}` : 'Free'}
                  </span>
                </div>
                <div className="subtotal-row bold">
                  <span>Seller subtotal</span>
                  <span>₹{Math.round(s.final).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="cart-footer">
        <div className="cart-footer-row">
          <div>
            <div className="cart-footer-total-label">Grand Total</div>
            <div className="cart-footer-total">₹{Math.round(grandTotal).toLocaleString('en-IN')}</div>
          </div>
          <div className="cart-footer-savings">
            <div style={{ marginBottom: '2px' }}>You saved ₹{Math.round(totalSavings).toLocaleString('en-IN')}</div>
            <div style={{ color: '#6b7280', fontWeight: 500 }}>
              {sellersMetMov}/{cart.sellers.length} sellers ready
            </div>
          </div>
        </div>
        <button className="checkout-btn" disabled={!canCheckout} onClick={onCheckout}>
          {canCheckout ? (
            <>
              Proceed to checkout <Icon.ChevronRight />
            </>
          ) : (
            <>Add more items to checkout</>
          )}
        </button>
      </div>
    </>
  );
}
