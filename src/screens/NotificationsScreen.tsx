import { useState } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import { notifications as initialNotifs } from '../data/mockData';

export default function NotificationsScreen({ onBack }: any) {
  const [tab, setTab] = useState('all');
  const [notifs, setNotifs] = useState(initialNotifs);

  const filtered = tab === 'all' ? notifs : notifs.filter((n) => n.type === tab);
  const unreadCount = notifs.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, unread: false })));
  };

  const markRead = (id) => {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

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
            <h1>Notifications</h1>
            <p>{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <button className="topbar-text-action" onClick={markAllRead}>
              Mark all read
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="filter-bar" style={{ top: 0 }}>
          <button
            className={`filter-chip ${tab === 'all' ? 'active' : ''}`}
            onClick={() => setTab('all')}
          >
            All
          </button>
          <button
            className={`filter-chip ${tab === 'order' ? 'active' : ''}`}
            onClick={() => setTab('order')}
          >
            Orders
          </button>
          <button
            className={`filter-chip ${tab === 'promo' ? 'active' : ''}`}
            onClick={() => setTab('promo')}
          >
            Offers
          </button>
          <button
            className={`filter-chip ${tab === 'stock' ? 'active' : ''}`}
            onClick={() => setTab('stock')}
          >
            Stock
          </button>
          <button
            className={`filter-chip ${tab === 'system' ? 'active' : ''}`}
            onClick={() => setTab('system')}
          >
            System
          </button>
        </div>

        {/* Notification list */}
        <div className="notif-list">
          {filtered.map((n) => (
            <button
              key={n.id}
              className={`notif-card ${n.unread ? 'unread' : ''}`}
              onClick={() => markRead(n.id)}
            >
              <div className="notif-icon" style={{ background: n.iconColor }}>
                {n.icon}
              </div>
              <div className="notif-body">
                <div className="notif-title-row">
                  <span className="notif-title">{n.title}</span>
                  {n.unread && <span className="notif-dot" />}
                </div>
                <div className="notif-text">{n.body}</div>
                <div className="notif-time">{n.time}</div>
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="reorder-empty">
              <div className="reorder-empty-emoji">🔕</div>
              <div className="reorder-empty-title">All caught up</div>
              <div className="reorder-empty-sub">No notifications in this category.</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
