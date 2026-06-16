import { Icon, StatusBar } from '../components/Icons';
import { products } from '../data/mockData';

// Lookup an actual product record by fuzzy name so the line item shows the
// real image, brand chip, and price layout — keeps card style consistent
// with ProductListing / WholesalerProductListScreen.
function findProduct(itemName: string) {
  const key = itemName.toLowerCase();
  return products.find(
    (p) =>
      key.includes(p.name.toLowerCase().split(' ')[0]) ||
      key.includes(p.brand.toLowerCase())
  );
}

export default function OrderDetailsScreen({ order, onBack, onTrack, onCancel }: any) {
  if (!order) return null;

  const itemsTotal = order.total - 200; // ₹200 delivery
  const niceOrderId = `QWIP${order.id.replace(/[^0-9]/g, '')}204`;

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        <div className="top-bar">
          <button className="icon-btn" onClick={onBack} aria-label="Back">
            <Icon.Back />
          </button>
          <div className="top-title">
            <h1>Order Details</h1>
            <p>{niceOrderId}</p>
          </div>
        </div>

        {/* Seller header */}
        <div className="od-seller">
          <div
            className="od-seller-avatar"
            style={{ background: order.sellerColor }}
          >
            {order.sellerLogo}
          </div>
          <div className="od-seller-info">
            <div className="od-seller-name">{order.seller}</div>
            <div className={`od-status status-${order.status}`}>
              {order.statusLabel}
            </div>
          </div>
        </div>

        {/* Summary card */}
        <div className="od-section">
          <div className="od-section-title">Order Summary</div>
          <div className="od-card">
            <div className="orders-row">
              <span className="orders-label">Order ID</span>
              <span className="orders-value mono">{niceOrderId}</span>
            </div>
            <div className="orders-row">
              <span className="orders-label">Order Date</span>
              <span className="orders-value">{order.placedAt}</span>
            </div>
            <div className="orders-row">
              <span className="orders-label">Expected Delivery Date</span>
              <span className="orders-value">{order.eta}</span>
            </div>
            <div className="orders-row">
              <span className="orders-label">Order Status</span>
              <span className="orders-value">{order.statusLabel}</span>
            </div>
            <div className="orders-row">
              <span className="orders-label">Items Total</span>
              <span className="orders-value">
                ₹{itemsTotal.toLocaleString('en-IN')}.00
              </span>
            </div>
            <div className="orders-row">
              <span className="orders-label">Delivery Fee</span>
              <span className="orders-value">₹200.00</span>
            </div>
            <div className="orders-row total">
              <span className="orders-label">Total Amount</span>
              <span className="orders-value">
                ₹{order.total.toLocaleString('en-IN')}.00
              </span>
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="od-section">
          <div className="od-section-title">
            Items ({order.items.length})
          </div>
          <div className="od-items">
            {order.items.map((itemName: string, i: number) => {
              const prod = findProduct(itemName);
              const variant = prod?.variants[0];
              return (
                <div key={i} className="od-item">
                  <div
                    className="od-item-img"
                    style={{ background: prod?.bgColor || '#f3f4f6' }}
                  >
                    {prod?.images?.[0] ? (
                      <img src={prod.images[0]} alt={itemName} />
                    ) : (
                      <span>{prod?.image || '📦'}</span>
                    )}
                  </div>
                  <div className="od-item-info">
                    <div className="od-item-brand">
                      {prod?.brand || 'BRAND'}
                    </div>
                    <div className="od-item-name">{itemName}</div>
                    {variant && (
                      <div className="od-item-meta">
                        {variant.size} · {variant.casePack}
                      </div>
                    )}
                  </div>
                  <div className="od-item-price">
                    <div className="od-item-current">
                      ₹{variant?.sellingPrice || '—'}
                    </div>
                    {variant && (
                      <div className="od-item-mrp">₹{variant.mrp}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery address */}
        <div className="od-section" style={{ paddingBottom: 110 }}>
          <div className="od-section-title">Delivery Address</div>
          <div className="od-address">
            <div className="od-address-icon">
              <Icon.MapPin />
            </div>
            <div className="od-address-text">
              <div className="od-address-name">Sri Venkateswara Kirana Store</div>
              <div className="od-address-line">
                Shop 14, Lit Box Complex, Rai Durg, Hitech City,
                <br />
                Hyderabad, Telangana – 500032
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky footer with action CTAs */}
      <div className="od-footer">
        {order.status === 'placed' ? (
          <button className="od-btn danger" onClick={() => onCancel?.(order)}>
            Cancel Order
          </button>
        ) : (
          <button className="od-btn ghost">
            <Icon.Image /> Invoice
          </button>
        )}
        {order.status !== 'cancelled' && (
          <button className="od-btn primary" onClick={() => onTrack?.(order)}>
            Track Order
          </button>
        )}
      </div>
    </>
  );
}
