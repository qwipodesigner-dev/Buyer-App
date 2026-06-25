import { useState, useMemo } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import {
  seller,
  products,
  brands as allBrands,
  distributors,
  distributorsList,
} from '../data/mockData';

// Map a product to the distributor that carries its brand. Used to surface
// the seller name on each product card when we're browsing the brand-pool
// (cumulative across sellers) listing.
//
// distributorsList has the brand-membership info; the cart and the rest of
// the app key off the canonical name in `distributors` (which differs in
// places — e.g. "Sri Sai" vs "Shri Sai"). Resolve via id so the shared
// per-seller delivery state stays in sync with the cart.
function sellerForProduct(product: any): string {
  const target = (product.brand || '').toLowerCase();
  for (const d of distributorsList) {
    if (d.brands.some((b: any) =>
      (b.short || b.name || '').toLowerCase() === target
    )) {
      const canonical = distributors.find((x: any) => x.id === d.id);
      return canonical?.name || d.name;
    }
  }
  return seller.name;
}

const DEFAULT_FILTERS = {
  sort: 'recommended',
  stock: [],         // empty = all
  brands: [],        // empty = all
  minMargin: 0,
  schemesOnly: false,
};

export const filtersDefault = DEFAULT_FILTERS;

export function countActiveFilters(f) {
  let n = 0;
  if (f.sort !== 'recommended') n += 1;
  if (f.stock.length) n += 1;
  if (f.brands.length) n += 1;
  if (f.minMargin > 0) n += 1;
  if (f.schemesOnly) n += 1;
  return n;
}

