import { Icon, StatusBar } from '../components/Icons';
import { distributorsList, distributors } from '../data/mockData';

export default function DistributorsListScreen({
  onBack,
  onSelectBrand,
  onSelectDistributor,
}: any) {
  // Find the full Distributor record (mov, location, skuCount) by name match so
  // tapping the header row opens the right storefront with rich seller data.
  const findDistributor = (name: string) =>
    distributors.find((d) => d.name.toLowerCase() === name.toLowerCase());

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        <div className="top-bar">
          <button className="icon-btn" onClick={onBack}>
            <Icon.Back />
          </button>
          <div className="top-title">
            <h1>Authorised Distributors</h1>
          </div>
          <button className="icon-btn">
            <Icon.Search />
          </button>
        </div>

        <div className="dl-body">
          {distributorsList.map((d: any) => {
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
                {/* Distributor name row with right-side arrow → Storefront */}
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
                  {d.brands.map((b: any) => (
                    <button
                      key={b.id}
                      className="dl-brand-tile"
                      onClick={() => onSelectBrand?.(b, fullDistributor)}
                    >
                      <div className="dl-brand-circle" style={{ background: b.bg }}>
                        <span>{b.initials}</span>
                      </div>
                      <div className="dl-brand-name">{b.short || b.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
