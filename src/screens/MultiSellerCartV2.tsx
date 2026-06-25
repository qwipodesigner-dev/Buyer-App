import { useState } from 'react';
import { Icon, StatusBar } from '../components/Icons';

// Preview-only V2 of the cart. Sits behind a sidebar entry (item #15) but is
// not part of the main shopping flow yet — kept here so design can iterate
// against the mock without touching the live MultiSellerCart screen.
//
// Two delivery options per distributor: Beat day (Friday) and Tomorrow.
// Switching changes the delivery fee, which rolls up into the footer total.
// Wholesalers are pooled into a single "Qwipo Sellers" block and locked to
// Tomorrow with no toggle.
type DeliveryKind = 'beat' | 'tomorrow';

const DELIVERY_OPTIONS: Record<DeliveryKind, { label: string; day: string; fee: number }> = {
  beat:     { label: 'Fri (Beat day)', day: 'Fri (Beat day)', fee: 0  },
  tomorrow: { label: 'Tomorrow',       day: 'Tomorrow',       fee: 12 },
};

export default function MultiSellerCartV2({ cart, onBack, onCheckout }: any) {
  const [deliveryBySeller, setDeliveryBySeller] = useState<Record<string, DeliveryKind>>({});
  const getDelivery = (id: string): DeliveryKind => deliveryBySeller[id] || 'tomorrow';

  // Split sellers into distributor + wholesaler groups. Wholesalers collapse
  // into one virtual "Qwipo Sellers" block (mirrors the production cart's
  // wholesaler pooling rule).
  const distributors = cart.sellers.filter((s: any) => (s.type || 'distributor') === 'distributor');
  const wholesalers = cart.sellers.filter((s: any) => s.type === 'wholesaler');

  const computeSeller = (seller: any, isWholesaler: boolean) => {
    let subtotal = 0;
    let mrpTotal = 0;
    seller.items.forEach((item: any) => {
      subtotal += item.price * item.quantity;
      mrpTotal += item.mrp * item.quantity;
    });
    const deliveryKind: DeliveryKind = isWholesaler ? 'tomorrow' : getDelivery(seller.id);
    const deliveryFee = DELIVERY_OPTIONS[deliveryKind].fee;
    return {
      ...seller,
      subtotal,
      mrpTotal,
      savings: Math.max(mrpTotal - subtotal, 0),
      deliveryKind,
      deliveryFee,
      movMet: subtotal >= seller.mov,
      movRemaining: Math.max(seller.mov - subtotal, 0),
    };
  };

  const distributorRows = distributors.map((s: any) => computeSeller(s, false));

  // Pool wholesalers into one virtual block.
  let wholesalerRow: any = null;
  if (wholesalers.length) {
    const allItems = wholesalers.flatMap((w: any) => w.items);
    const subtotal = allItems.reduce((n: number, i: any) => n + i.price * i.quantity, 0);
    const mrpTotal = allItems.reduce((n: number, i: any) => n + i.mrp * i.quantity, 0);
    const mov = Math.max(...wholesalers.map((w: any) => w.mov));
    const deliveryFee = DELIVERY_OPTIONS.tomorrow.fee;
    wholesalerRow = {
      id: 'qwipo-sellers',
      name: 'Qwipo Sellers',
      type: 'wholesaler',
      items: allItems,
      subtotal,
      mrpTotal,
      savings: Math.max(mrpTotal - subtotal, 0),
      deliveryKind: 'tomorrow' as DeliveryKind,
      deliveryFee,
      mov,
      movMet: subtotal >= mov,
      movRemaining: Math.max(mov - subtotal, 0),
    };
  }

  const allRows = [...distributorRows, ...(wholesalerRow ? [wholesalerRow] : [])];
  const itemsTotal = allRows.reduce((n, r) => n + r.subtotal, 0);
  const feesTotal = allRows.reduce((n, r) => n + r.deliveryFee, 0);
  const grandTotal = itemsTotal + feesTotal;

  return (
    <>
      <StatusBar />
      <div className="screen-body cart-v2">
        <div className="cart-v2-topbar">
          <button className="icon-btn" onClick={onBack} aria-label="Back">
            <Icon.Back />
          </button>
          <h1>Cart Summary</h1>
        </div>

        <div className="cart-v2-screen">
          {distributorRows.length > 0 && (
            <div className="cart-v2-divider">
              <span>From Distributors</span>
            </div>
          )}
          {distributorRows.map((s: any) => (
            <SellerCardV2
              key={s.id}
              seller={s}
              onPickDelivery={(kind) =>
                setDeliveryBySeller((prev) => ({ ...prev, [s.id]: kind }))
              }
            />
          ))}

          {wholesalerRow && (
            <div className="cart-v2-divider">
              <span>From Wholesalers</span>
            </div>
          )}
          {wholesalerRow && <SellerCardV2 seller={wholesalerRow} />}
        </div>
      </div>

      <div className="cart-v2-footer">
        <div className="cart-v2-footer-left">
          <div className="cart-v2-footer-label">Total Cart Value:</div>
          <div className="cart-v2-footer-row">
            <div className="cart-v2-footer-total">
              ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {feesTotal > 0 && (
              <div className="cart-v2-footer-fees">
                <Icon.Truck /> + ₹{feesTotal} Fees
              </div>
            )}
          </div>
        </div>
        <button className="cart-v2-checkout" onClick={onCheckout}>Checkout</button>
      </div>
    </>
  );
}

