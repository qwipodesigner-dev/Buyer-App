import { useState } from 'react';
import { Icon, StatusBar } from '../components/Icons';
import BottomNav from '../components/BottomNav';
import BannerCarousel from '../components/BannerCarousel';
import {
  distributors,
  brands,
  heroBanners,
  wholesalerBanners,
  wholesalerCategories,
  exclusiveOffers,
} from '../data/mockData';

export default function HomeScreen({
  cartCount,
  onNavigate,
  onSelectDistributor,
  onSelectBrand,
  onOpenNotifications,
  onSeeAllDistributors,
  onSeeAllBrands,
  onOpenWholesalerCategory,
}: any) {
  const [tab, setTab] = useState('distributors');

  const visibleDistributors = distributors.filter((d) =>
    tab === 'distributors' ? d.isAuthorised : true
  );

  return (
    <>
      <StatusBar />
      <div className="screen-body">
        {/* Brand header */}
        <div className="home-header">
          <img
            className="home-brand-logo"
            src="/brand/qwipo-logo.svg"
            alt="Qwipo"
          />
          <div className="ondc-badge">
            <img
              className="ondc-logo-img"
              src="/brand/digidukaan-logo.svg"
              alt="Powered by ONDC DigiDukaan"
            />
          </div>
          <div className="home-header-actions">
            <button className="icon-btn" onClick={onOpenNotifications}>
              <Icon.Bell />
              <div className="bell-dot" />
            </button>
          </div>
        </div>

        {/* Location bar */}
        <div className="location-bar">
          <span className="location-pin">📍</span>
          <span className="location-prefix">Deliver to</span>
          <span className="location-value">Lit Box, Rai Durg, Hitech City</span>
          <Icon.ChevronDown />
        </div>

        {/* Tab segmented control — uses the Home Screen Images set */}
        <div className="home-tabs">
          <button
            className={`home-tab ${tab === 'distributors' ? 'active' : ''}`}
            onClick={() => setTab('distributors')}
          >
            <div className="home-tab-img" style={{ background: '#FEF3C7' }}>
              <img
                src="/home-category-cards/distributors.png"
                alt="Distributors"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                  (e.currentTarget as HTMLImageElement).parentElement!.textContent = '📦';
                }}
              />
            </div>
            <span>Authorised distributors</span>
          </button>
          <button
            className={`home-tab ${tab === 'wholesalers' ? 'active' : ''}`}
            onClick={() => setTab('wholesalers')}
          >
            <div className="home-tab-img" style={{ background: '#FED7AA' }}>
              <img
                src="/home-category-cards/wholesalers.png"
                alt="Wholesalers"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                  (e.currentTarget as HTMLImageElement).parentElement!.textContent = '🏪';
                }}
              />
            </div>
            <span>Wholesalers</span>
          </button>
        </div>

        {tab === 'distributors' ? (
          <DistributorsView
            visibleDistributors={visibleDistributors}
            onSelectDistributor={onSelectDistributor}
            onSelectBrand={onSelectBrand}
            onSeeAllDistributors={onSeeAllDistributors}
            onSeeAllBrands={onSeeAllBrands}
          />
        ) : (
          <WholesalersView
            onSelectBrand={onSelectBrand}
            onOpenWholesalerCategory={onOpenWholesalerCategory}
            onSeeAllBrands={onSeeAllBrands}
          />
        )}
      </div>

      <BottomNav active="home" cartCount={cartCount} onNavigate={onNavigate} />
    </>
  );
}

