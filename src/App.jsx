import { useState, useEffect } from 'react';
import { Icon, PhoneNotch } from './components/Icons';
import HomeScreen from './screens/HomeScreen';
import SellerStorefront from './screens/SellerStorefront';
import ProductListing from './screens/ProductListing';
import MultiSellerCart from './screens/MultiSellerCart';
import ReorderScreen from './screens/ReorderScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
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
  const [screen, setScreen] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [sheetProduct, setSheetProduct] = useState(null);
  const [sheetVariant, setSheetVariant] = useState(null);
  const [imageSheetProduct, setImageSheetProduct] = useState(null);
  const [discountsSheet, setDiscountsSheet] = useState(null); // {product, variant}
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [listingFilters, setListingFilters] = useState(filtersDefault);
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
            {screen === 'profile' && (
              <ProfileScreen
                cartCount={cartCount}
                onNavigate={handleNavigate}
                onOpenSubPage={(p) => setScreen(`sub:${p}`)}
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
                onSelectCategory={handleSelectCategory}
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
              />
            )}
            {screen === 'cart' && (
              <MultiSellerCart
                cart={cart}
                onBack={() => setScreen('listing')}
                onUpdateItemQty={handleUpdateItemQty}
                onAddSuggestion={handleAddSuggestion}
                onContinueShopping={() => setScreen('storefront')}
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
