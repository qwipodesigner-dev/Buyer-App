import { useState } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import { SheetHeader, useSheetSwipe } from '../components/SheetBase';
import { orderHistoryList } from '../data/mockData';

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
  return 3; // processing
}

export default function MyOrdersScreen({ onBack }: any) {
  const [tab, setTab] = useState<TabKind>('distributors');
  const [tracking, setTracking] = useState<any>(null);

  const visible = orderHistoryList; // demo: same list across both tabs

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
          {visible.map((o) => (
            <div key={o.id} className="orders-card">
              <div className="orders-card-head">
                <span className="orders-card-title">Order Details</span>
                <Icon.ChevronRight />
              </div>
              <div className="orders-row">
                <span className="orders-label">Seller Name</span>
                <span className="orders-value">{o.seller}</span>
              </div>
              <div className="orders-row">
                <span className="orders-label">Order ID</span>
                <span className="orders-value mono">QWIP{o.id.replace('QW', '')}204</span>
              </div>
              <div className="orders-row">
                <span className="orders-label">Order Date</span>
                <span className="orders-value">{o.placedAt}</span>
              </div>
              <div className="orders-row">
                <span className="orders-label">Expected Delivery Date</span>
                <span className="orders-value">2026-04-16</span>
              </div>
              <div className="orders-row">
                <span className="orders-label">Order Status</span>
                <span className="orders-value">{o.statusLabel}</span>
              </div>
              <div className="orders-row">
                <span className="orders-label">Items Total</span>
                <span className="orders-value">₹{(o.total - 200).toLocaleString('en-IN')}</span>
              </div>
              <div className="orders-row">
                <span className="orders-label">Delivery Fee</span>
                <span className="orders-value">₹200</span>
              </div>
              <div className="orders-row">
                <span className="orders-label">Total Amount</span>
                <span className="orders-value">₹{o.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="orders-actions">
                <button className="orders-action ghost">
                  <Icon.Image /> Invoice
                </button>
                <button
                  className="orders-action primary"
                  onClick={() => setTracking(o)}
                >
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {tracking && (
        <TrackingSheet order={tracking} onClose={() => setTracking(null)} />
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
