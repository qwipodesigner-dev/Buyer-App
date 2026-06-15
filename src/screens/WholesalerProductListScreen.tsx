import { useState } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import { products } from '../data/mockData';

// PDF page 14 — wholesaler product list. Same SKU is sold by multiple wholesalers.
// User can switch the active seller via chips; price/MOV/delivery update accordingly.

const WHOLESALERS = [
  { id: 'wh1', short: 'OE', name: 'Omkar Enterprises', logoColor: '#DC2626', mov: 3000, delivery: 'Today by 8 PM' },
  { id: 'wh2', short: 'SS', name: 'Sri Sai Krishna Traders', logoColor: '#2563EB', mov: 5000, delivery: 'Tomorrow by 11 AM' },
  { id: 'wh3', short: 'KV', name: 'KVS Wholesale Mart', logoColor: '#16A34A', mov: 4000, delivery: 'Tomorrow by 4 PM' },
  { id: 'wh4', short: 'RT', name: 'Ramesh Trading Co.', logoColor: '#7C3AED', mov: 2500, delivery: 'Today by 9 PM' },
];

// Each product has up to 4 seller prices — generated deterministically
function pricesForProduct(productId: string, basePrice: number) {
  // Hash the productId for deterministic but varied offsets
  let hash = 0;
  for (let i = 0; i < productId.length; i++) hash = (hash * 31 + productId.charCodeAt(i)) >>> 0;

  return WHOLESALERS.map((w, i) => {
    const offset = ((hash >> (i * 3)) & 0xf) - 7; // -7..+8
    const price = Math.max(Math.round(basePrice + offset), 1);
    return { seller: w, price, stock: ((hash >> i) & 0x3) === 0 ? 'limited' : 'available' };
  });
}

export default function WholesalerProductListScreen({
  category,
  onBack,
  onSelectProduct,
}: any) {
  const [activeSeller, setActiveSeller] = useState<string>('wh1');
  const [sort, setSort] = useState<'price' | 'mov' | 'delivery'>('price');

  const cat = category || { name: 'Cooking Oils & Ghee', icon: '🛢️' };
  const list = products.slice(0, 10);

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        {/* Top app bar */}
        <div className="wp-top-bar">
          <button className="icon-btn" onClick={onBack} aria-label="Back">
            <Icon.Back />
          </button>
          <div className="wp-top-title">{cat.name}</div>
          <button className="icon-btn" aria-label="Search">
            <Icon.Search />
          </button>
        </div>

        {/* Multi-seller chips — defining feature for PDF page 14 */}
        <div className="wp-seller-rail-wrap">
          <div className="wp-seller-rail-label">Buy from</div>
          <div className="wp-seller-rail">
            {WHOLESALERS.map((w) => (
              <button
                key={w.id}
                className={`wp-seller-chip ${activeSeller === w.id ? 'on' : ''}`}
                onClick={() => setActiveSeller(w.id)}
              >
                <span
                  className="wp-seller-chip-avatar"
                  style={{ background: w.logoColor }}
                >
                  {w.short}
                </span>
                <span className="wp-seller-chip-text">
                  <span className="wp-seller-chip-name">{w.name}</span>
                  <span className="wp-seller-chip-mov">MOV ₹{w.mov.toLocaleString('en-IN')}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Active seller summary card */}
        {(() => {
          const w = WHOLESALERS.find((x) => x.id === activeSeller)!;
          return (
            <div className="wp-active-card">
              <span className="wp-active-avatar" style={{ background: w.logoColor }}>
                {w.short}
              </span>
              <div className="wp-active-info">
                <div className="wp-active-name">{w.name}</div>
                <div className="wp-active-meta">
                  Delivery: {w.delivery} · MOV ₹{w.mov.toLocaleString('en-IN')}
                </div>
              </div>
              <button className="wp-view-store">View store</button>
            </div>
          );
        })()}

        {/* Sort chips */}
        <div className="wp-sort-row">
          <div className="wp-sort-label">Sort by:</div>
          <button
            className={`wp-sort-chip ${sort === 'price' ? 'on' : ''}`}
            onClick={() => setSort('price')}
          >
            Best price
          </button>
          <button
            className={`wp-sort-chip ${sort === 'mov' ? 'on' : ''}`}
            onClick={() => setSort('mov')}
          >
            Lowest MOV
          </button>
          <button
            className={`wp-sort-chip ${sort === 'delivery' ? 'on' : ''}`}
            onClick={() => setSort('delivery')}
          >
            Fastest
          </button>
        </div>

        {/* Product list with per-seller pricing */}
        <div className="wp-list">
          {list.map((p) => {
            const prices = pricesForProduct(p.id, p.variants[0].sellingPrice);
            const activePrice = prices.find((x) => x.seller.id === activeSeller)!;
            const bestPrice = Math.min(...prices.map((x) => x.price));
            const isBest = activePrice.price === bestPrice;

            return (
              <button
                key={p.id}
                className="wp-product"
                onClick={() => onSelectProduct?.(p)}
              >
                <div className="wp-product-img" style={{ background: p.bgColor }}>
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} />
                  ) : (
                    <span>{p.image}</span>
                  )}
                </div>
                <div className="wp-product-info">
                  <div className="wp-product-brand">{p.brand}</div>
                  <div className="wp-product-name">{p.name}</div>
                  <div className="wp-product-meta">
                    {p.variants[0].size} · {p.variants[0].casePack}
                  </div>
                  {/* Mini seller comparison row */}
                  <div className="wp-mini-sellers">
                    {prices.slice(0, 4).map((pr) => (
                      <div
                        key={pr.seller.id}
                        className={`wp-mini-seller ${
                          pr.seller.id === activeSeller ? 'on' : ''
                        }`}
                        title={pr.seller.name}
                      >
                        <span
                          className="wp-mini-avatar"
                          style={{ background: pr.seller.logoColor }}
                        >
                          {pr.seller.short}
                        </span>
                        <span className="wp-mini-price">₹{pr.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="wp-product-right">
                  {isBest && <div className="wp-best-tag">BEST</div>}
                  <div className="wp-product-current">₹{activePrice.price}</div>
                  <div className="wp-product-mrp">₹{p.variants[0].mrp}</div>
                  <button className="wp-add-btn">
                    <Icon.Plus /> Add
                  </button>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ paddingBottom: 30 }} />
      </div>
    </>
  );
}
