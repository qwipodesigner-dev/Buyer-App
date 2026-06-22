import { useState, useMemo } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import { distributorsList, distributorCategories } from '../data/mockData';

// Drill-in for "tap a brand from Distributors → Sellers tab". Layout matches
// the buyer-app reference: title "Brand - Distributor", breadcrumb, then a
// Brands grid (round logo + name) and a Categories grid (image card + name)
// — both clickable and routing into the ProductListing. Inline search filters
// both grids at once.

// Brand → relevant category ids. Maps each brand id to the categories its
// parent company actually sells in, so the drill-in feels curated to that
// brand family instead of dumping every category on the user.
const BRAND_CATEGORIES: Record<string, string[]> = {
  // Edible oils
  freedom:        ['oil-ghee', 'cooking-baking', 'foodgrains'],
  fortune:        ['oil-ghee', 'cooking-baking', 'foodgrains'],
  'gold-drop':    ['oil-ghee', 'cooking-baking'],
  'gold-fresh':   ['oil-ghee', 'cooking-baking'],
  'ruchi-gold':   ['oil-ghee', 'cooking-baking'],
  ruchi:          ['oil-ghee', 'cooking-baking'],
  'double-horse': ['oil-ghee', 'masala-seasoning'],
  'deer-brand':   ['oil-ghee', 'cooking-baking'],
  sneha:          ['oil-ghee', 'cooking-baking'],
  gokul:          ['oil-ghee', 'cooking-baking'],
  'rajini-gold':  ['oil-ghee', 'cooking-baking'],
  srinivas:       ['oil-ghee', 'cooking-baking'],
  // Atta & rice
  aashirvaad:     ['atta-flours-sooji', 'rice-rice-products', 'salt-sugar-jaggery'],
  'lal-kila':     ['rice-rice-products', 'foodgrains'],
  // Spices, ready-to-cook & sweets
  mtr:            ['masala-seasoning', 'ready-cook-eat', 'pickles-chutney', 'indian-sweets'],
  eastern:        ['masala-seasoning', 'ready-cook-eat', 'pickles-chutney'],
  'priya-foods':  ['pickles-chutney', 'masala-seasoning', 'sauces-spreads-dips'],
  'sri-lalitha':  ['pickles-chutney', 'masala-seasoning'],
  parrys:         ['salt-sugar-jaggery', 'cooking-baking'],
  madhur:         ['salt-sugar-jaggery'],
  tata:           ['salt-sugar-jaggery', 'beverages', 'masala-seasoning'],
  'gd-hing':      ['masala-seasoning', 'pickles-chutney'],
  mahateja:       ['masala-seasoning'],
  // Snacks / packaged
  maggi:          ['pasta-soup-noodles', 'snacks-namkeen'],
  'parle-g':      ['chocolates-biscuits', 'snacks-namkeen'],
  // Personal care, beauty, ayurvedic
  'mysore-sandal': ['beauty-hygiene', 'oral-care'],
  vicco:           ['oral-care', 'beauty-hygiene'],
  'black-rose':    ['beauty-hygiene'],
  dwibhashi:       ['ayurvedic', 'beauty-hygiene'],
  himalaya:        ['ayurvedic', 'beauty-hygiene', 'baby-care'],
  cow:             ['pooja-needs', 'ayurvedic'],
  naturralle:      ['ayurvedic', 'beauty-hygiene'],
  'nature-guru':   ['ayurvedic', 'beauty-hygiene'],
  zindha:          ['ayurvedic', 'oral-care'],
  zuri:            ['beauty-hygiene'],
  vijaya:          ['pooja-needs', 'ayurvedic'],
  // Pooja, agarbathi, batteries
  'ajay-care':     ['pooja-needs'],
  cycle:           ['pooja-needs'],
  grb:             ['indian-sweets', 'snacks-namkeen'],
  'priya-gold':    ['chocolates-biscuits', 'snacks-namkeen'],
  nippo:           ['kitchen-accessories'],
  festival:        ['pooja-needs'],
  netaji:          ['pooja-needs'],
  roxy:            ['oil-ghee', 'masala-seasoning'],
  gajraj:          ['pooja-needs'],
  karani:          ['pooja-needs', 'masala-seasoning'],
  'malai-magic':   ['dairy-cheese', 'cooking-baking'],
  'my-choice':     ['snacks-namkeen', 'beverages'],
  kurnool:         ['rice-rice-products', 'dals-pulses'],
  'sri-krishna':   ['rice-rice-products', 'foodgrains'],
  'sri-rk':        ['rice-rice-products', 'foodgrains'],
  prime:           ['oil-ghee', 'masala-seasoning'],
  mv:              ['masala-seasoning'],
  mvr:             ['masala-seasoning'],
  'ondc-staples':  ['foodgrains', 'rice-rice-products', 'dals-pulses'],
  'as-brand':      ['ayurvedic'],
  sjl:             ['ayurvedic'],
  sms:             ['ayurvedic', 'beauty-hygiene'],
  ssi:             ['ayurvedic'],
};

// Categories shown when we don't have a curated mapping for the brand.
const DEFAULT_CATEGORIES = [
  'oil-ghee',
  'rice-rice-products',
  'atta-flours-sooji',
  'dals-pulses',
  'masala-seasoning',
  'snacks-namkeen',
];

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

  // Pull the seller's actual brand portfolio (the distributor we came from
  // carries these). Falls back to the cumulative union if we can't match.
  const sellerBrands = useMemo(() => {
    const match = distributorsList.find(
      (d: any) => d.name.toLowerCase() === (dist.name || '').toLowerCase()
    );
    if (match) return match.brands;
    // Fallback: cumulative pool de-duplicated by id
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
  }, [dist.name]);

  // Curated categories for the tapped brand.
  const relevantCatIds = BRAND_CATEGORIES[cat.id] || DEFAULT_CATEGORIES;
  const relevantCats = distributorCategories.filter((c: any) =>
    relevantCatIds.includes(c.id)
  );

  const visibleBrands = q
    ? sellerBrands.filter((b: any) =>
        (b.short || b.name || '').toLowerCase().includes(q)
      )
    : sellerBrands;

  const visibleCats = q
    ? relevantCats.filter((c: any) =>
        c.name.toLowerCase().includes(q)
      )
    : relevantCats;

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
