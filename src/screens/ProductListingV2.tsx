import { useState, useMemo } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import {
  seller,
  products,
  distributors,
  distributorsList,
} from '../data/mockData';
import { filtersDefault, countActiveFilters } from './ProductListing';

// Preview-only V2 of the product listing. Same layout as V1 but the per-
// product delivery options are READ-ONLY information — no radio buttons,
// no selection state, no seller-level mirroring. The card just surfaces
// which delivery dates are available for the SKU and their MOVs. Sits
// behind sidebar entry #12 (design preview), not in the main flow.

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

type DeliveryKind = 'beat' | 'tomorrow';

const DELIVERY_FEES = {
  beat: 0,
  tomorrow: 24,
} as const;

const DELIVERY_LABELS = {
  beat:     { day: 'Fri (Beat day)', mov: 500  },
  tomorrow: { day: 'Tomorrow',       mov: 2500 },
} as const;

export default function ProductListingV2({
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
  onOpenSearch,
  onNavigateBreadcrumb,
}: any) {
  const [selectedVariant, setSelectedVariant] = useState<any>({});
  const activeFilters = filters || filtersDefault;

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      if (!category) return true;
      if (category.isBrand) return p.brand === category.name;
      return p.category === category.id;
    });

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

    const sorted = [...list];
    if (activeFilters.sort === 'price_asc') {
      sorted.sort((a, b) => a.variants[0].sellingPrice - b.variants[0].sellingPrice);
    } else if (activeFilters.sort === 'price_desc') {
      sorted.sort((a, b) => b.variants[0].sellingPrice - a.variants[0].sellingPrice);
    } else if (activeFilters.sort === 'margin_desc') {
      sorted.sort((a, b) => b.variants[0].margin - a.variants[0].margin);
    }

    return sorted;
  }, [category, activeFilters]);

  const getCartQty = (productId: string, variantId: string) =>
    cartItems[`${productId}_${variantId}`] || 0;

  const activeCount = countActiveFilters(activeFilters);

  return (
    <>
      <StatusBar />
      <div className="screen-body">
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

        <div className="product-list">
          {filteredProducts.map((product) => {
            const activeVarId =
              selectedVariant[product.id] || product.variants[0].id;
            const variant = product.variants.find((v) => v.id === activeVarId);
            const cartQty = getCartQty(product.id, variant.id);
            const sellerName = sellerForProduct(product);
            const productOpts: readonly DeliveryKind[] =
              product.deliveryOptions && product.deliveryOptions.length > 0
                ? product.deliveryOptions
                : (['beat', 'tomorrow'] as const);
            // Default the inline "Free / + ₹X" fee note to the cheapest
            // eligible option since there's no selection on this screen.
            const defaultKind: DeliveryKind = productOpts.includes('beat') ? 'beat' : productOpts[0];

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
                    {!category?.fromStorefront && (
                      <div className="product-seller">{sellerName}</div>
                    )}
                    <div className="product-subline">
                      <span>Case: {variant.casePcs} pcs</span>
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
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                          (e.currentTarget as HTMLImageElement).parentElement!.innerHTML = `<span style="font-size:30px">${product.image}</span>`;
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: 30 }}>{product.image}</span>
                    )}
                  </button>
                </div>

                <div className="variant-pills">
                  {product.variants.map((v: any) => (
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

                <div className="product-price-row">
                  <div className="margin-col">
                    <div className="margin-badge">{variant.margin}% Margin</div>
                    <div className="product-delivery-fee-inline">
                      <Icon.Truck />
                      {DELIVERY_FEES[defaultKind] === 0
                        ? 'Free Delivery'
                        : `+ ₹${DELIVERY_FEES[defaultKind]} Delivery`}
                    </div>
                  </div>
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

                {/* Read-only delivery info — no radios, no selection, no
                    click. Surfaces the dates and MOVs as plain labels so
                    the buyer can see what's available; selection happens
                    later in the cart. */}
                <div className="product-delivery readonly" aria-label="Delivery dates">
                  {productOpts.map((kind) => {
                    const opt = DELIVERY_LABELS[kind];
                    return (
                      <div key={kind} className="product-delivery-option readonly">
                        <span className="product-delivery-text">
                          <span className="product-delivery-day">{opt.day}</span>
                          <span className="product-delivery-meta">
                            MOV: <strong>₹{opt.mov.toLocaleString('en-IN')}</strong>
                          </span>
                        </span>
                      </div>
                    );
                  })}
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

      {cartTotal > 0 && (
        <div className="cart-strip">
          <div className="cart-strip-info">
            <div className="cart-strip-label">Total cart value</div>
            <div className="cart-strip-value">₹{cartTotal.toLocaleString('en-IN')}</div>
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
