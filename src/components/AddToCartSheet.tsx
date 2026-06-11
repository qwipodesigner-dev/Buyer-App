import { useState } from 'react';
import { Icon } from './Icons';
import { SheetHeader, useSheetSwipe } from './SheetBase';

const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
  </svg>
);

export default function AddToCartSheet({ product, initialVariant, onClose, onConfirm }: any) {
  const { dragHandlers, sheetStyle } = useSheetSwipe(onClose);
  const [variantId, setVariantId] = useState(initialVariant?.id || product.variants[0].id);
  const [packQuantities, setPackQuantities] = useState({ pc: 0, set: 0, case: 0 });

  const variant = product.variants.find((v) => v.id === variantId);

  const totalPcs =
    packQuantities.pc +
    packQuantities.set * Math.floor(variant.casePcs / 2 || 1) +
    packQuantities.case * variant.casePcs;

  const totalValue =
    packQuantities.pc * variant.sellingPrice +
    packQuantities.set * variant.sellingPrice * Math.floor(variant.casePcs / 2 || 1) +
    packQuantities.case * variant.casePrice;

  const updateQty = (key, delta) => {
    setPackQuantities((p) => ({
      ...p,
      [key]: Math.max(0, p[key] + delta),
    }));
  };

  const handleConfirm = () => {
    if (totalPcs === 0) return;
    onConfirm(product, variant, totalPcs);
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" style={sheetStyle} onClick={(e) => e.stopPropagation()}>
        <SheetHeader
          icon={<CartIcon />}
          title="Add to Cart"
          subtitle="Choose pack size and quantity"
          onClose={onClose}
          dragHandlers={dragHandlers}
        />

        <div className="sheet-body">
          {/* Product info */}
          <div className="sheet-product">
            <div className="sheet-product-img" style={{ background: product.bgColor }}>
              {product.image}
            </div>
            <div className="sheet-product-info">
              <div className="sheet-product-name">{product.name}</div>
              <div className="variant-pills" style={{ marginTop: '8px' }}>
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    className={`variant-pill ${v.id === variantId ? 'active' : ''}`}
                    onClick={() => setVariantId(v.id)}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pack options */}
          <div className="sheet-pack-options">
            <div className={`pack-option ${packQuantities.pc > 0 ? 'selected' : ''}`}>
              <div className="pack-icon">📦</div>
              <div className="pack-info">
                <div className="pack-label">Per Piece</div>
                <div className="pack-detail">
                  1 Pc · <strong>₹{variant.sellingPrice}</strong>
                </div>
              </div>
              {packQuantities.pc > 0 ? (
                <div className="pack-mini-qty">
                  <button onClick={() => updateQty('pc', -1)}>
                    <Icon.Minus />
                  </button>
                  <span>{packQuantities.pc}</span>
                  <button onClick={() => updateQty('pc', 1)}>
                    <Icon.Plus />
                  </button>
                </div>
              ) : (
                <button className="pack-add-btn" onClick={() => updateQty('pc', 1)}>
                  <Icon.Plus /> Add
                </button>
              )}
            </div>

            {variant.casePcs > 1 && (
              <div className={`pack-option ${packQuantities.case > 0 ? 'selected' : ''}`}>
                <div className="pack-icon">📦</div>
                <div className="pack-info">
                  <div className="pack-label">Full Case</div>
                  <div className="pack-detail">
                    {variant.casePcs} Pcs · <strong>₹{variant.casePrice.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
                {packQuantities.case > 0 ? (
                  <div className="pack-mini-qty">
                    <button onClick={() => updateQty('case', -1)}>
                      <Icon.Minus />
                    </button>
                    <span>{packQuantities.case}</span>
                    <button onClick={() => updateQty('case', 1)}>
                      <Icon.Plus />
                    </button>
                  </div>
                ) : (
                  <button className="pack-add-btn" onClick={() => updateQty('case', 1)}>
                    <Icon.Plus /> Add
                  </button>
                )}
              </div>
            )}

            {variant.scheme && (
              <div className="scheme-banner" style={{ marginTop: '4px' }}>
                <span className="scheme-icon">
                  <Icon.Gift />
                </span>
                {variant.scheme} — auto-applied at cart
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sheet-footer">
          <div className="sheet-footer-info">
            <div className="sheet-footer-label">{totalPcs} Pcs total</div>
            <div className="sheet-footer-value">₹{totalValue.toLocaleString('en-IN')}</div>
          </div>
          <button className="sheet-continue" disabled={totalPcs === 0} onClick={handleConfirm}>
            Add to Cart →
          </button>
        </div>
      </div>
    </div>
  );
}