export default function ProductListing({
  category,
  cartItems,
  cartTotal,
  filters,
  deliveryBySeller,
  onUpdateDelivery,
  onBack,
  onOpenSheet,
  onOpenImageSheet,
  onOpenDiscounts,
  onOpenFilters,
  onGoToCart,
  onUpdateQty,
  onOpenSearch,
  onNavigateBreadcrumb,
}: any) {
  const [selectedVariant, setSelectedVariant] = useState<any>({});

  const activeFilters = filters || DEFAULT_FILTERS;

  const stockLabel = {
    available: 'In Stock',
    limited: 'Limited',
    out: 'Out of Stock',
  };

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      if (!category) return true;
      if (category.isBrand) return p.brand === category.name;
      return p.category === category.id;
    });
    if (list.length === 0) list = products;

    // Apply filter sheet selections
    if (activeFilters.brands.length) {
      list = list.filter((p) => activeFilters.brands.includes(p.brand));
    }
    if (activeFilters.stock.length) {
      list = list.filter((p) => {
        const v0 = p.variants[0];
        return activeFilters.stock.includes(v0.stock);
      });
    }
    if (activeFilters.minMargin > 0) {
      list = list.filter((p) =>
        p.variants.some((v) => v.margin >= activeFilters.minMargin)
      );
    }
    if (activeFilters.schemesOnly) {
      list = list.filter((p) => p.variants.some((v) => v.scheme));
    }

    // Sort
    const sorted = [...list];
    if (activeFilters.sort === 'price_asc') {
      sorted.sort((a, b) => a.variants[0].sellingPrice - b.variants[0].sellingPrice);
    } else if (activeFilters.sort === 'price_desc') {
      sorted.sort((a, b) => b.variants[0].sellingPrice - a.variants[0].sellingPrice);
    } else if (activeFilters.sort === 'margin_desc') {
      // Sort by the variant currently shown in the card (= first variant)
      // so the visible margin ordering matches the sort direction.
      sorted.sort((a, b) => b.variants[0].margin - a.variants[0].margin);
    }

    return sorted;
  }, [category, activeFilters]);

  const getCartQty = (productId, variantId) =>
    cartItems[`${productId}_${variantId}`] || 0;

  const activeCount = countActiveFilters(activeFilters);

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        {/* Sticky cluster: top-bar + breadcrumb stay pinned while the product
            list scrolls beneath. */}
        <div className="dl-sticky-top">
          <div className="top-bar">
            <button className="icon-btn" onClick={onBack}>
              <Icon.Back />
            </button>
            <div className="top-title">
              <h1>{category?.name || 'Catalog'}</h1>
              <p>{filteredProducts.length} products</p>
            </div>
            <button className="icon-btn" onClick={onOpenSearch} aria-label="Search">
              <Icon.Search />
            </button>
            <button
              className="icon-btn filter-trigger"
              onClick={onOpenFilters}
              aria-label="Open filters"
            >
              <Icon.Sliders />
              {activeCount > 0 && <span className="filter-trigger-badge">{activeCount}</span>}
            </button>
          </div>

          {Array.isArray(category?.breadcrumb) && category.breadcrumb.length > 0 && (
            <div className="breadcrumb">
              {category.breadcrumb.map((b: any, i: number) => {
                const isLast = i === category.breadcrumb.length - 1;
                return (
                  <span key={`${b.label}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {isLast ? (
                      <span className="crumb last">{b.label}</span>
                    ) : (
                      <button
                        className="crumb"
                        onClick={() => onNavigateBreadcrumb?.(b.goTo)}
                      >
                        {b.label}
                      </button>
                    )}
                    {!isLast && <span className="crumb-sep">›</span>}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Product list */}
        <div className="product-list">
          {filteredProducts.map((product) => {
            const activeVarId =
              selectedVariant[product.id] || product.variants[0].id;
            const variant = product.variants.find((v) => v.id === activeVarId);
            const cartQty = getCartQty(product.id, variant.id);
            const sellerName = sellerForProduct(product);
            const sellerDelivery = deliveryBySeller?.[sellerName] || 'beat';

            // Strip packaging suffix (Pouch / Jar / Tin / Box / Bottle / etc.)
            // from the variant size so the pill and the title show just the
            // quantity ("1 Ltr" / "500 ml") until the buyer asks otherwise.
            const stripPack = (s: string) =>
              s.replace(/\s+(Pouch|Jar|Tin|Box|Packet|Bottle|Sachet|Carton|Bag|Tube)s?$/i, '');
            const sizeClean = stripPack(variant.size);
            const sizeTitle = sizeClean.replace(/\b\w/g, (c) => c.toUpperCase());

            return (
              <div key={product.id} className="product-card">
                <div className="product-card-top">
                  <div className="product-info">
                    <div className="product-name">
                      {product.name} - {sizeTitle} Packet X {variant.casePcs} Nos
                    </div>
                    <div className="product-seller">{sellerName}</div>
                    <div className="product-subline">
                      <span>{variant.casePcs} pc/Case</span>
                      <span className="product-case-price">
                        ₹ {variant.casePrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <button
                    className="product-img"
                    onClick={() => onOpenImageSheet(product)}
                    aria-label={`View images for ${product.name}`}
                  >
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement.innerHTML = `<span style="font-size:30px">${product.image}</span>`;
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: 30 }}>{product.image}</span>
                    )}
                    {product.images?.length > 1 && (
                      <div className="product-img-count">
                        +{product.images.length - 1}
                      </div>
                    )}
                  </button>
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
                      {stripPack(v.size)}
                    </button>
                  ))}
                </div>

                {/* Pricing — outlined margin chip left, MRP + price stacked right */}
                <div className="product-price-row">
                  <div className="margin-badge">{variant.margin}% Margin</div>
                  <div className="price-block">
                    <div className="price-mrp-row">
                      MRP <span className="price-mrp">₹ {variant.mrp}</span>
                    </div>
                    <div className="price-main">
                      <span className="price-current">
                        ₹ {variant.sellingPrice}
                      </span>
                      <span className="price-unit">/pc</span>
                    </div>
                  </div>
                </div>

                {/* Actions — compact Discounts + Add */}
                <div className="product-actions">
                  <button
                    className="discounts-btn-filled"
                    onClick={() => onOpenDiscounts(product, variant)}
                  >
                    Discounts <Icon.ChevronDown />
                  </button>

                  {cartQty > 0 ? (
                    <div className="qty-control compact">
                      <button
                        className="qty-btn"
                        onClick={() => onUpdateQty(product, variant, cartQty - 1)}
                      >
                        <Icon.Minus />
                      </button>
                      <div className="qty-value">{cartQty}</div>
                      <button
                        className="qty-btn"
                        onClick={() => onUpdateQty(product, variant, cartQty + 1)}
                      >
                        <Icon.Plus />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="add-btn compact"
                      onClick={() => onOpenSheet(product, variant)}
                      disabled={variant.stock === 'out'}
                    >
                      <Icon.Plus /> Add
                    </button>
                  )}
                </div>

                {/* Delivery options — radio selection per seller. Friday
                    (beat day) is the default and leads; switching here mirrors
                    to every other product from the same seller and to the
                    cart. Delivery fee is shown once at the bottom — always
                    free today; placeholder for the future when a fee may
                    apply. */}
                <div
                  className="product-delivery"
                  role="radiogroup"
                  aria-label="Delivery option"
                >
                  {([
                    { kind: 'beat',     day: 'Fri (Beat day)', mov: 500  },
                    { kind: 'tomorrow', day: 'Tomorrow',       mov: 2500 },
                  ] as const).map((opt) => {
                    const active = sellerDelivery === opt.kind;
                    return (
                      <button
                        key={opt.kind}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        className={`product-delivery-option ${active ? 'active' : ''}`}
                        onClick={() => onUpdateDelivery?.(sellerName, opt.kind)}
                      >
                        <span className="product-delivery-radio" aria-hidden="true" />
                        <span className="product-delivery-text">
                          <span className="product-delivery-day">{opt.day}</span>
                          <span className="product-delivery-meta">
                            MOV: <strong>{opt.mov}</strong>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="product-delivery-fee-note">
                  <Icon.Truck /> Free Delivery
                </div>
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="reorder-empty">
              <div className="reorder-empty-emoji">🔍</div>
              <div className="reorder-empty-title">No matches</div>
              <div className="reorder-empty-sub">
                Try removing some filters to see more products.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky cart strip */}
      {cartTotal > 0 && (
        <div className="cart-strip">
          <div className="cart-strip-info">
            <div className="cart-strip-label">Total cart value</div>
            <div className="cart-strip-value">₹{cartTotal.toLocaleString('en-IN')}</div>
            <div className="cart-strip-meta">Free delivery applied</div>
          </div>
          <button className="cart-strip-btn" onClick={onGoToCart}>
            <Icon.Cart />
            Cart
          </button>
        </div>
      )}
    </>
  );
}

// Re-export brands for FiltersSheet to use
export const availableBrands = allBrands;
