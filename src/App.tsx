import { useState, useEffect } from 'react';
import { Icon, PhoneNotch } from './components/Icons';
import HomeScreen from './screens/HomeScreen';
import SellerStorefront from './screens/SellerStorefront';
import ProductListing from './screens/ProductListing';
import MultiSellerCart from './screens/MultiSellerCart';
import ReorderScreen from './screens/ReorderScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import OTPScreen from './screens/OTPScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import OrderSummaryScreen from './screens/OrderSummaryScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import DistributorsListScreen from './screens/DistributorsListScreen';
import AllBrandsScreen from './screens/AllBrandsScreen';
import WholesalersCategoriesScreen from './screens/WholesalersCategoriesScreen';
import GlobalSearchScreen from './screens/GlobalSearchScreen';
import CategoriesBrandsScreen from './screens/CategoriesBrandsScreen';
import WholesalerProductListScreen from './screens/WholesalerProductListScreen';
import CouponsScreen from './screens/CouponsScreen';
import CartValidationSheet from './components/CartValidationSheet';
import OrdersScreen from './screens/sub/OrdersScreen';
import AddressesScreen from './screens/sub/AddressesScreen';
import PaymentScreen from './screens/sub/PaymentScreen';
import CreditScreen from './screens/sub/CreditScreen';
import HelpScreen from './screens/sub/HelpScreen';
import SettingsScreen from './screens/sub/SettingsScreen';
import AddToCartSheet from './components/AddToCartSheet';
import ProductImageSheet from './components/ProductImageSheet';
import DiscountsSheet from './components/DiscountsSheet';
import FiltersSheet from './components/FiltersSheet';
import { filtersDefault } from './screens/ProductListing';
import { initialCart, categories } from './data/mockData';

