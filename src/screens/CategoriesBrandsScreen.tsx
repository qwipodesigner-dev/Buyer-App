import { useState, useMemo } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import { distributorsList, distributorCategories } from '../data/mockData';

// Drill-in for "tap a brand from Distributors → Sellers tab". Layout matches
// the buyer-app reference: title "Brand - Distributor", breadcrumb, then a
// Brands grid (round logo + name) and a Categories grid (image card + name)
// — both clickable and routing into the ProductListing. Inline search filters
// both grids at once.

export default function CategoriesBrandsScreen({
  distributor,
  category,
  onBack,
  onSelectBrand,
  onSelectCategory,
}: any) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const cat = category || { name: 'Brand' };
  const dist = distributor || { name: 'Distributor', shortName: 'Distributor' };

  // Source the brand pool from distributorsList — pool every brand that the
  // 3 listed distributors carry so the grid feels populated even when the
  // selected distributor isn't in distributorsList.
  const allBrands = useMemo(() => {
    const seen = new Set<string>();
    const out: any[] = [];
    distributorsList.forEach((d: any) =>
      d.brands.forEach((b: any) => {
        if (seen.has(b.id)) return;
        seen.add(b.id);
        out.push(b);
      })
    );
    return out;
  }, []);

  const visibleBrands = q
    ? allBrands.filter((b: any) =>
        (b.short || b.name || '').toLowerCase().includes(q)
      )
    : allBrands;

  const visibleCats = q
    ? distributorCategories.filter((c: any) =>
        c.name.toLowerCase().includes(q)
      )
    : distributorCategories;

  const distShort = (dist.shortName || dist.name || '').replace(/[…\.]+$/g, '');

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        {/* Sticky cluster: top-bar + breadcrumb + page-level search input. */}
        <div className="dl-sticky-top">
          <div className="top-bar">
            <button className="icon-btn" onClick={onBack} aria-label="Back">
              <Icon.Back />
            </button>
            <div className="top-title">
              <h1>{cat.name} - {dist.shortName || dist.name}</h1>
            </div>
          </div>

          <div className="breadcrumb">
            <button className="crumb" onClick={onBack}>Distributors</button>
            <span className="crumb-sep">›</span>
            <button className="crumb" onClick={onBack}>{distShort}</button>
            <span className="crumb-sep">›</span>
            <span className="crumb last">{cat.name}</span>
          </div>

          <div className="dl-search">
            <span className="dl-search-icon"><Icon.Search /></span>
            <input
              className="dl-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brands or categories"
            />
          </div>
        </div>

        {/* Brands grid — 4-col round logo + name, same look as home Top Brands. */}
        <div className="section">
          <div className="section-head">
            <div className="section-title">Brands</div>
          </div>
          {visibleBrands.length === 0 ? (
            <div className="dl-empty">No brands match "{query}".</div>
          ) : (
            <div className="cb-brands-grid">
              {visibleBrands.map((b: any) => (
                <button
                  key={b.id}
                  className="cb-brands-tile"
                  onClick={() =>
                    onSelectBrand?.({
                      id: b.id,
                      name: b.short || b.name,
                      short: b.short,
                    })
                  }
                >
                  <div
                    className="cb-brands-circle"
                    style={{ background: b.logo ? '#ffffff' : b.bg }}
                  >
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
                  <div className="cb-brands-name">{b.short || b.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Categories grid — 2-col image card + name. */}
        <div className="section" style={{ paddingBottom: 30 }}>
          <div className="section-head">
            <div className="section-title">Categories</div>
          </div>
          {visibleCats.length === 0 ? (
            <div className="dl-empty">No categories match "{query}".</div>
          ) : (
            <div className="wholesale-categories">
              {visibleCats.map((c: any) => (
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
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
