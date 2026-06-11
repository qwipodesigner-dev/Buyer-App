import { Icon, StatusBar } from '../components/Icons';
import { movSuggestions } from '../data/mockData';

export default function MultiSellerCart({ cart, onBack, onUpdateItemQty, onAddSuggestion, onContinueShopping }: any) {
  // Compute subtotals per seller
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
    const movMet = final >= seller.mov;
    const movProgress = Math.min((final / seller.mov) * 100, 100);
    const movRemaining = Math.max(seller.mov - final, 0);

    return {
      ...seller,
      subtotal,
      mrpTotal,
      schemeSavings,
      final,
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

          {/* Seller blocks */}
          {sellerData.map((s) => (
            <div key={s.id} className="seller-block">
              {/* Head */}
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
                    <Icon.Truck /> Delivery: {s.deliveryTime}
                  </div>
                </div>
                <div className="seller-block-chevron">
                  <Icon.ChevronRight />
                </div>
              </div>

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

              {/* Items */}
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
                        <button className="suggest-add" onClick={() => onAddSuggestion(s.id, sug)}>
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

          {/* Continue shopping */}
          <button
            onClick={onContinueShopping}
            style={{
              padding: '14px',
              background: '#ffffff',
              border: '1px dashed #d1d5db',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#4b5563',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Icon.Plus /> Continue shopping
          </button>
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
        <button className="checkout-btn" disabled={!canCheckout}>
          {canCheckout ? (
            <>
              Proceed to Checkout <Icon.ChevronRight />
            </>
          ) : (
            <>Add more items to checkout</>
          )}
        </button>
      </div>
    </>
  );
}
