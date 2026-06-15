import { Icon, StatusBar } from '../components/Icons';
import { brands } from '../data/mockData';

export default function AllBrandsScreen({ onBack, onSelectBrand }: any) {
  return (
    <>
      <StatusBar />
      <div className="screen-body">
        <div className="top-bar">
          <button className="icon-btn" onClick={onBack}>
            <Icon.Back />
          </button>
          <div className="top-title">
            <h1>All brands</h1>
            <p>{brands.length} brands available</p>
          </div>
          <button className="icon-btn">
            <Icon.Search />
          </button>
        </div>

        <div className="ab-body">
          <div className="ab-grid">
            {brands.map((b: any) => (
              <button
                key={b.id}
                className="ab-tile"
                onClick={() => onSelectBrand?.(b)}
              >
                <div
                  className="ab-circle"
                  style={{ background: b.logo ? '#ffffff' : b.color }}
                >
                  {b.logo ? (
                    <img
                      src={b.logo}
                      alt={b.name}
                      onError={(e: any) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.textContent = b.logoText;
                        e.currentTarget.parentElement.style.color = '#ffffff';
                        e.currentTarget.parentElement.style.background = b.color;
                      }}
                    />
                  ) : (
                    b.logoText
                  )}
                </div>
                <div className="ab-name">{b.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
