import { useState, useMemo } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import { products } from '../data/mockData';

// Same card pattern as distributor ProductListing — keeps the UI consistent so
// retailers don't have to learn a new layout. Difference: each SKU exposes a
// small row of seller chips so the buyer can switch which wholesaler fulfils it.

const WHOLESALERS = [
  { id: 'wh1', short: 'OE', name: 'Omkar Enterprises', logoColor: '#DC2626', mov: 3000, delivery: 'Today by 8 PM' },
  { id: 'wh2', short: 'SS', name: 'Sri Sai Krishna Traders', logoColor: '#2563EB', mov: 5000, delivery: 'Tomorrow by 11 AM' },
  { id: 'wh3', short: 'KV', name: 'KVS Wholesale Mart', logoColor: '#16A34A', mov: 4000, delivery: 'Tomorrow by 4 PM' },
  { id: 'wh4', short: 'RT', name: 'Ramesh Trading Co.', logoColor: '#7C3AED', mov: 2500, delivery: 'Today by 9 PM' },
];

// Deterministic price-variation per (productId, sellerId) — no Math.random so layout
// is stable across re-renders. Cheaper-priced seller wins the BEST tag.
function pricesForProduct(productId: string, basePrice: number) {
  let hash = 0;
  for (let i = 0; i < productId.length; i++) hash = (hash * 31 + productId.charCodeAt(i)) >>> 0;
  return WHOLESALERS.map((w, i) => {
    const offset = ((hash >> (i * 3)) & 0xf) - 7;
    const price = Math.max(Math.round(basePrice + offset), 1);
    return { seller: w, price };
  });
}

const stockLabel: Record<string, string> = {
  available: 'In Stock',
  limited: 'Limited',
  out: 'Out of Stock',
};

export default function WholesalerProductListScreen({
  category,
  cartItems,
  onBack,
  onOpenSheet,
  onOpenImageSheet,
  onGoToCart,
  onOpenSearch,
  cartTotal = 0,
}: any) {
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});
  const [selectedSeller, setSelectedSeller] = useState<Record<string, string>>({});

  const cat = category || { name: 'Cooking Oils & Ghee', icon: '🛢️' };

  const list = useMemo(() => products.slice(0, 10), []);
  const getCartQty = (productId: string, variantId: string) =>
    cartItems?.[`${productId}_${variantId}`] || 0;

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        {/* Top bar — same pattern as ProductListing */}
        <div className="top-bar">
          <button className="icon-btn" onClick={onBack}>
            <Icon.Back />
          </button>
          <div className="top-title">
            <h1>{cat.name}</h1>
            <p>Multi-seller · {list.length} products</p>
          </div>
          <button className="icon-btn" onClick={onOpenSearch} aria-label="Search">
            <Icon.Search />
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <button className="crumb" onClick={onBack}>
            Wholesalers
          </button>
          <span className="crumb-sep">›</span>
          <span className="crumb last">{cat.name}</span>
        </div>

        {/* Product list — distributor card pattern */}
        <div className="product-list">
          {list.map((product) => {
            const activeVarId = selectedVariant[product.id] || product.variants[0].id;
            const variant = product.variants.find((v) => v.id === activeVarId)!;
            const prices = pricesForProduct(product.id, variant.sellingPrice);
            const activeSellerId = selectedSeller[product.id] || prices[0].seller.id;
            const activePrice = prices.find((p) => p.seller.id === activeSellerId)!;
            const bestPrice = Math.min(...prices.map((p) => p.price));
            const isBest = activePrice.price === bestPrice;
            const cartQty = getCartQty(product.id, variant.id);

            return (
              <div key={product.id} className="product-card">
                <div className="product-card-top">
                  <button
                    className="product-img"
                    style={{ background: product.bgColor }}
                    onClick={() => onOpenImageSheet?.(product)}
                    aria-label={`View images for ${product.name}`}
                  >
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} />
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

                {/* Per-SKU seller chips */}
                <div className="sku-seller-row">
                  <div className="sku-seller-label">Buy from:</div>
                  <div className="sku-seller-chips">
                    {prices.map((pr) => {
                      const isActive = pr.seller.id === activeSellerId;
                      const isCheapest = pr.price === bestPrice;
                      return (
                        <button
                          key={pr.seller.id}
                          className={`sku-seller-chip ${isActive ? 'on' : ''}`}
                          onClick={() =>
                            setSelectedSeller({
                              ...selectedSeller,
                              [product.id]: pr.seller.id,
                            })
                          }
                          aria-label={`${pr.seller.name} — ₹${pr.price}`}
                        >
                          <span
                            className="sku-seller-avatar"
                            style={{ background: pr.seller.logoColor }}
                          >
                            {pr.seller.short}
                          </span>
                          <span className="sku-seller-price">₹{pr.price}</span>
                          {isCheapest && <span className="sku-seller-best">BEST</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Variants */}
                <div className="variant-pills">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      className={`variant-pill ${v.id === activeVarId ? 'active' : ''}`}
                      onClick={() =>
                        setSelectedVariant({
                          ...selectedVariant,
                          [product.id]: v.id,
                        })
                      }
                    >
                      {v.size}
                    </button>
                  ))}
                </div>

                {/* Pricing */}
                <div className="product-price-row">
                  <div className="price-block">
                    <div className="price-main">
                      <span className="price-current">₹{activePrice.price}</span>
                      <span className="price-mrp">₹{variant.mrp}</span>
                      {isBest && <span className="best-tag">BEST PRICE</span>}
                    </div>
                    <div className="price-meta">
                      per pc · {activePrice.seller.name} · {activePrice.seller.delivery}
                    </div>
                  </div>
                  <div className="margin-badge">{variant.margin}% Margin</div>
                </div>

                {/* Actions */}
                <div className="product-actions">
                  <div className="sku-mov-note">
                    MOV ₹{activePrice.seller.mov.toLocaleString('en-IN')}
                  </div>

                  {cartQty > 0 ? (
                    <div className="qty-control compact">
                      <button
                        className="qty-btn"
                        onClick={() => onOpenSheet?.(product, variant)}
                      >
                        <Icon.Minus />
                      </button>
                      <div className="qty-value">{cartQty}</div>
                      <button
                        className="qty-btn"
                        onClick={() => onOpenSheet?.(product, variant)}
                      >
                        <Icon.Plus />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="add-btn compact"
                      onClick={() => onOpenSheet?.(product, variant)}
                      disabled={variant.stock === 'out'}
                    >
                      <Icon.Plus /> Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ paddingBottom: 30 }} />
      </div>

      {cartTotal > 0 && (
        <div className="cart-strip">
          <div className="cart-strip-info">
            <div className="cart-strip-label">Total cart value</div>
            <div className="cart-strip-value">₹{cartTotal.toLocaleString('en-IN')}</div>
          </div>
          <button className="cart-strip-btn" onClick={onGoToCart}>
            <Icon.Cart />
            View cart
          </button>
        </div>
      )}
    </>
  );
}
