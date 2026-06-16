import { useMemo, useState } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import { SheetHeader, useSheetSwipe } from '../components/SheetBase';
import { orderHistoryList } from '../data/mockData';
import CancelOrderDialog from '../components/CancelOrderDialog';
import CopyText from '../components/CopyText';

type TabKind = 'wholesalers' | 'distributors';

const TRACKING_STEPS: { id: string; label: string }[] = [
  { id: 'placed', label: 'Placed' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'progress', label: 'In Progress' },
  { id: 'out', label: 'Out for Delivery' },
  { id: 'delivered', label: 'Delivered' },
];

function statusToIdx(status: string): number {
  if (status === 'delivered') return 5;
  if (status === 'in_transit') return 4;
  if (status === 'placed') return 1;
  return 3; // processing
}

// Sellers backed by the wholesaler network (any "wholesale" / "mart" name);
// the rest fall under the Distributors tab.
function isWholesalerOrder(o: any) {
  return /wholesale|mart/i.test(o.seller);
}

export default function MyOrdersScreen({ onBack, onOpenDetails }: any) {
  const [tab, setTab] = useState<TabKind>('distributors');
  const [tracking, setTracking] = useState<any>(null);
  const [cancelTarget, setCancelTarget] = useState<any>(null);
  const [cancelledIds, setCancelledIds] = useState<Set<string>>(new Set());

  const visible = useMemo(() => {
    const list = orderHistoryList.map((o) =>
      cancelledIds.has(o.id)
        ? { ...o, status: 'cancelled', statusLabel: 'Cancelled' }
        : o
    );
    return list.filter((o: any) =>
      tab === 'wholesalers' ? isWholesalerOrder(o) : !isWholesalerOrder(o)
    );
  }, [tab, cancelledIds]);

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        <div className="top-bar">
          <button className="icon-btn" onClick={onBack}>
            <Icon.Back />
          </button>
          <div className="top-title">
            <h1>My Orders</h1>
          </div>
        </div>

        {/* Pill tabs */}
        <div className="orders-tabs">
          <button
            className={`orders-tab ${tab === 'wholesalers' ? 'on' : ''}`}
            onClick={() => setTab('wholesalers')}
          >
            Wholesalers
          </button>
          <button
            className={`orders-tab ${tab === 'distributors' ? 'on' : ''}`}
            onClick={() => setTab('distributors')}
          >
            Distributors
          </button>
        </div>

        <div className="orders-list">
          {visible.length === 0 && (
            <div className="reorder-empty">
              <div className="reorder-empty-emoji">📭</div>
              <div className="reorder-empty-title">No orders yet</div>
              <div className="reorder-empty-sub">
                Orders from {tab} will appear here.
              </div>
            </div>
          )}

          {visible.map((o: any) => {
            const isPlaced = o.status === 'placed';
            const isCancelled = o.status === 'cancelled';
            const itemsTotal = o.total - 200;

            return (
              <div key={o.id} className="orders-card">
                <button
                  className="orders-card-head"
                  onClick={() => onOpenDetails?.(o)}
                  aria-label="Open order details"
                >
                  <span className="orders-card-title">Order Details</span>
                  <Icon.ChevronRight />
                </button>

                <div className="orders-row">
                  <span className="orders-label">Seller Name</span>
                  <span className="orders-value">{o.seller}</span>
                </div>
                <div className="orders-row">
                  <span className="orders-label">Order ID</span>
                  <span className="orders-value">
                    <CopyText value={`QWIP${o.id.replace('QW', '')}204`} />
                  </span>
                </div>
                <div className="orders-row">
                  <span className="orders-label">Order Date</span>
                  <span className="orders-value">{o.placedAt}</span>
                </div>
                <div className="orders-row">
                  <span className="orders-label">Expected Delivery Date</span>
                  <span className="orders-value">
                    {isPlaced ? o.eta : '2026-04-16'}
                  </span>
                </div>
                <div className="orders-row">
                  <span className="orders-label">Order Status</span>
                  <span
                    className={`orders-value status-tag status-${o.status}`}
                  >
                    {o.statusLabel}
                  </span>
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
                <div className="orders-row">
                  <span className="orders-label">Total Amount</span>
                  <span className="orders-value">
                    ₹{o.total.toLocaleString('en-IN')}.00
                  </span>
                </div>

                <div className="orders-actions">
                  {isPlaced ? (
                    <button
                      className="orders-action danger"
                      onClick={() => setCancelTarget(o)}
                    >
                      Cancel Order
                    </button>
                  ) : (
                    <button className="orders-action ghost">
                      <Icon.Image /> Invoice
                    </button>
                  )}
                  {!isCancelled && (
                    <button
                      className="orders-action primary"
                      onClick={() => setTracking(o)}
                    >
                      Track Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {tracking && (
        <TrackingSheet order={tracking} onClose={() => setTracking(null)} />
      )}

      {cancelTarget && (
        <CancelOrderDialog
          orderId={cancelTarget.id}
          onClose={() => setCancelTarget(null)}
          onConfirm={({ orderId }: { orderId: string }) => {
            setCancelledIds((prev) => new Set(prev).add(orderId));
            setCancelTarget(null);
          }}
        />
      )}
    </>
  );
}

function TrackingSheet({ order, onClose }: any) {
  const { dragHandlers, sheetStyle } = useSheetSwipe(onClose);
  const activeIdx = statusToIdx(order.status);

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" style={sheetStyle} onClick={(e) => e.stopPropagation()}>
        <SheetHeader
          icon={<Icon.Truck />}
          title="Tracking Details"
          subtitle={`Order ${order.id} · ${order.seller}`}
          onClose={onClose}
          dragHandlers={dragHandlers}
        />

        <div className="sheet-body" style={{ padding: '20px' }}>
          <div className="tracking-timeline">
            {TRACKING_STEPS.map((step, i) => {
              const done = i < activeIdx;
              return (
                <div key={step.id} className="tracking-step">
                  <div className="tracking-marker">
                    <div className={`tracking-dot ${done ? 'done' : ''}`}>
                      {done && <Icon.Check />}
                    </div>
                    {i < TRACKING_STEPS.length - 1 && (
                      <div className={`tracking-line ${done ? 'done' : ''}`} />
                    )}
                  </div>
                  <div className={`tracking-label ${done ? 'done' : ''}`}>
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
