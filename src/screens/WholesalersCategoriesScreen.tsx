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

        <div className="wc-grid">
          {cats.map((c: any) => (
            <button
              key={c.id}
              className="wc-tile"
              onClick={() => onSelectCategory?.(c)}
            >
              <div className="wc-img" style={{ background: c.bg }}>
                <span className="wc-emoji">{c.emoji}</span>
              </div>
              <div className="wc-name">{c.name}</div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
