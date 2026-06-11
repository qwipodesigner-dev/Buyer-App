import { useState } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import BottomNav from '../components/BottomNav';
import { reorderHistory, products } from '../data/mockData';

export default function ReorderScreen({ cartCount, onNavigate, onOpenSheet, onOpenImageSheet }: any) {
  const [tab, setTab] = useState('distributor');

  const visibleHistory = reorderHistory.filter((h) => h.sellerType === tab);

  // Format date like "May 28, 2026"
  const formatDate = (s) => {
    const d = new Date(s);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        {/* Top bar */}
        <div className="top-bar">
          <div className="top-title">
            <h1>Reorder</h1>
            <p>Quick re-buy from your purchase history</p>
          </div>
          <button className="icon-btn">
            <Icon.Search />
          </button>
        </div>

        {/* Tabs */}
        <div className="home-tabs">
          <button
            className={`home-tab ${tab === 'distributor' ? 'active' : ''}`}
            onClick={() => setTab('distributor')}
          >
            <div className="home-tab-img" style={{ background: '#FEF3C7' }}>📦</div>
            <span>Distributors</span>
          </button>
          <button
            className={`home-tab ${tab === 'wholesaler' ? 'active' : ''}`}
            onClick={() => setTab('wholesaler')}
          >
            <div className="home-tab-img" style={{ background: '#FED7AA' }}>🏪</div>
            <span>Wholesalers</span>
          </button>
        </div>

        {/* Summary strip */}
        <div className="reorder-summary">
          <div>
            <strong>{visibleHistory.length} items</strong> available to reorder
          </div>
          <button className="reorder-bulk-btn">+ Reorder all</button>
        </div>

        {/* Product list */}
        <div className="reorder-list">
          {visibleHistory.map((h) => {
            const product = products.find((p) => p.id === h.productId);
            if (!product) return null;
            const variant = product.variants.find((v) => v.id === h.variantId) || product.variants[0];

            return (
              <div key={h.productId + h.variantId} className="reorder-card">
                <button
                  className="reorder-card-img"
                  style={{ background: product.bgColor }}
                  onClick={() => onOpenImageSheet(product)}
                >
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <span style={{ fontSize: 32 }}>{product.image}</span>
                  )}
                </button>

                <div className="reorder-card-info">
                  <div className="product-brand-tag">{product.brand}</div>
                  <div className="reorder-card-name">{product.name}</div>
                  <div className="reorder-card-variant">
                    {variant.size} · {variant.casePack}
                  </div>

                  <div className="reorder-meta">
                    <div className="reorder-meta-item">
                      <span className="reorder-meta-label">Last ordered</span>
                      <span className="reorder-meta-value">{formatDate(h.lastOrderedAt)}</span>
                    </div>
                    <div className="reorder-meta-item">
                      <span className="reorder-meta-label">Last qty</span>
                      <span className="reorder-meta-value">{h.lastQty} pcs</span>
                    </div>
                    <div className="reorder-meta-item">
                      <span className="reorder-meta-label">Ordered</span>
                      <span className="reorder-meta-value">{h.timesOrdered}×</span>
                    </div>
                  </div>

                  <div className="reorder-card-foot">
                    <div className="price-main">
                      <span className="price-current">₹{variant.sellingPrice}</span>
                      <span className="price-mrp">₹{variant.mrp}</span>
                      <span className="margin-badge" style={{ marginLeft: 6 }}>
                        {variant.margin}%
                      </span>
                    </div>
                    <button
                      className="reorder-add-btn"
                      onClick={() => onOpenSheet(product, variant)}
                    >
                      <Icon.Reorder /> Reorder
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {visibleHistory.length === 0 && (
            <div className="reorder-empty">
              <div className="reorder-empty-emoji">📋</div>
              <div className="reorder-empty-title">No previous orders</div>
              <div className="reorder-empty-sub">
                Items you've previously ordered from {tab}s will appear here.
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav active="listing" cartCount={cartCount} onNavigate={onNavigate} />
    </>
  );
}
