import { useState } from 'react';
import { Icon, StatusBar } from '../../components/Icons';
import { orderHistoryList } from '../../data/mockData';

export default function OrdersScreen({ onBack }: any) {
  const [tab, setTab] = useState('active');

  const isActive = (o) => o.status === 'in_transit' || o.status === 'processing';
  const visibleOrders = tab === 'active'
    ? orderHistoryList.filter(isActive)
    : orderHistoryList.filter((o) => o.status === 'delivered');

  const formatDate = (s) => new Date(s).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

  const statusBadge = (o) => {
    if (o.status === 'delivered') return { bg: '#d1fae5', color: '#065f46', label: 'Delivered' };
    if (o.status === 'in_transit') return { bg: '#dbeafe', color: '#1e40af', label: 'In Transit' };
    return { bg: '#fef3c7', color: '#92400e', label: 'Processing' };
  };

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
            <p>{orderHistoryList.length} total orders</p>
          </div>
          <button className="icon-btn">
            <Icon.Search />
          </button>
        </div>

        <div className="filter-bar" style={{ top: 0 }}>
          <button className={`filter-chip ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>
            Active · {orderHistoryList.filter(isActive).length}
          </button>
          <button className={`filter-chip ${tab === 'delivered' ? 'active' : ''}`} onClick={() => setTab('delivered')}>
            Delivered
          </button>
          <button className="filter-chip">Cancelled</button>
          <button className="filter-chip">Returns</button>
        </div>

        <div className="orders-list">
          {visibleOrders.map((o) => {
            const b = statusBadge(o);
            return (
              <div key={o.id} className="order-card">
                <div className="order-card-head">
                  <div className="order-card-seller">
                    <div className="seller-block-logo" style={{ background: o.sellerColor, width: 32, height: 32, fontSize: 11 }}>
                      {o.sellerLogo}
                    </div>
                    <div>
                      <div className="order-card-id">#{o.id}</div>
                      <div className="order-card-seller-name">{o.seller}</div>
                    </div>
                  </div>
                  <div className="status-badge-pill" style={{ background: b.bg, color: b.color }}>
                    {b.label}
                  </div>
                </div>

                <div className="order-card-items">
                  {o.items.map((item, idx) => (
                    <div key={idx} className="order-card-item">• {item}</div>
                  ))}
                </div>

                <div className="order-card-foot">
                  <div>
                    <div className="order-card-meta">
                      Placed: <strong>{formatDate(o.placedAt)}</strong>
                    </div>
                    <div className="order-card-eta">{o.eta}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="order-card-meta">{o.itemCount} items</div>
                    <div className="order-card-total">₹{o.total.toLocaleString('en-IN')}</div>
                  </div>
                </div>

                <div className="order-card-actions">
                  {o.status === 'delivered' ? (
                    <>
                      <button className="order-action-btn ghost">View Invoice</button>
                      <button className="order-action-btn primary">Reorder</button>
                    </>
                  ) : (
                    <>
                      <button className="order-action-btn ghost">Track Order</button>
                      <button className="order-action-btn primary">Contact Seller</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {visibleOrders.length === 0 && (
            <div className="reorder-empty">
              <div className="reorder-empty-emoji">📭</div>
              <div className="reorder-empty-title">No {tab} orders</div>
              <div className="reorder-empty-sub">Orders you place will appear here.</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
