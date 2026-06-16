import { Icon } from './Icons';

// Center search FAB is the most-used action — kept large and elevated above the bar
// so retailers who scan icons quickly don't miss it.

export default function BottomNav({ active, cartCount, onNavigate }: any) {
  return (
    <div className="bottom-nav">
      <button
        className={`nav-item ${active === 'home' ? 'active' : ''}`}
        onClick={() => onNavigate('home')}
      >
        <Icon.Home />
        <span>Home</span>
      </button>
      <button
        className={`nav-item ${active === 'listing' ? 'active' : ''}`}
        onClick={() => onNavigate('listing')}
      >
        <Icon.Reorder />
        <span>Reorder</span>
      </button>

      {/* Center elevated Search FAB */}
      <button
        className="nav-search-fab"
        onClick={() => onNavigate('search')}
        aria-label="Search products"
      >
        <Icon.Search />
      </button>

      <button
        className={`nav-item ${active === 'cart' ? 'active' : ''}`}
        onClick={() => onNavigate('cart')}
      >
        <Icon.Cart />
        {cartCount > 0 && <div className="nav-badge">{cartCount}</div>}
        <span>Cart</span>
      </button>
      <button
        className={`nav-item ${active === 'profile' ? 'active' : ''}`}
        onClick={() => onNavigate('profile')}
      >
        <Icon.Profile />
        <span>Account</span>
      </button>
    </div>
  );
}