function DistributorsView({
  visibleDistributors,
  onSelectDistributor,
  onSelectBrand,
  onSeeAllDistributors,
  onSeeAllBrands,
}: any) {
  return (
    <>
      {/* Hero banner carousel — auto-scrolls every 5s */}
      <BannerCarousel
        banners={heroBanners}
        renderBanner={(b) => (
          <div key={b.id} className="hero-banner" style={{ background: b.bg }}>
            <div className="hero-banner-text">
              <div className="hero-banner-tag">{b.tag}</div>
              <div className="hero-banner-title">{b.title}</div>
              <div className="hero-banner-sub">{b.subtitle}</div>
              <ul className="hero-banner-bullets">
                {b.bullets.map((bl, i) => (
                  <li key={i}>{bl}</li>
                ))}
              </ul>
              <button className="hero-banner-cta">{b.cta} →</button>
            </div>
            <div className="hero-banner-art">{b.emoji}</div>
          </div>
        )}
      />

      {/* Distributors section */}
      <div className="section">
        <div className="section-head">
          <div className="section-title">Distributors</div>
          <button className="section-link" onClick={onSeeAllDistributors}>
            See all
          </button>
        </div>
        <div className="rail">
          {visibleDistributors.map((d) => {
            const featured = brands.find(
              (b) => b.name.toLowerCase() === d.featuredBrand.toLowerCase()
            );
            return (
              <button
                key={d.id}
                className="distributor-card"
                onClick={() => onSelectDistributor(d)}
              >
                <div
                  className="distributor-card-img"
                  style={{ background: '#ffffff' }}
                >
                  {featured?.logo ? (
                    <img
                      className="distributor-card-logo"
                      src={featured.logo}
                      alt={featured.name}
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.style.display = 'none';
                        el.parentElement!.style.background = d.featuredColor;
                        el.parentElement!.innerHTML = `<span class="distributor-card-brand">${d.featuredBrand}</span>`;
                      }}
                    />
                  ) : (
                    <span className="distributor-card-brand">{d.featuredBrand}</span>
                  )}
                </div>
                <div className="distributor-card-title">{d.featuredBrandTitle}</div>
                <div className="distributor-card-sub">{d.shortName}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* All brands grid */}
      <div className="section" style={{ paddingBottom: 110 }}>
        <div className="section-head">
          <div className="section-title">All brands</div>
          <button className="section-link" onClick={onSeeAllBrands}>
            See all
          </button>
        </div>
        <div className="brand-grid">
          {brands.map((b) => (
            <button
              key={b.id}
              className="brand-grid-tile"
              onClick={() => onSelectBrand(b)}
            >
              <div
                className="brand-grid-circle"
                style={{ background: b.logo ? '#ffffff' : b.color }}
              >
                {b.logo ? (
                  <img
                    src={b.logo}
                    alt={b.name}
                    onError={(e) => {
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
              <div className="brand-grid-name">{b.name}</div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function WholesalersView({ onSelectBrand, onOpenWholesalerCategory, onSeeAllBrands }: any) {
  return (
    <>
      {/* Snack banner carousel — auto-scrolls every 5s */}
      <BannerCarousel
        banners={wholesalerBanners}
        renderBanner={(b) => (
          <div key={b.id} className="hero-banner snack-banner" style={{ background: b.bg }}>
            <div className="hero-banner-text">
              <div className="hero-banner-tag" style={{ color: '#DC2626' }}>{b.tag}</div>
              <div className="hero-banner-title" style={{ color: '#7C2D12' }}>{b.title}</div>
              <div className="snack-discount">{b.discount}</div>
              <button className="hero-banner-cta orange-cta">{b.cta} →</button>
            </div>
            <div className="hero-banner-art">{b.emoji}</div>
          </div>
        )}
      />

      {/* Groceries + FMCG */}
      <div className="section">
        <div className="wholesale-categories">
          {wholesalerCategories.map((c) => (
            <button
              key={c.id}
              className="wholesale-category-card"
              style={{ background: c.bg }}
              onClick={() => onOpenWholesalerCategory?.(c.id)}
            >
              <div className="wholesale-category-emoji">{c.emoji}</div>
              <div className="wholesale-category-name">{c.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Exclusive offers */}
      <div className="section">
        <div className="section-head">
          <div className="section-title">Exclusive offers</div>
          <button className="section-link">See all</button>
        </div>
        <div className="rail">
          {exclusiveOffers.map((o) => (
            <button
              key={o.id}
              className="exclusive-card"
              style={{ background: o.bg, color: o.textColor }}
            >
              <div className="exclusive-card-discount">{o.discount}</div>
              <div className="exclusive-card-art">{o.emoji}</div>
              <div className="exclusive-card-title">{o.title}</div>
              <div className="exclusive-card-sub">{o.subtitle}</div>
              <div className="exclusive-card-cta">Shop now →</div>
            </button>
          ))}
        </div>
      </div>

      {/* Top categories */}
      <div className="section" style={{ paddingBottom: 110 }}>
        <div className="section-head">
          <div className="section-title">Top categories</div>
          <button className="section-link" onClick={onSeeAllBrands}>See all</button>
        </div>
        <div className="brand-grid">
          {brands.slice(0, 6).map((b) => (
            <button
              key={b.id}
              className="brand-grid-tile"
              onClick={() => onSelectBrand(b)}
            >
              <div
                className="brand-grid-circle"
                style={{ background: b.logo ? '#ffffff' : b.color }}
              >
                {b.logo ? (
                  <img
                    src={b.logo}
                    alt={b.name}
                    onError={(e) => {
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
              <div className="brand-grid-name">{b.name}</div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
