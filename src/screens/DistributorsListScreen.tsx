import { Icon, StatusBar } from '../components/Icons';
import { distributorsList } from '../data/mockData';

export default function DistributorsListScreen({ onBack, onSelectBrand }: any) {
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
          {distributorsList.map((d) => (
            <div key={d.id} className="dl-card">
              <div className="dl-card-title">{d.name}</div>
              <div className="dl-brand-grid">
                {d.brands.map((b) => (
                  <button
                    key={b.id}
                    className="dl-brand-tile"
                    onClick={() => onSelectBrand?.(b)}
                  >
                    <div className="dl-brand-circle" style={{ background: b.bg }}>
                      <span>{b.initials}</span>
                    </div>
                    <div className="dl-brand-name">{b.name}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
