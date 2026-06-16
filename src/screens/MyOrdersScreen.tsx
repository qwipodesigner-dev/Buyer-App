import { useMemo, useState } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import { SheetHeader, useSheetSwipe } from '../components/SheetBase';
import { orderHistoryList } from '../data/mockData';
import { useI18n } from '../i18n';
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

// "2026-06-16" → "16 Jun"; pass-through anything else (e.g. "Tomorrow 11 AM")
const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function formatShortDate(input?: string): string {
  if (!input) return '—';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
  if (!m) return input;
  const day = parseInt(m[3], 10);
  const month = MONTH_ABBR[parseInt(m[2], 10) - 1];
  return `${day} ${month}`;
}

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
  const { t } = useI18n();
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
            <h1>{t('orders.my_orders')}</h1>
          </div>
        </div>

        {/* Pill tabs */}
        <div className="orders-tabs">
          <button
            className={`orders-tab ${tab === 'wholesalers' ? 'on' : ''}`}
            onClick={() => setTab('wholesalers')}
          >
            {t('home.wholesalers')}
          </button>
          <button
            className={`orders-tab ${tab === 'distributors' ? 'on' : ''}`}
            onClick={() => setTab('distributors')}
          >
            {t('home.distributors')}
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
            const orderId = `QWIP${o.id.replace('QW', '')}204`;
            const placedDate = formatShortDate(o.placedAt);
            const eta = isPlaced ? formatShortDate(o.eta) : 'Tomorrow';

            return (
              <button
                key={o.id}
                className="orders-card"
                onClick={() => onOpenDetails?.(o)}
                aria-label={`Open order ${orderId}`}
              >
                {/* Row 1: seller avatar + name + status badge */}
                <div className="orders-card-row1">
                  <span
                    className="orders-card-avatar"
                    style={{ background: o.sellerColor }}
                  >
                    {o.sellerLogo}
                  </span>
                  <div className="orders-card-seller">
                    <div className="orders-card-seller-name">{o.seller}</div>
                    <div className="orders-card-meta">
                      {o.itemCount} {o.itemCount === 1 ? 'item' : 'items'} · Placed{' '}
                      {placedDate}
                    </div>
                  </div>
                  <span className={`orders-status-pill status-${o.status}`}>
                    {o.statusLabel}
                  </span>
                </div>

                {/* Row 2: total + delivery */}
                <div className="orders-card-row2">
                  <div className="orders-card-total">
                    <div className="orders-card-total-label">Total</div>
                    <div className="orders-card-total-value">
                      ₹{o.total.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="orders-card-eta">
                    <div className="orders-card-eta-label">
                      {isCancelled ? 'Cancelled' : 'Delivery by'}
                    </div>
                    <div className="orders-card-eta-value">
                      {isCancelled ? '—' : eta}
                    </div>
                  </div>
                </div>

                {/* Row 3: copyable ID */}
                <div
                  className="orders-card-id"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CopyText value={orderId} />
                </div>

                {/* Row 4: actions */}
                <div
                  className="orders-actions compact"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isPlaced ? (
                    <button
                      className="orders-action danger"
                      onClick={() => setCancelTarget(o)}
                    >
                      {t('orders.cancel')}
                    </button>
                  ) : !isCancelled ? (
                    <button className="orders-action ghost">
                      <Icon.Image /> {t('orders.invoice')}
                    </button>
                  ) : null}
                  {!isCancelled && (
                    <button
                      className="orders-action primary"
                      onClick={() => setTracking(o)}
                    >
                      {t('orders.track_order')}
                    </button>
                  )}
                  {isCancelled && (
                    <button className="orders-action ghost">
                      <Icon.Reorder /> Reorder
                    </button>
                  )}
                </div>
              </button>
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
