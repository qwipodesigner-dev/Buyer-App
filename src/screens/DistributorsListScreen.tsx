import { useMemo, useState } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import {
  distributorsList,
  distributors,
  distributorCategories,
} from '../data/mockData';

// Up to this many brands are shown in the collapsed state on each seller card;
// beyond this the "View More" link appears. Distributors with ≤ COLLAPSED_LIMIT
// brands show everything and no toggle.
const COLLAPSED_LIMIT = 8;

type TabKey = 'categories' | 'brands' | 'sellers';

export default function DistributorsListScreen({
  onBack,
  onSelectBrand,
  onSelectDistributor,
  onSelectCategory,
}: any) {
  const [tab, setTab] = useState<TabKey>('categories');
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  // Only ONE distributor card can be expanded at a time — opening another
  // automatically collapses the previous one.
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const toggle = (id: string) => setExpandedId((curr) => (curr === id ? null : id));

  // Find the full Distributor record (mov, location, skuCount) by name match so
  // tapping the header row opens the right storefront with rich seller data.
  const findDistributor = (name: string) =>
    distributors.find((d) => d.name.toLowerCase() === name.toLowerCase());

  // Union of every brand across every distributor in this list, de-duplicated
  // by id. Drives the Brands tab so taps land on the cumulative brand pool.
  const allBrands = useMemo(() => {
    const seen = new Set<string>();
    const out: any[] = [];
    distributorsList.forEach((d: any) => {
      d.brands.forEach((b: any) => {
        if (seen.has(b.id)) return;
        seen.add(b.id);
        out.push(b);
      });
    });
    return out;
  }, []);

  // Page-level search filters whichever tab is active.
  const filteredCategories = q
    ? distributorCategories.filter((c: any) => c.name.toLowerCase().includes(q))
    : distributorCategories;
  const filteredBrands = q
    ? allBrands.filter((b: any) => (b.short || b.name || '').toLowerCase().includes(q))
    : allBrands;
  const filteredSellers = q
    ? distributorsList.filter((d: any) =>
        d.name.toLowerCase().includes(q) ||
        d.brands.some((b: any) => (b.short || b.name || '').toLowerCase().includes(q))
      )
    : distributorsList;

  const placeholderByTab: Record<TabKey, string> = {
    categories: 'Search categories',
    brands: 'Search brands',
    sellers: 'Search sellers or brands',
  };

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        {/* Sticky cluster: header + tabs + page-level search stay pinned. */}
        <div className="dl-sticky-top">
          <div className="top-bar">
            <button className="icon-btn" onClick={onBack}>
              <Icon.Back />
            </button>
            <div className="top-title">
              <h1>Authorised Distributors</h1>
            </div>
          </div>

          {/* Three-tab segmented control */}
          <div className="toggle-tabs">
            {(['categories', 'brands', 'sellers'] as TabKey[]).map((key) => (
              <button
                key={key}
                className={`toggle-tab ${tab === key ? 'active' : ''}`}
                onClick={() => setTab(key)}
              >
                {key === 'categories' ? 'Categories' : key === 'brands' ? 'Brands' : 'Sellers'}
              </button>
            ))}
          </div>

          {/* Page-level search — filters whichever tab is active. */}
          <div className="dl-search">
            <span className="dl-search-icon"><Icon.Search /></span>
            <input
              className="dl-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholderByTab[tab]}
            />
          </div>
        </div>

        {tab === 'sellers' && (
          <div className="dl-body">
            {filteredSellers.length === 0 && (
              <div className="dl-empty">No sellers match "{query}".</div>
            )}
            {filteredSellers.map((d: any) => {
              const fullDistributor = findDistributor(d.name) || {
                id: d.id,
                name: d.name,
                shortName: d.name,
                location: '—',
                mov: 5000,
                skuCount: 1000,
                featuredBrand: d.brands[0]?.short || d.brands[0]?.name || '',
                featuredBrandTitle: d.brands[0]?.short || d.brands[0]?.name || '',
                featuredColor: '#FEF3C7',
                isAuthorised: true,
              };
              return (
                <div key={d.id} className="dl-card">
                  <button
                    className="dl-card-head"
                    onClick={() => onSelectDistributor?.(fullDistributor)}
                    aria-label={`Open ${d.name} storefront`}
                  >
                    <span className="dl-card-title">{d.name}</span>
                    <span className="dl-card-arrow">
                      <Icon.ChevronRight />
                    </span>
                  </button>

                  <div className="dl-brand-grid">
                    {(expandedId === d.id ? d.brands : d.brands.slice(0, COLLAPSED_LIMIT)).map((b: any) => (
                      <button
                        key={b.id}
                        className="dl-brand-tile"
                        onClick={() => onSelectBrand?.(b, fullDistributor)}
                      >
                        <div className="dl-brand-circle" style={{ background: b.logo ? '#ffffff' : b.bg }}>
                          {b.logo ? (
                            <img
                              src={b.logo}
                              alt={b.short || b.name}
                              onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                img.style.display = 'none';
                                const parent = img.parentElement!;
                                parent.style.background = b.bg;
                                parent.innerHTML = `<span>${b.initials}</span>`;
                              }}
                            />
                          ) : (
                            <span>{b.initials}</span>
                          )}
                        </div>
                        <div className="dl-brand-name">{b.short || b.name}</div>
                      </button>
                    ))}
                  </div>

                  {d.brands.length > COLLAPSED_LIMIT && (
                    <button
                      className="dl-view-toggle"
                      onClick={() => toggle(d.id)}
                      aria-expanded={expandedId === d.id}
                    >
                      {expandedId === d.id ? '− View Less' : '+ View More'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === 'categories' && (
          <div className="dl-body dl-tabpane-grid">
            {filteredCategories.length === 0 ? (
              <div className="dl-empty">No categories match "{query}".</div>
            ) : (
              filteredCategories.map((c: any) => (
                <button
                  key={c.id}
                  className="cat-tile cat-tile-grid"
                  onClick={() => onSelectCategory?.(c)}
                >
                  <div className="cat-tile-card">
                    <img src={c.image} alt={c.name} />
                  </div>
                  <div className="cat-tile-name">{c.name}</div>
                </button>
              ))
            )}
          </div>
        )}

        {tab === 'brands' && (
          <div className="dl-body dl-brand-grid dl-brand-grid-all">
            {filteredBrands.length === 0 ? (
              <div className="dl-empty">No brands match "{query}".</div>
            ) : (
              filteredBrands.map((b: any) => (
                <button
                  key={b.id}
                  className="dl-brand-tile"
                  onClick={() => onSelectBrand?.(b)}
                >
                  <div className="dl-brand-circle" style={{ background: b.logo ? '#ffffff' : b.bg }}>
                    {b.logo ? (
                      <img
                        src={b.logo}
                        alt={b.short || b.name}
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          img.style.display = 'none';
                          const parent = img.parentElement!;
                          parent.style.background = b.bg;
                          parent.innerHTML = `<span>${b.initials}</span>`;
                        }}
                      />
                    ) : (
                      <span>{b.initials}</span>
                    )}
                  </div>
                  <div className="dl-brand-name">{b.short || b.name}</div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
