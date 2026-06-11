import { Icon } from './Icons';

export default function BottomNav({ active, cartCount, onNavigate }) {
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