function SellerCardV2({ seller, onPickDelivery }: any) {
  const isWholesaler = seller.type === 'wholesaler';

  // Build a flat product rail. Any item carrying free pieces gets an extra
  // synthetic "FREE" card after it so the buyer sees the scheme delivery at
  // a glance.
  type RailItem = {
    key: string;
    image: string;
    bgColor?: string;
    quantity: number;
    price: number;
    isFree?: boolean;
  };
  const rail: RailItem[] = [];
  seller.items.forEach((item: any, idx: number) => {
    rail.push({
      key: `${item.productId}-${idx}`,
      image: item.image,
      bgColor: item.bgColor,
      quantity: item.quantity,
      price: item.price * item.quantity,
    });
    if (item.freeQty && item.freeQty > 0) {
      rail.push({
        key: `${item.productId}-${idx}-free`,
        image: item.image,
        bgColor: item.bgColor,
        quantity: item.freeQty,
        price: 0,
        isFree: true,
      });
    }
  });

  return (
    <div className="cart-v2-card">
      <div className="cart-v2-card-head">
        <div className="cart-v2-card-headl">
          <div className="cart-v2-card-meta">Buying from</div>
          <div className="cart-v2-card-name">{seller.name}</div>
        </div>
        <div className="cart-v2-card-headr">
          <div className="cart-v2-card-total">
            Total: <span>₹{Math.round(seller.subtotal).toLocaleString('en-IN')}</span>
          </div>
          {seller.savings > 0 && (
            <div className="cart-v2-card-drop">
              <Icon.PriceDrop /> Price dropped by{' '}
              <span>₹{seller.savings.toLocaleString('en-IN', { maximumFractionDigits: 1 })}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action row — delivery fee on the left (Free Delivery / + ₹X
          Delivery), Add More + View items on the right. The MOV breakdown
          (status / progress / Current vs MOV) lives in the next block. */}
      <div className="cart-v2-card-mov">
        <div className="cart-v2-card-fee">
          <Icon.Truck />
          {seller.deliveryFee === 0
            ? 'Free Delivery'
            : `₹${seller.deliveryFee} delivery fees`}
        </div>
        <div className="cart-v2-card-actions">
          <button className="cart-v2-pill">
            <Icon.Plus /> Add More
          </button>
          <button className="cart-v2-pill">View items</button>
        </div>
      </div>

      <div className="cart-v2-mov-block">
        <div className="cart-v2-mov-status-row">
          <span className="cart-v2-mov-status-label">Minimum Order Value</span>
          <span
            className={`cart-v2-mov-status ${seller.movMet ? 'met' : 'pending'}`}
          >
            {seller.movMet
              ? '✓ MOV Met'
              : `₹${Math.round(seller.movRemaining).toLocaleString('en-IN')} to go`}
          </span>
        </div>
        <div className="cart-v2-mov-bar">
          <div
            className={`cart-v2-mov-fill ${seller.movMet ? 'met' : 'pending'}`}
            style={{
              width: `${Math.min((seller.subtotal / seller.mov) * 100, 100)}%`,
            }}
          />
        </div>
        <div className="cart-v2-mov-detail">
          <span>
            Current: <strong>₹{Math.round(seller.subtotal).toLocaleString('en-IN')}</strong>
          </span>
          <span>
            MOV: <strong>₹{seller.mov.toLocaleString('en-IN')}</strong>
          </span>
        </div>
      </div>

      <div className="cart-v2-rail">
        {rail.map((it) => (
          <div key={it.key} className="cart-v2-rail-item">
            <div className="cart-v2-rail-img" style={{ background: it.bgColor || '#f3f4f6' }}>
              <span>{it.image}</span>
              {it.isFree && <div className="cart-v2-rail-free">FREE</div>}
            </div>
            <div className="cart-v2-rail-qty">({it.quantity})</div>
            <div className="cart-v2-rail-price">₹ {it.price}</div>
          </div>
        ))}
      </div>

      <div className="cart-v2-delivery">
        <div className="cart-v2-delivery-label">Delivery by</div>
        {isWholesaler ? (
          <div className="cart-v2-delivery-static">Tomorrow</div>
        ) : (
          <div className="cart-v2-delivery-chips" role="radiogroup">
            {(['beat', 'tomorrow'] as DeliveryKind[]).map((kind) => {
              const active = seller.deliveryKind === kind;
              return (
                <button
                  key={kind}
                  role="radio"
                  aria-checked={active}
                  className={`cart-v2-chip ${active ? 'active' : ''}`}
                  onClick={() => onPickDelivery?.(kind)}
                >
                  {DELIVERY_OPTIONS[kind].label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
