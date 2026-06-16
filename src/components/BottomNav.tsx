import { Icon } from './Icons';
import { useI18n } from '../i18n';

// Center search FAB is the most-used action — kept large and elevated above the bar
// so retailers who scan icons quickly don't miss it.

export default function BottomNav({ active, cartCount, onNavigate }: any) {
  const { t } = useI18n();
  return (
    <div className="bottom-nav">
      <button
        className={`nav-item ${active === 'home' ? 'active' : ''}`}
        onClick={() => onNavigate('home')}
      >
        <Icon.Home />
        <span>{t('nav.home')}</span>
      </button>
      <button
        className={`nav-item ${active === 'listing' ? 'active' : ''}`}
        onClick={() => onNavigate('listing')}
      >
        <Icon.Reorder />
        <span>{t('nav.reorder')}</span>
      </button>

      {/* Center elevated Search FAB */}
      <button
        className="nav-search-fab"
        onClick={() => onNavigate('search')}
        aria-label={t('common.search')}
      >
        <Icon.Search />
      </button>

      <button
        className={`nav-item ${active === 'cart' ? 'active' : ''}`}
        onClick={() => onNavigate('cart')}
      >
        <Icon.Cart />
        {cartCount > 0 && <div className="nav-badge">{cartCount}</div>}
        <span>{t('nav.cart')}</span>
      </button>
      <button
        className={`nav-item ${active === 'profile' ? 'active' : ''}`}
        onClick={() => onNavigate('profile')}
      >
        <Icon.Profile />
        <span>{t('nav.account')}</span>
      </button>
    </div>
  );
}
