import { useState, useEffect, useRef } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import { products } from '../data/mockData';

// Empty-until-typing pattern: keep the screen quiet on open. Retailers who tap by mistake
// shouldn't see a wall of "recommended" products; only intentional queries return results.

export default function GlobalSearchScreen({ onBack, onSelectProduct }: any) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'distributors' | 'wholesalers'>('distributors');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const q = query.trim().toLowerCase();
  const matched = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.manufacturer.toLowerCase().includes(q)
      )
    : [];

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        {/* Search top bar */}
        <div className="search-top-bar">
          <button className="icon-btn" onClick={onBack} aria-label="Back">
            <Icon.Back />
          </button>
          <div className="search-top-input">
            <Icon.Search />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, brands, SKUs…"
            />
            {query && (
              <button
                className="search-clear"
                onClick={() => setQuery('')}
                aria-label="Clear"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tabs are only meaningful once there are results */}
        {q && (
          <div className="gs-tabs">
            <button
              className={`gs-tab ${tab === 'distributors' ? 'on' : ''}`}
              onClick={() => setTab('distributors')}
            >
              Distributors
              <span className="gs-tab-count">{matched.length}</span>
            </button>
            <button
              className={`gs-tab ${tab === 'wholesalers' ? 'on' : ''}`}
              onClick={() => setTab('wholesalers')}
            >
              Wholesalers
              <span className="gs-tab-count">{matched.length}</span>
            </button>
          </div>
        )}

        {/* Quiet hint when no query yet */}
        {!q && (
          <div className="gs-hint">
            <div className="gs-hint-emoji">🔎</div>
            <div className="gs-hint-title">Search Qwipo</div>
            <div className="gs-hint-sub">
              Type a product name, brand, or SKU to find what you need.
            </div>
            <div className="gs-suggest-row">
              {['Aashirvaad', 'Surf Excel', 'Maggi', 'Tata Salt'].map((s) => (
                <button
                  key={s}
                  className="gs-suggest"
                  onClick={() => setQuery(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results — only after typing */}
        {q && (
          <div className="gs-results">
            {matched.map((p) => (
              <button
                key={p.id}
                className="gs-result"
                onClick={() => onSelectProduct?.(p)}
              >
                <div className="gs-result-img" style={{ background: p.bgColor }}>
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} />
                  ) : (
                    <span>{p.image}</span>
                  )}
                </div>
                <div className="gs-result-info">
                  <div className="gs-result-brand">{p.brand}</div>
                  <div className="gs-result-name">{p.name}</div>
                  <div className="gs-result-meta">
                    {p.variants.length} pack sizes ·{' '}
                    {tab === 'distributors'
                      ? 'Sri Sai Krishna Traders'
                      : 'Multi-seller'}
                  </div>
                </div>
                <div className="gs-result-price">
                  <div className="gs-result-current">
                    ₹{p.variants[0].sellingPrice}
                  </div>
                  <div className="gs-result-mrp">₹{p.variants[0].mrp}</div>
                </div>
              </button>
            ))}

            {matched.length === 0 && (
              <div className="gs-empty">
                <div className="gs-empty-emoji">🤷</div>
                <div className="gs-empty-title">
                  No results for "{query}"
                </div>
                <div className="gs-empty-sub">
                  Try a different brand or product name.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
