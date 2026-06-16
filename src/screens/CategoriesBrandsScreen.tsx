import { useState } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import { brands, categories, products } from '../data/mockData';

// PDF page 9 — drill-in showing all brands under a distributor's category.
// E.g. tap "Nestle" under "Omkar Enterprises" → this screen lists Nestle SKUs.

export default function CategoriesBrandsScreen({
  distributor,
  category,
  onBack,
  onSelectProduct,
  onSelectBrand,
  onOpenSearch,
}: any) {
  const [activeBrand, setActiveBrand] = useState<string>('all');

  const cat = category || categories[0];
  const dist = distributor || { name: 'Omkar Enterprises', shortName: 'Omkar' };

  // Brand chips shown at the top — derived from products in this category
  const brandsForCategory = brands.slice(0, 6);

  const filteredProducts =
    activeBrand === 'all'
      ? products
      : products.filter((p) => p.brand.toLowerCase() === activeBrand.toLowerCase());

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        {/* Top app bar */}
        <div className="cb-top-bar">
          <button className="icon-btn" onClick={onBack} aria-label="Back">
            <Icon.Back />
          </button>
          <div className="cb-top-info">
            <div className="cb-top-title">{cat.name}</div>
            <div className="cb-top-sub">{dist.name}</div>
          </div>
          <button className="icon-btn" aria-label="Search" onClick={onOpenSearch}>
            <Icon.Search />
          </button>
        </div>

        {/* Hero banner */}
        <div className="cb-hero" style={{ background: cat.color || '#FED7AA' }}>
          <div className="cb-hero-text">
            <div className="cb-hero-tag">FRESH STOCK • {cat.count || 142} SKUs</div>
            <div className="cb-hero-title">{cat.name} from {dist.shortName}</div>
            <div className="cb-hero-sub">Trusted brands • Authorised supply</div>
          </div>
          <div className="cb-hero-art">{cat.icon || '📦'}</div>
        </div>

        {/* Brand chips */}
        <div className="cb-brand-rail-wrap">
          <div className="cb-brand-rail">
            <button
              className={`cb-brand-chip ${activeBrand === 'all' ? 'on' : ''}`}
              onClick={() => setActiveBrand('all')}
            >
              All brands
            </button>
            {brandsForCategory.map((b) => (
              <button
                key={b.id}
                className={`cb-brand-chip ${activeBrand === b.name ? 'on' : ''}`}
                onClick={() => setActiveBrand(b.name)}
              >
                <span
                  className="cb-brand-chip-circle"
                  style={{ background: b.logo ? '#ffffff' : b.color }}
                >
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} />
                  ) : (
                    <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>
                      {b.logoText}
                    </span>
                  )}
                </span>
                {b.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured brands grid (PDF page 9 layout) */}
        <div className="section">
          <div className="section-head">
            <div className="section-title">Featured brands</div>
            <span className="cb-count">{brandsForCategory.length} brands</span>
          </div>
          <div className="cb-grid">
            {brandsForCategory.map((b) => (
              <button
                key={b.id}
                className="cb-brand-tile"
                onClick={() => onSelectBrand?.(b)}
              >
                <div
                  className="cb-brand-tile-circle"
                  style={{ background: b.logo ? '#ffffff' : b.color }}
                >
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} />
                  ) : (
                    <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>
                      {b.logoText}
                    </span>
                  )}
                </div>
                <div className="cb-brand-tile-name">{b.name}</div>
                <div className="cb-brand-tile-skus">
                  {/* Deterministic: char-code sum % 30 + 8 → stable across renders */}
                  {(b.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 30) + 8} SKUs
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Product list */}
        <div className="section" style={{ paddingBottom: 30 }}>
          <div className="section-head">
            <div className="section-title">
              {activeBrand === 'all' ? 'All products' : activeBrand}
            </div>
            <span className="cb-count">{filteredProducts.length} items</span>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="cb-empty">No products found for {activeBrand}.</div>
          ) : (
            <div className="cb-product-list">
              {filteredProducts.slice(0, 10).map((p) => (
                <button
                  key={p.id}
                  className="cb-product"
                  onClick={() => onSelectProduct?.(p)}
                >
                  <div className="cb-product-img" style={{ background: p.bgColor }}>
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} />
                    ) : (
                      <span>{p.image}</span>
                    )}
                  </div>
                  <div className="cb-product-info">
                    <div className="cb-product-brand">{p.brand}</div>
                    <div className="cb-product-name">{p.name}</div>
                    <div className="cb-product-meta">
                      {p.variants.length} pack sizes
                    </div>
                  </div>
                  <div className="cb-product-price">
                    <div className="cb-product-current">
                      ₹{p.variants[0].sellingPrice}
                    </div>
                    <div className="cb-product-mrp">₹{p.variants[0].mrp}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
