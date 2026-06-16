import { Icon, StatusBar } from '../components/Icons';
import { initialCart, userProfile } from '../data/mockData';

export default function OrderSummaryScreen({ onBack, onPlaceOrder, onOpenCoupons, appliedCoupon }: any) {
  const sellerData = initialCart.sellers.map((s) => {
    let subtotal = 0;
    let savings = 0;
    s.items.forEach((i) => {
      const it = i.price * i.quantity;
      subtotal += it;
      if (i.extraDiscount) savings += it * i.extraDiscount;
      if (i.flatOff) savings += i.flatOff;
    });
    return { ...s, subtotal, savings, final: subtotal - savings };
  });

  const totalItems = sellerData.reduce(
    (n, s) => n + s.items.reduce((a, i) => a + i.quantity, 0),
    0
  );
  const grandTotal = sellerData.reduce((a, s) => a + s.final, 0);
  const deliveryFee = 30;
  const toPay = grandTotal + deliveryFee;

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        <div className="top-bar">
          <button className="icon-btn" onClick={onBack}>
            <Icon.Back />
          </button>
          <div className="top-title">
            <h1>Orders Summary</h1>
          </div>
        </div>

        <div className="order-summary">
          {sellerData.map((s) => {
            const brandCounts: Record<string, number> = {};
            s.items.forEach((i) => {
              brandCounts[i.brand] = (brandCounts[i.brand] || 0) + 1;
            });

            return (
              <div key={s.id} className="os-card">
                <div className="os-card-head">
                  <div className="os-seller">{s.name}</div>
                  <div className="os-total">
                    Total: <strong>₹{Math.round(s.final).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
                <div className="os-brands">
                  {Object.entries(brandCounts).map(([brand, n]) => (
                    <span key={brand} className="os-brand-row">
                      <span className="os-brand-name">{brand}</span>
                      <span className="os-brand-count">({n} items)</span>
                    </span>
                  ))}
                  <button className="os-view-items">View items</button>
                </div>
                <div className="os-delivery">
                  <span className="os-delivery-label">Delivery by</span>
                  <span className="os-delivery-value">Tomorrow</span>
                </div>
              </div>
            );
          })}

          {/* Apply coupon row */}
          <button className="os-coupon-row" onClick={onOpenCoupons}>
            <span className="os-coupon-icon">🎟️</span>
            <span className="os-coupon-text">
              {appliedCoupon ? (
                <>
                  <strong style={{ color: '#16a34a' }}>{appliedCoupon.code}</strong> applied
                </>
              ) : (
                <>Apply offers & coupons</>
              )}
            </span>
            <Icon.ChevronRight />
          </button>

          {/* Bill details */}
          <div className="os-bill">
            <div className="os-bill-head">Bill details</div>
            <div className="os-bill-row">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="os-bill-row">
              <span>Grand Total</span>
              <span>₹{Math.round(grandTotal).toLocaleString('en-IN')}</span>
            </div>
            <div className="os-bill-row">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="os-bill-row bold">
              <span>To pay:</span>
              <span>₹{Math.round(toPay).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Delivery address */}
          <div className="os-address">
            <div className="os-address-head">Delivery address</div>
            <div className="os-address-row">
              <div className="os-address-icon">
                <Icon.MapPin />
              </div>
              <div className="os-address-text">
                <div className="os-address-name">{userProfile.businessName}</div>
                <div className="os-address-line">
                  Shop 14, Lit Box Complex, Rai Durg, Hitech City, Hyderabad, Telangana – 500032
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="os-footer">
          <button className="os-place-btn" onClick={onPlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
    </>
  );
}
