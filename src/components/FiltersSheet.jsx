import { useState } from 'react';
import { Icon } from './Icons';
import { SheetHeader, useSheetSwipe } from './SheetBase';
import { brands as allBrands } from '../data/mockData';

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="17" x2="20" y2="17" />
    <circle cx="9" cy="7" r="2.5" fill="currentColor" stroke="none" />
    <circle cx="15" cy="17" r="2.5" fill="currentColor" stroke="none" />
  </svg>
);

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended', sub: 'Most relevant first' },
  { id: 'price_asc', label: 'Price: Low to High', sub: 'Cheapest first' },
  { id: 'price_desc', label: 'Price: High to Low', sub: 'Premium first' },
  { id: 'margin_desc', label: 'Margin: High to Low', sub: 'Best profit first' },
];

const STOCK_OPTIONS = [
  { id: 'available', label: 'In Stock', dotColor: '#10b981' },
  { id: 'limited', label: 'Limited', dotColor: '#f59e0b' },
  { id: 'out', label: 'Out of Stock', dotColor: '#ef4444' },
];

const MARGIN_OPTIONS = [
  { value: 0, label: 'Any' },
  { value: 12, label: '12% +' },
  { value: 14, label: '14% +' },
  { value: 16, label: '16% +' },
];

export default function FiltersSheet({ initialFilters, onClose, onApply }) {
  const { dragHandlers, sheetStyle } = useSheetSwipe(onClose);
  const [filters, setFilters] = useState(initialFilters);

  const toggleInArray = (key, value) => {
    setFilters((f) => {
      const arr = f[key];
      const exists = arr.includes(value);
      return { ...f, [key]: exists ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  const setSort = (value) => setFilters((f) => ({ ...f, sort: value }));
  const setMinMargin = (value) => setFilters((f) => ({ ...f, minMargin: value }));
  const toggleSchemes = () =>
    setFilters((f) => ({ ...f, schemesOnly: !f.schemesOnly }));

  const reset = () =>
    setFilters({
      sort: 'recommended',
      stock: [],
      brands: [],
      minMargin: 0,
      schemesOnly: false,
    });

  const apply = () => {
    onApply(filters);
    onClose();
  };

  const countActive = () => {
    let n = 0;
    if (filters.sort !== 'recommended') n += 1;
    if (filters.stock.length) n += 1;
    if (filters.brands.length) n += 1;
    if (filters.minMargin > 0) n += 1;
    if (filters.schemesOnly) n += 1;
    return n;
  };

  const activeCount = countActive();

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet"
        style={{ ...sheetStyle, maxHeight: '92%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <SheetHeader
          icon={<FilterIcon />}
          title="Filters"
          subtitle={activeCount > 0 ? `${activeCount} active` : 'Refine your product view'}
          onClose={onClose}
          dragHandlers={dragHandlers}
        />

        <div className="sheet-body" style={{ padding: '16px 20px 96px' }}>
          {/* Sort */}
          <div className="filter-block">
            <div className="filter-block-title">Sort by</div>
            <div className="filter-radio-list">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  className={`filter-radio ${filters.sort === s.id ? 'on' : ''}`}
                  onClick={() => setSort(s.id)}
                >
                  <span className="filter-radio-dot"></span>
                  <span className="filter-radio-text">
                    <span className="filter-radio-label">{s.label}</span>
                    <span className="filter-radio-sub">{s.sub}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div className="filter-block">
            <div className="filter-block-title">Availability</div>
            <div className="filter-chip-grid">
              {STOCK_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  className={`filter-pill-chip ${filters.stock.includes(s.id) ? 'on' : ''}`}
                  onClick={() => toggleInArray('stock', s.id)}
                >
                  <span
                    className="stock-dot"
                    style={{ background: s.dotColor }}
                  ></span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Min Margin */}
          <div className="filter-block">
            <div className="filter-block-title">Minimum margin</div>
            <div className="filter-chip-grid">
              {MARGIN_OPTIONS.map((m) => (
                <button
                  key={m.value}
                  className={`filter-pill-chip ${filters.minMargin === m.value ? 'on' : ''}`}
                  onClick={() => setMinMargin(m.value)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="filter-block">
            <div className="filter-block-title">
              Brand{' '}
              {filters.brands.length > 0 && (
                <span className="filter-block-count">· {filters.brands.length}</span>
              )}
            </div>
            <div className="filter-chip-grid">
              {allBrands.map((b) => (
                <button
                  key={b.id}
                  className={`filter-pill-chip ${filters.brands.includes(b.name) ? 'on' : ''}`}
                  onClick={() => toggleInArray('brands', b.name)}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Schemes only */}
          <div className="filter-block">
            <div className="filter-block-title">Schemes</div>
            <button
              className={`filter-toggle-row ${filters.schemesOnly ? 'on' : ''}`}
              onClick={toggleSchemes}
            >
              <div className="filter-toggle-text">
                <span className="filter-radio-label">Show only items with schemes</span>
                <span className="filter-radio-sub">Buy 1 Get 1, flat off, %-discount, etc.</span>
              </div>
              <span className={`toggle-switch ${filters.schemesOnly ? 'on' : ''}`}>
                <span className="toggle-knob"></span>
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="filter-footer">
          <button className="filter-reset-btn" onClick={reset}>
            Reset
          </button>
          <button className="filter-apply-btn" onClick={apply}>
            Apply{activeCount > 0 ? ` (${activeCount})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
