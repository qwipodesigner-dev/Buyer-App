import { Icon, StatusBar } from '../components/Icons';
import BottomNav from '../components/BottomNav';
import { seller, categories, brands, products } from '../data/mockData';

export default function SellerStorefront({ cartCount, distributor, onBack, onNavigate, onSelectCategory, onSelectProduct }: any) {
  const featured = products.slice(0, 4);
  const activeSeller = distributor
    ? {
        ...seller,
        name: distributor.name,
        shortName: distributor.shortName,
        mov: distributor.mov,
        location: distributor.location,
        totalSKUs: distributor.skuCount,
      }
    : seller;

  // Initials for the logo box (first letters of name words, max 4)
  const initials = activeSeller.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 4)
    .toUpperCase();

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
            <h1>Storefront</h1>
          </div>
          <button className="icon-btn">
            <Icon.Bell />
          </button>
        </div>

        {/* Hero — seller info */}
        <div className="storefront-hero">
          <div className="seller-header">
            <div className="seller-logo">{initials}</div>
            <div className="seller-info">
              <div className="seller-name">
                {activeSeller.name}
                <span className="verified-badge">
                  <Icon.Check />
                </span>
              </div>
              <div className="seller-meta">
                <span className="seller-meta-tag">Authorised</span>
                <span className="seller-meta-dot"></span>
                <span>{activeSeller.location}</span>
              </div>
            </div>
          </div>
          <div className="seller-stats">
            <div className="stat-cell">
              <div className="stat-label">MIN ORDER</div>
              <div className="stat-value">₹{activeSeller.mov.toLocaleString('en-IN')}</div>
            </div>
            <div className="stat-cell">
              <div className="stat-label">DELIVERY</div>
              <div className="stat-value">Tomorrow</div>
              <div className="stat-value-sub">by 11 AM</div>
            </div>
            <div className="stat-cell">
              <div className="stat-label">CATALOG</div>
              <div className="stat-value">{activeSeller.totalSKUs}</div>
              <div className="stat-value-sub">SKUs</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="search-bar-wrap">
          <div className="search-bar">
            <Icon.Search />
            <input placeholder="Search products, brands, SKUs..." />
            <div className="search-bar-divider"></div>
            <button className="scan-btn">
              <Icon.Scan />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="section">
          <div className="section-head">
            <div className="section-title">Shop by Category</div>
            <button className="section-link">See all</button>
          </div>
          <div className="category-grid">
            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                className="category-tile"
                onClick={() => onSelectCategory(cat)}
              >
                <div className="category-icon-wrap" style={{ background: cat.color }}>
                  {cat.icon}
                </div>
                <div className="category-name">{cat.name}</div>
                <div className="category-count">{cat.count} items</div>
              </button>
            ))}
          </div>
        </div>

        {/* Promo */}
        <div className="promo-card">
          <div className="promo-text">
            <div className="promo-tag">Seller Offer</div>
            <div className="promo-title">Flat ₹200 off above ₹6,000</div>
            <div className="promo-sub">Valid on first order this month</div>
          </div>
          <div className="promo-emoji">🎁</div>
        </div>

        {/* Brands */}
        <div className="section">
          <div className="section-head">
            <div className="section-title">Top Brands</div>
            <button className="section-link">See all</button>
          </div>
          <div className="rail">
            {brands.map((brand) => (
              <button
                key={brand.id}
                className="brand-tile"
                onClick={() => onSelectCategory({ id: brand.id, name: brand.name, isBrand: true })}
              >
                <div
                  className="brand-circle"
                  style={{ background: brand.logo ? '#ffffff' : brand.color }}
                >
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      style={{ width: '70%', height: '70%', objectFit: 'contain' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.style.background = brand.color;
                        e.currentTarget.parentElement.textContent = brand.logoText;
                      }}
                    />
                  ) : (
                    brand.logoText
                  )}
                </div>
                <div className="brand-name">{brand.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Featured */}
        <div className="section" style={{ paddingBottom: '90px' }}>
          <div className="section-head">
            <div className="section-title">Best Sellers</div>
            <button className="section-link">View catalog</button>
          </div>
          <div className="rail">
            {featured.map((product) => (
              <button
                key={product.id}
                className="product-rail-card"
                onClick={() => onSelectProduct(product)}
              >
                <div className="product-rail-img" style={{ background: product.bgColor, padding: 8 }}>
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.innerHTML = `<span style="font-size:44px">${product.image}</span>`;
                      }}
                    />
                  ) : (
                    product.image
                  )}
                </div>
                <div className="product-rail-name">{product.name}</div>
                <div className="product-rail-price">
                  ₹{product.variants[0].sellingPrice}
                  <span className="product-rail-mrp">₹{product.variants[0].mrp}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="home" cartCount={cartCount} onNavigate={onNavigate} />
    </>
  );
}
