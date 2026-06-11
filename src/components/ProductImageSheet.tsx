import { useState, useRef, useEffect } from 'react';
import { Icon } from './Icons';
import { SheetHeader, useSheetSwipe } from './SheetBase';

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export default function ProductImageSheet({ product, onClose, onAddClick }: any) {
  const { dragHandlers, sheetStyle } = useSheetSwipe(onClose);
  const [activeIdx, setActiveIdx] = useState(0);
  const railRef = useRef(null);

  const images = product.images || [];
  const hasImages = images.length > 0;

  // Auto-scroll thumbnail rail when active index changes
  useEffect(() => {
    const el = railRef.current?.children?.[activeIdx];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIdx]);

  const startPrice = product.variants[0]?.sellingPrice;
  const startMrp = product.variants[0]?.mrp;
  const savings = startMrp - startPrice;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet"
        style={{ ...sheetStyle, maxHeight: '92%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <SheetHeader
          icon={<ImageIcon />}
          title={product.name}
          subtitle={`${product.brand} · ${product.variants.length} pack sizes`}
          onClose={onClose}
          dragHandlers={dragHandlers}
        />

        <div className="sheet-body" style={{ padding: 0 }}>
          {/* Main image carousel */}
          <div
            style={{
              width: '100%',
              aspectRatio: '1',
              background: product.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {hasImages ? (
              <img
                src={images[activeIdx]}
                alt={product.name}
                style={{
                  width: '90%',
                  height: '90%',
                  objectFit: 'contain',
                  transition: 'opacity 0.2s',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement.dataset.fallback = '1';
                }}
              />
            ) : (
              <div style={{ fontSize: 120 }}>{product.image}</div>
            )}

            {/* Image counter */}
            {hasImages && images.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  background: 'rgba(17,24,39,0.7)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 999,
                }}
              >
                {activeIdx + 1} / {images.length}
              </div>
            )}

            {/* Brand chip on image */}
            <div
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                background: 'rgba(255,255,255,0.95)',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 10,
                fontWeight: 700,
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {product.brand}
            </div>
          </div>

          {/* Thumbnail rail */}
          {hasImages && images.length > 1 && (
            <div
              ref={railRef}
              style={{
                display: 'flex',
                gap: 8,
                padding: '12px 20px',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                background: '#fff',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  style={{
                    flexShrink: 0,
                    width: 60,
                    height: 60,
                    borderRadius: 10,
                    border: activeIdx === idx ? '2px solid #2563eb' : '1.5px solid #e5e7eb',
                    background: product.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 4,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <img
                    src={img}
                    alt={`thumb-${idx}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => (e.currentTarget.style.opacity = '0.3')}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Product details */}
          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              <span className="product-meta-pill">{product.manufacturer}</span>
              <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>
                HSN {product.hsn} · GST {product.gst}%
              </span>
            </div>

            {/* Price banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)',
                border: '1px solid #a7f3d0',
                borderRadius: 12,
                padding: '10px 14px',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: '#065f46', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Starting from
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>₹{startPrice}</span>
                  <span style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through', fontWeight: 500 }}>
                    ₹{startMrp}
                  </span>
                </div>
              </div>
              <div
                style={{
                  background: '#10b981',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: 6,
                }}
              >
                Save ₹{savings}
              </div>
            </div>

            {/* Specs grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                marginBottom: 16,
              }}
            >
              <SpecCell label="Manufacturer" value={product.manufacturer} />
              <SpecCell label="Country" value={product.countryOfOrigin} />
              <SpecCell label="HSN Code" value={product.hsn} />
              <SpecCell label="GST" value={`${product.gst}%`} />
              <SpecCell label="Variants" value={`${product.variants.length} sizes`} />
              <SpecCell label="Category" value={product.category.replace('-', ' ')} />
            </div>

            {/* Available pack sizes */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                Available Pack Sizes
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {product.variants.map((v) => (
                  <div
                    key={v.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: '#f9fafb',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, color: '#111827' }}>{v.size}</span>
                      <span style={{ color: '#6b7280', marginLeft: 6 }}>· {v.casePack}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, color: '#111827' }}>₹{v.sellingPrice}</span>
                      <span style={{ fontSize: 10, color: '#059669', fontWeight: 700 }}>
                        {v.margin}% margin
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="sheet-footer">
          <div className="sheet-footer-info">
            <div className="sheet-footer-label">Starting at</div>
            <div className="sheet-footer-value">₹{startPrice}/pc</div>
          </div>
          <button className="sheet-continue" onClick={() => onAddClick(product)}>
            Add to Cart →
          </button>
        </div>
      </div>
    </div>
  );
}

function SpecCell({ label, value }: any) {
  return (
    <div
      style={{
        background: '#f9fafb',
        padding: '8px 10px',
        borderRadius: 8,
        border: '1px solid #f3f4f6',
      }}
    >
      <div style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginTop: 2, textTransform: 'capitalize' }}>
        {value}
      </div>
    </div>
  );
}
