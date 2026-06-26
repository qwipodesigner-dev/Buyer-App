// Shared domain types for the Qwipo Buyer App.
// Framework-agnostic — usable from React, Angular, Vue, or plain TS.

export type StockStatus = 'available' | 'limited' | 'out';

export type SellerType = 'distributor' | 'wholesaler';

export type SortKey =
  | 'recommended'
  | 'price_asc'
  | 'price_desc'
  | 'margin_desc';

export interface ProductVariant {
  id: string;
  size: string;
  casePack: string;
  casePcs: number;
  mrp: number;
  sellingPrice: number;
  casePrice: number;
  discount: number;
  margin: number;
  stock: StockStatus;
  moq: number;
  scheme: string | null;
}

export type DeliveryOption = 'beat' | 'tomorrow';

export interface Product {
  id: string;
  name: string;
  brand: string;
  manufacturer: string;
  countryOfOrigin: string;
  hsn: string;
  gst: number;
  category: string;
  image: string;
  images: string[];
  bgColor: string;
  variants: ProductVariant[];
  // Which per-seller delivery slots this SKU is eligible for. Omitted means
  // both (default). Use ['tomorrow'] for perishables / express-only SKUs and
  // ['beat'] for items only offered on the beat-day route.
  deliveryOptions?: DeliveryOption[];
}

export interface Seller {
  id: string;
  name: string;
  shortName: string;
  location: string;
  mov: number;
  deliveryTime: string;
  deliveryFee: string;
  isVerified: boolean;
  yearsActive: number;
  totalSKUs: number;
}

export interface Distributor {
  id: string;
  name: string;
  shortName: string;
  location: string;
  mov: number;
  skuCount: number;
  featuredBrand: string;
  featuredBrandTitle: string;
  featuredColor: string;
  isAuthorised: boolean;
}

export interface BrandRegistryEntry {
  name: string;
  parent: string;
  founded: number;
  hq: string;
  color: string;
  logo: string | null;
}

export interface Brand extends BrandRegistryEntry {
  id: string;
  logoText: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
  image?: string;
}

export interface HeroBanner {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  bullets: string[];
  cta: string;
  bg: string;
  emoji: string;
  image?: string;
}

export interface WholesalerBanner {
  id: string;
  tag: string;
  title: string;
  discount: string;
  cta: string;
  bg: string;
  emoji: string;
}

export interface WholesalerCategory {
  id: string;
  name: string;
  bg: string;
  emoji: string;
  image?: string;
}

export interface ExclusiveOffer {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  bg: string;
  textColor: string;
  emoji: string;
}

export interface CartItem {
  productId: string;
  name: string;
  variant: string;
  image: string;
  bgColor: string;
  brand: string;
  mrp: number;
  price: number;
  quantity: number;
  unit: string;
  scheme: string | null;
  freeQty?: number;
  extraDiscount?: number;
  flatOff?: number;
}

export interface CartSeller {
  id: string;
  name: string;
  logo: string;
  logoColor: string;
  mov: number;
  deliveryTime: string;
  sellerOffer: string | null;
  type?: 'distributor' | 'wholesaler';
  items: CartItem[];
}

export interface Cart {
  sellers: CartSeller[];
}

export interface MovSuggestion {
  id: string;
  name: string;
  image: string;
  bgColor: string;
  price: number;
  mrp: number;
  casePcs: number;
  casePrice: number;
}

export interface ReorderHistoryEntry {
  productId: string;
  variantId: string;
  lastOrderedAt: string;
  lastQty: number;
  timesOrdered: number;
  sellerType: SellerType;
}

export type NotificationType = 'order' | 'promo' | 'stock' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  icon: string;
  iconColor: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

export interface UserProfile {
  name: string;
  businessName: string;
  businessType: string;
  location: string;
  phone: string;
  email: string;
  gst: string;
  fssai: string;
  kycVerified: boolean;
  memberSince: string;
  totalOrders: number;
  totalSavings: number;
  creditLimit: number;
  creditUsed: number;
}

export interface SavedAddress {
  id: string;
  type: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  contact: string;
  isDefault: boolean;
  icon: string;
}

export type OrderStatus = 'placed' | 'in_transit' | 'processing' | 'delivered' | 'cancelled';

export interface OrderHistoryEntry {
  id: string;
  placedAt: string;
  seller: string;
  sellerLogo: string;
  sellerColor: string;
  itemCount: number;
  total: number;
  status: OrderStatus;
  statusLabel: string;
  eta: string;
  items: string[];
}

export type PaymentMethodType = 'upi' | 'card' | 'credit' | 'cod';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  identifier: string;
  name: string;
  icon: string;
  isDefault: boolean;
}

export interface HelpTopic {
  id: string;
  icon: string;
  title: string;
  items: string[];
}

export interface CategoryFilter {
  id: string;
  name: string;
  isBrand?: boolean;
}

export interface ListingFilters {
  sort: SortKey;
  stock: StockStatus[];
  brands: string[];
  minMargin: number;
  schemesOnly: boolean;
}

export type ScreenName =
  | 'home'
  | 'storefront'
  | 'listing'
  | 'cart'
  | 'reorder'
  | 'notifications'
  | 'profile'
  | 'sub:addresses'
  | 'sub:payment'
  | 'sub:credit'
  | 'sub:help'
  | 'sub:settings'
  | 'sub:notif-prefs'
  | 'sub:language'
  | 'sub:terms'
  | 'sub:invoices'
  | 'sub:refer';

export type NavTarget = 'home' | 'listing' | 'cart' | 'profile' | 'notifications';
