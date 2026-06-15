import { Icon, StatusBar } from '../components/Icons';
import { wholesalersGroceries, wholesalersFMCG } from '../data/mockData';

export default function WholesalersCategoriesScreen({
  variant,
  onBack,
  onSelectCategory,
}: any) {
  const isGroceries = variant === 'groceries';
  const cats = isGroceries ? wholesalersGroceries : wholesalersFMCG;
  const title = isGroceries ? 'Groceries' : 'FMCG';

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        <div className="top-bar">
          <button className="icon-btn" onClick={onBack}>
            <Icon.Back />
          </button>
          <div className="top-title">
            <h1>{title}</h1>
          </div>
          <button className="icon-btn">
            <Icon.Search />
          </button>
        </div>

        <div className="cat-grid">
          {cats.map((c: any) => (
            <button
              key={c.id}
              className="cat-card cat-card-grid"
              onClick={() => onSelectCategory?.(c)}
            >
              <div className="cat-card-img" style={{ background: c.bg }}>
                {c.image ? (
                  <img
                    src={c.image}
                    alt={c.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                      const parent = (e.currentTarget as HTMLImageElement).parentElement!;
                      parent.innerHTML = `<span class="cat-card-fallback">${c.emoji}</span>`;
                    }}
                  />
                ) : (
                  <span className="cat-card-fallback">{c.emoji}</span>
                )}
              </div>
              <div className="cat-card-body">
                <div className="cat-card-name">{c.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
