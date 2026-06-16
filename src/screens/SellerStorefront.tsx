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
            <h1>Authorised Distributor</h1>
          </div>
          <button className="icon-btn">
            <Icon.Bell />
          </button>
        </div>

        {/* Hero — seller info (location/SKU removed for retailer clarity) */}
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
              </div>
            </div>
          </div>
          <div className="seller-stats two-cell">
            <div className="stat-cell">
              <div className="stat-label">Minimum Order Value</div>
              <div className="stat-value">₹{activeSeller.mov.toLocaleString('en-IN')}</div>
            </div>
            <div className="stat-cell">
              <div className="stat-label">Delivery by</div>
              <div className="stat-value">
                {/* deliveryTime is "Tomorrow by 11 AM" / "Wednesday by 4 PM" etc — strip the time portion */}
                {(activeSeller.deliveryTime || 'Tomorrow').replace(/\s+by\s+.*$/i, '')}
              </div>
            </div>
          </div>
        </div>

        {/* Categories — 2:1 image cards with name-sized widths */}
        <div className="section">
          <div className="section-head">
            <div className="section-title">Shop by category</div>
            <button className="section-link">See all</button>
          </div>
          <div className="cat-rail">
            {categories.map((cat) => {
              return (
              <button
                key={cat.id}
                className="cat-card"
                onClick={() => onSelectCategory(cat)}
              >
                <div className="cat-card-img" style={{ background: cat.color }}>
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                        const parent = (e.currentTarget as HTMLImageElement).parentElement!;
                        parent.innerHTML = `<span class="cat-card-fallback">${cat.icon}</span>`;
                      }}
                    />
                  ) : (
                    <span className="cat-card-fallback">{cat.icon}</span>
                  )}
                </div>
                <div className="cat-card-body">
                  <div className="cat-card-name">{cat.name}</div>
                  <div className="cat-card-count">{cat.count} items</div>
                </div>
              </button>
              );
            })}
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

        {/* Brands — Phase-one PNG logos */}
        <div className="section">
          <div className="section-head">
            <div className="section-title">Top brands</div>
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

        {/* Featured — Best sellers use the same .product-card pattern as ProductListing */}
        <div className="section" style={{ paddingBottom: '90px' }}>
          <div className="section-head">
            <div className="section-title">Best sellers</div>
            <button className="section-link">View catalog</button>
          </div>
          <div className="rail product-rail">
            {featured.map((product) => {
              const variant = product.variants[0];
              const stockLabel: Record<string, string> = {
                available: 'In Stock',
                limited: 'Limited',
                out: 'Out of Stock',
              };
              return (
                <div key={product.id} className="product-card product-card-rail">
                  <div className="product-card-top">
                    <button
                      className="product-img"
                      style={{ background: product.bgColor }}
                      onClick={() => onSelectProduct(product)}
                      aria-label={`View ${product.name}`}
                    >
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = `<span style="font-size:30px">${product.image}</span>`;
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: 30 }}>{product.image}</span>
                      )}
                    </button>
                    <div className="product-info">
                      <div className="product-meta-row">
                        <span className="product-brand-tag">{product.brand}</span>
                        <span className={`stock-chip stock-${variant.stock}`}>
                          <span className="stock-dot"></span>
                          {stockLabel[variant.stock]}
                        </span>
                      </div>
                      <div className="product-name">{product.name}</div>
                    </div>
                  </div>

                  <div className="product-price-row">
                    <div className="price-block">
                      <div className="price-main">
                        <span className="price-current">₹{variant.sellingPrice}</span>
                        <span className="price-mrp">₹{variant.mrp}</span>
                      </div>
                      <div className="price-meta">{variant.size}</div>
                    </div>
                    <div className="margin-badge">{variant.margin}%</div>
                  </div>

                  <div className="product-actions">
                    <button
                      className="add-btn compact"
                      onClick={() => onSelectProduct(product)}
                      disabled={variant.stock === 'out'}
                      style={{ width: '100%' }}
                    >
                      <Icon.Plus /> Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav active="home" cartCount={cartCount} onNavigate={onNavigate} />
    </>
  );
}