export default function App() {
  const [screen, setScreenRaw] = useState<string>('home');
  const [prevScreen, setPrevScreen] = useState<string>('home');
  const setScreen = (next: string) => {
    if (next === 'global-search') {
      // Remember where we came from so back returns there
      setPrevScreen((current) => (screen === 'global-search' ? current : screen));
    }
    setScreenRaw(next);
  };
  const [selectedCategory, setSelectedCategory] = useState<any>(categories[0]);
  const [selectedDistributor, setSelectedDistributor] = useState<any>(null);
  const [sheetProduct, setSheetProduct] = useState<any>(null);
  const [sheetVariant, setSheetVariant] = useState<any>(null);
  const [imageSheetProduct, setImageSheetProduct] = useState<any>(null);
  const [discountsSheet, setDiscountsSheet] = useState<any>(null); // {product, variant}
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [listingFilters, setListingFilters] = useState<any>(filtersDefault);
  const [authPhone, setAuthPhone] = useState<string>('');
  const [wholesalerCategoryVariant, setWholesalerCategoryVariant] = useState<'groceries' | 'fmcg'>('groceries');
  const [cartValidationOpen, setCartValidationOpen] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [cart, setCart] = useState(initialCart);
  const [listingCart, setListingCart] = useState({});
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 1800);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const cartTotal = cart.sellers.reduce(
    (sum, s) => sum + s.items.reduce((a, i) => a + i.price * i.quantity, 0),
    0
  );
  const cartCount = cart.sellers.reduce((n, s) => n + s.items.length, 0);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setScreen('listing');
  };

  const handleSelectProduct = (product) => {
    setSelectedCategory(categories.find((c) => c.id === product.category) || categories[0]);
    setScreen('listing');
    setTimeout(() => {
      setSheetProduct(product);
      setSheetVariant(product.variants[0]);
    }, 100);
  };

  const handleOpenSheet = (product, variant) => {
    setSheetProduct(product);
    setSheetVariant(variant);
  };

  const handleCloseSheet = () => {
    setSheetProduct(null);
    setSheetVariant(null);
  };

  const handleConfirmAdd = (product, variant, qty) => {
    setListingCart((prev) => ({
      ...prev,
      [`${product.id}_${variant.id}`]: (prev[`${product.id}_${variant.id}`] || 0) + qty,
    }));

    setCart((prev) => {
      const next = { ...prev, sellers: prev.sellers.map((s) => ({ ...s, items: [...s.items] })) };
      const sellerIdx = 0;
      const existingIdx = next.sellers[sellerIdx].items.findIndex(
        (i) => i.productId === product.id && i.variant === variant.size
      );
      if (existingIdx >= 0) {
        next.sellers[sellerIdx].items[existingIdx] = {
          ...next.sellers[sellerIdx].items[existingIdx],
          quantity: next.sellers[sellerIdx].items[existingIdx].quantity + qty,
        };
      } else {
        next.sellers[sellerIdx].items.push({
          productId: product.id,
          name: product.name,
          variant: variant.size,
          image: product.image,
          bgColor: product.bgColor,
          brand: product.brand,
          mrp: variant.mrp,
          price: variant.sellingPrice,
          quantity: qty,
          unit: 'Pcs',
          scheme: variant.scheme,
        });
      }
      return next;
    });

    setToast(`${qty} pc${qty > 1 ? 's' : ''} added to cart`);
    handleCloseSheet();
  };

  const handleUpdateListingQty = (product, variant, newQty) => {
    const key = `${product.id}_${variant.id}`;
    setListingCart((prev) => {
      const next = { ...prev };
      if (newQty <= 0) delete next[key];
      else next[key] = newQty;
      return next;
    });
    // also sync to cart
    setCart((prev) => {
      const next = { ...prev, sellers: prev.sellers.map((s) => ({ ...s, items: [...s.items] })) };
      const sellerIdx = 0;
      const itemIdx = next.sellers[sellerIdx].items.findIndex(
        (i) => i.productId === product.id && i.variant === variant.size
      );
      if (itemIdx >= 0) {
        if (newQty <= 0) {
          next.sellers[sellerIdx].items.splice(itemIdx, 1);
        } else {
          next.sellers[sellerIdx].items[itemIdx] = {
            ...next.sellers[sellerIdx].items[itemIdx],
            quantity: newQty,
          };
        }
      }
      return next;
    });
  };

  const handleUpdateItemQty = (sellerId, itemIdx, newQty) => {
    setCart((prev) => {
      const next = { ...prev, sellers: prev.sellers.map((s) => ({ ...s, items: [...s.items] })) };
      const seller = next.sellers.find((s) => s.id === sellerId);
      if (newQty <= 0) {
        seller.items.splice(itemIdx, 1);
      } else {
        seller.items[itemIdx] = { ...seller.items[itemIdx], quantity: newQty };
      }
      return next;
    });
  };

  const handleAddSuggestion = (sellerId, sug) => {
    setCart((prev) => {
      const next = { ...prev, sellers: prev.sellers.map((s) => ({ ...s, items: [...s.items] })) };
      const seller = next.sellers.find((s) => s.id === sellerId);
      seller.items.push({
        productId: sug.id,
        name: sug.name,
        variant: `1 Case (${sug.casePcs} Pcs)`,
        image: sug.image,
        bgColor: sug.bgColor,
        brand: sug.name.split(' ')[0],
        mrp: sug.mrp,
        price: sug.price,
        quantity: sug.casePcs,
        unit: 'Pcs',
        scheme: null,
      });
      return next;
    });
    setToast(`${sug.name} added`);
  };

  const handleNavigate = (target) => {
    // From bottom nav, "listing" tab maps to Reorder screen
    if (target === 'listing') {
      setScreen('reorder');
      return;
    }
    if (target === 'search') {
      setScreen('global-search');
      return;
    }
    setScreen(target);
  };

  const handleSelectDistributor = (distributor) => {
    setSelectedDistributor(distributor);
    setScreen('storefront');
  };

  const handleSelectBrand = (brand) => {
    setSelectedCategory({ id: brand.id, name: brand.name, isBrand: true });
    setScreen('listing');
  };

  return (
    <div className="app-shell">
      <div className="showcase">
        <div className="showcase-info">
          <div className="brand-tag">
            <span className="dot"></span>
            Qwipo · B2B Commerce
          </div>
          <h2 className="showcase-title">A cleaner cart for the kirana retailer</h2>
          <p className="showcase-subtitle">
            Three connected mobile screens that help retailers discover, evaluate, and
            order from multiple distributors — with margin, schemes, and MOV always visible.
          </p>
          <div className="screen-pills">
            <button
              className={`screen-pill ${screen === 'home' ? 'active' : ''}`}
              onClick={() => setScreen('home')}
            >
              <span className="screen-pill-num">1</span>
              Home · Distributors & Wholesalers
            </button>
            <button
              className={`screen-pill ${screen === 'storefront' ? 'active' : ''}`}
              onClick={() => setScreen('storefront')}
            >
              <span className="screen-pill-num">2</span>
              Seller Storefront
            </button>
            <button
              className={`screen-pill ${screen === 'listing' ? 'active' : ''}`}
              onClick={() => setScreen('listing')}
            >
              <span className="screen-pill-num">3</span>
              Product Listing
            </button>
            <button
              className={`screen-pill ${screen === 'cart' ? 'active' : ''}`}
              onClick={() => setScreen('cart')}
            >
              <span className="screen-pill-num">4</span>
              Multi-Seller Cart
            </button>
            <button
              className={`screen-pill ${screen === 'splash' ? 'active' : ''}`}
              onClick={() => setScreen('splash')}
            >
              <span className="screen-pill-num">5</span>
              Splash · Login · OTP · Onboarding
            </button>
            <button
              className={`screen-pill ${screen === 'order-summary' ? 'active' : ''}`}
              onClick={() => setScreen('order-summary')}
            >
              <span className="screen-pill-num">6</span>
              Order Summary
            </button>
            <button
              className={`screen-pill ${screen === 'my-orders' ? 'active' : ''}`}
              onClick={() => setScreen('my-orders')}
            >
              <span className="screen-pill-num">7</span>
              My Orders + Tracking
            </button>
          </div>
        </div>

        <div className="phone-frame">
          <PhoneNotch />
          <div className="phone-screen">
            {screen === 'home' && (
              <HomeScreen
                cartCount={cartCount}
                onNavigate={handleNavigate}
                onSelectDistributor={handleSelectDistributor}
                onSelectBrand={handleSelectBrand}
                onOpenNotifications={() => setScreen('notifications')}
                onSeeAllDistributors={() => setScreen('distributors-list')}
                onSeeAllBrands={() => setScreen('all-brands')}
                onOpenWholesalerCategory={(id: string) => {
                  setWholesalerCategoryVariant(id === 'groceries' ? 'groceries' : 'fmcg');
                  setScreen('wholesaler-categories');
                }}
              />
            )}
            {screen === 'reorder' && (
              <ReorderScreen
                cartCount={cartCount}
                onNavigate={handleNavigate}
                onOpenSheet={handleOpenSheet}
                onOpenImageSheet={(product) => setImageSheetProduct(product)}
              />
            )}
            {screen === 'notifications' && (
              <NotificationsScreen onBack={() => setScreen('home')} />
            )}

            {/* Auth flow */}
            {screen === 'splash' && (
              <SplashScreen onContinue={() => setScreen('login')} />
            )}
            {screen === 'login' && (
              <LoginScreen
                onBack={() => setScreen('home')}
                onSubmit={(phone: string) => {
                  setAuthPhone(phone);
                  setScreen('otp');
                }}
              />
            )}
            {screen === 'otp' && (
              <OTPScreen
                phone={authPhone}
                onBack={() => setScreen('login')}
                onVerify={() => setScreen('onboarding')}
              />
            )}
            {screen === 'onboarding' && (
              <OnboardingScreen
                onBack={() => setScreen('otp')}
                onProceed={() => setScreen('home')}
              />
            )}

            {/* Order completion */}
            {screen === 'order-summary' && (
              <OrderSummaryScreen
                onBack={() => setScreen('cart')}
                onPlaceOrder={() => {
                  setToast('Order placed successfully');
                  setScreen('my-orders');
                }}
                onOpenCoupons={() => setScreen('coupons')}
                appliedCoupon={appliedCoupon}
              />
            )}
            {screen === 'my-orders' && (
              <MyOrdersScreen onBack={() => setScreen('profile')} />
            )}

            {/* See-all listing screens */}
            {screen === 'distributors-list' && (
              <DistributorsListScreen
                onBack={() => setScreen('home')}
                onSelectDistributor={(distributor: any) => {
                  setSelectedDistributor(distributor);
                  setScreen('storefront');
                }}
                onSelectBrand={(brand: any, distributor: any) => {
                  // Brand tap from distributors list → Companies/Brands/Categories drill-in
                  if (distributor) setSelectedDistributor(distributor);
                  setSelectedCategory({
                    id: brand.id,
                    name: brand.short || brand.name,
                    isBrand: true,
                    color: brand.bg,
                    icon: brand.initials,
                  });
                  setScreen('categories-brands');
                }}
              />
            )}
            {screen === 'all-brands' && (
              <AllBrandsScreen
                onBack={() => setScreen('home')}
                onSelectBrand={(brand: any) => {
                  setSelectedCategory({ id: brand.id, name: brand.name, isBrand: true });
                  setScreen('listing');
                }}
              />
            )}
            {screen === 'wholesaler-categories' && (
              <WholesalersCategoriesScreen
                variant={wholesalerCategoryVariant}
                onBack={() => setScreen('home')}
                onSelectCategory={(cat: any) => {
                  setSelectedCategory({ id: cat.id, name: cat.name });
                  setScreen('wholesaler-products');
                }}
              />
            )}
            {screen === 'global-search' && (
              <GlobalSearchScreen
                onBack={() => setScreen(prevScreen || 'home')}
                onSelectProduct={(p: any) => {
                  setSelectedCategory({ id: p.category, name: 'Search' });
                  setScreen('listing');
                }}
              />
            )}
            {screen === 'categories-brands' && (
              <CategoriesBrandsScreen
                distributor={selectedDistributor}
                category={selectedCategory}
                onBack={() => setScreen('storefront')}
                onSelectBrand={(brand: any) => {
                  setSelectedCategory({ id: brand.id, name: brand.name, isBrand: true });
                  setScreen('listing');
                }}
                onSelectProduct={handleSelectProduct}
                onOpenSearch={() => setScreen('global-search')}
              />
            )}
            {screen === 'wholesaler-products' && (
              <WholesalerProductListScreen
                category={selectedCategory}
                cartItems={listingCart}
                cartTotal={cartTotal}
                onBack={() => setScreen('wholesaler-categories')}
                onOpenSheet={handleOpenSheet}
                onOpenImageSheet={(p: any) => setImageSheetProduct(p)}
                onGoToCart={() => setScreen('cart')}
                onOpenSearch={() => setScreen('global-search')}
              />
            )}
            {screen === 'coupons' && (
              <CouponsScreen
                cartTotal={cartTotal}
                onBack={() => setScreen('order-summary')}
                onApply={(coupon: any) => {
                  setAppliedCoupon(coupon);
                  setToast(`Coupon ${coupon.code} applied`);
                  setScreen('order-summary');
                }}
              />
            )}

            {cartValidationOpen && (
              <CartValidationSheet
                cart={cart}
                onClose={() => setCartValidationOpen(false)}
                onProceed={() => {
                  setCartValidationOpen(false);
                  setScreen('order-summary');
                }}
              />
            )}
            {screen === 'profile' && (
              <ProfileScreen
                cartCount={cartCount}
                onNavigate={handleNavigate}
                onOpenSubPage={(p: string) => {
                  if (p === 'my-orders') setScreen('my-orders');
                  else setScreen(`sub:${p}`);
                }}
                onSignOut={() => setScreen('splash')}
              />
            )}
            {screen === 'sub:orders' && <OrdersScreen onBack={() => setScreen('profile')} />}
            {screen === 'sub:addresses' && <AddressesScreen onBack={() => setScreen('profile')} />}
            {screen === 'sub:payment' && <PaymentScreen onBack={() => setScreen('profile')} />}
            {screen === 'sub:credit' && <CreditScreen onBack={() => setScreen('profile')} />}
            {screen === 'sub:help' && <HelpScreen onBack={() => setScreen('profile')} />}
            {(screen === 'sub:settings' ||
              screen === 'sub:notif-prefs' ||
              screen === 'sub:language' ||
              screen === 'sub:terms' ||
              screen === 'sub:invoices' ||
              screen === 'sub:refer') && (
              <SettingsScreen
                onBack={() => setScreen('profile')}
                page={screen.replace('sub:', '')}
              />
            )}
            {screen === 'storefront' && (
              <SellerStorefront
                cartCount={cartCount}
                distributor={selectedDistributor}
                onBack={() => setScreen('home')}
                onNavigate={handleNavigate}
                onSelectCategory={(cat: any) => {
                  // Direct to ProductListing — the brands+products drill-in
                  // (CategoriesBrandsScreen) is reserved for explicit "browse by brand" flows.
                  setSelectedCategory(cat);
                  setScreen('listing');
                }}
                onSelectProduct={handleSelectProduct}
              />
            )}
            {screen === 'listing' && (
              <ProductListing
                category={selectedCategory}
                cartItems={listingCart}
                cartTotal={cartTotal}
                filters={listingFilters}
                onBack={() => setScreen('storefront')}
                onOpenSheet={handleOpenSheet}
                onOpenImageSheet={(product) => setImageSheetProduct(product)}
                onOpenDiscounts={(product, variant) => setDiscountsSheet({ product, variant })}
                onOpenFilters={() => setFiltersOpen(true)}
                onGoToCart={() => setScreen('cart')}
                onUpdateQty={handleUpdateListingQty}
                onOpenSearch={() => setScreen('global-search')}
              />
            )}
            {screen === 'cart' && (
              <MultiSellerCart
                cart={cart}
                onBack={() => setScreen('listing')}
                onUpdateItemQty={handleUpdateItemQty}
                onAddSuggestion={handleAddSuggestion}
                onContinueShopping={() => setScreen('storefront')}
                onCheckout={() => setCartValidationOpen(true)}
              />
            )}

            {sheetProduct && (
              <AddToCartSheet
                product={sheetProduct}
                initialVariant={sheetVariant}
                onClose={handleCloseSheet}
                onConfirm={handleConfirmAdd}
              />
            )}

            {imageSheetProduct && (
              <ProductImageSheet
                product={imageSheetProduct}
                onClose={() => setImageSheetProduct(null)}
                onAddClick={(product) => {
                  setImageSheetProduct(null);
                  handleOpenSheet(product, product.variants[0]);
                }}
              />
            )}

            {discountsSheet && (
              <DiscountsSheet
                product={discountsSheet.product}
                variant={discountsSheet.variant}
                onClose={() => setDiscountsSheet(null)}
              />
            )}

            {filtersOpen && (
              <FiltersSheet
                initialFilters={listingFilters}
                onClose={() => setFiltersOpen(false)}
                onApply={(f) => setListingFilters(f)}
              />
            )}

            {toast && (
              <div className="toast">
                <Icon.Check />
                {toast}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
