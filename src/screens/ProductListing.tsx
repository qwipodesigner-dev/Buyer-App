import { useState, useMemo } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import { seller, products, brands as allBrands } from '../data/mockData';

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
  onBack,
  onOpenSheet,
  onOpenImageSheet,
  onOpenDiscounts,
  onOpenFilters,
  onGoToCart,
  onUpdateQty,
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
        {/* Top bar */}
        <div className="top-bar">
          <button className="icon-btn" onClick={onBack}>
            <Icon.Back />
          </button>
          <div className="top-title">
            <h1>{category?.name || 'Catalog'}</h1>
            <p>
              {seller.name} · {filteredProducts.length} products
            </p>
          </div>
          <button className="icon-btn">
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

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <button className="crumb" onClick={onBack}>
            Storefront
          </button>
          <span className="crumb-sep">›</span>
          <span className="crumb last">{category?.name || 'Catalog'}</span>
        </div>

        {/* Product list */}
        <div className="product-list">
          {filteredProducts.map((product) => {
            const activeVarId =
              selectedVariant[product.id] || product.variants[0].id;
            const variant = product.variants.find((v) => v.id === activeVarId);
            const cartQty = getCartQty(product.id, variant.id);

            return (
              <div key={product.id} className="product-card">
                <div className="product-card-top">
                  <button
                    className="product-img"
                    style={{ background: product.bgColor }}
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
                      <span className="price-current">₹{variant.sellingPrice}</span>
                      <span className="price-mrp">₹{variant.mrp}</span>
                    </div>
                    <div className="price-meta">
                      per pc · Case ₹{variant.casePrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="margin-badge">{variant.margin}% Margin</div>
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
            <div className="cart-strip-meta">2 sellers · Free delivery applied</div>
          </div>
          <button className="cart-strip-btn" onClick={onGoToCart}>
            <Icon.Cart />
            <span className="badge">
              {(Object.values(cartItems) as number[]).reduce((a, b) => a + b, 0)}
            </span>
            View cart
          </button>
        </div>
      )}
    </>
  );
}

// Re-export brands for FiltersSheet to use
export const availableBrands = allBrands;
