import { useState } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import { movSuggestions } from '../data/mockData';

type DeliveryKind = 'beat' | 'tomorrow';

const DELIVERY_OPTIONS: Record<DeliveryKind, { day: string; mov: number; fee: string }> = {
  beat: { day: 'Friday (Beat day)', mov: 500, fee: 'Free Delivery' },
  tomorrow: { day: 'Tomorrow', mov: 2500, fee: 'Free Delivery' },
};

export default function MultiSellerCart({ cart, onBack, onUpdateItemQty, onAddSuggestion: _onAddSuggestion, onContinueShopping: _onContinueShopping, onCheckout, onAddItems }: any) {
  // Per-seller delivery selection — defaults to the seller's beat day.
  const [deliveryBySeller, setDeliveryBySeller] = useState<Record<string, DeliveryKind>>({});
  const getDelivery = (id: string): DeliveryKind => deliveryBySeller[id] || 'beat';

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

    const final = subtotal - schemeSavings;
    const delivery = DELIVERY_OPTIONS[getDelivery(seller.id)];
    const effectiveMov = delivery.mov;
    const movMet = final >= effectiveMov;
    const movProgress = Math.min((final / effectiveMov) * 100, 100);
    const movRemaining = Math.max(effectiveMov - final, 0);

    return {
      ...seller,
      subtotal,
      mrpTotal,
      schemeSavings,
      final,
      mov: effectiveMov,
      movMet,
      movProgress,
      movRemaining,
      itemSavings: mrpTotal - subtotal,
      totalSavings: mrpTotal - final,
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
              const combined: any = {
                id: 'qwipo-wholesalers',
                name: 'Qwipo Wholesalers',
                logo: 'QW',
                logoColor: '#7C3AED',
                deliveryTime: 'Tomorrow',
                type: 'wholesaler',
                items: raw.flatMap((s: any) => s.items),
                subtotal: raw.reduce((n: number, s: any) => n + s.subtotal, 0),
                mrpTotal: raw.reduce((n: number, s: any) => n + s.mrpTotal, 0),
                schemeSavings: raw.reduce((n: number, s: any) => n + s.schemeSavings, 0),
                final: raw.reduce((n: number, s: any) => n + s.final, 0),
                itemSavings: raw.reduce((n: number, s: any) => n + s.itemSavings, 0),
                totalSavings: raw.reduce((n: number, s: any) => n + s.totalSavings, 0),
                mov: DELIVERY_OPTIONS.tomorrow.mov,
              };
              combined.movMet = combined.final >= combined.mov;
              combined.movProgress = Math.min((combined.final / combined.mov) * 100, 100);
              combined.movRemaining = Math.max(combined.mov - combined.final, 0);
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
                    <Icon.Truck /> Delivery:{' '}
                    {s.type === 'wholesaler'
                      ? 'Tomorrow'
                      : DELIVERY_OPTIONS[getDelivery(s.id)].day}
                  </div>
                </div>
                <div className="seller-block-chevron">
                  <Icon.ChevronRight />
                </div>
              </div>

              {s.type !== 'wholesaler' && (
                <div className="cart-delivery-toggle" role="radiogroup" aria-label="Delivery option">
                  {(['beat', 'tomorrow'] as DeliveryKind[]).map((kind) => {
                    const opt = DELIVERY_OPTIONS[kind];
                    const active = getDelivery(s.id) === kind;
                    return (
                      <button
                        key={kind}
                        role="radio"
                        aria-checked={active}
                        className={`cart-delivery-option ${active ? 'active' : ''}`}
                        onClick={() =>
                          setDeliveryBySeller((prev) => ({ ...prev, [s.id]: kind }))
                        }
                      >
                        <div className="cart-delivery-line">
                          Delivery by <span className="cart-delivery-day">{opt.day}</span>
                        </div>
                        <div className="cart-delivery-meta">
                          <span>MOV: <strong>{opt.mov}</strong></span>
                          <span className="cart-delivery-fee">{opt.fee}</span>
                        </div>
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
