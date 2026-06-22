import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

// Lightweight i18n — no framework. A Context exposes the active language code
// and a t() function. Selection persists in localStorage so reloads keep it.
// Strings live in dictionaries below; add a new locale by adding a key here.

export type LangCode = 'en' | 'hi' | 'te' | 'ta';

export interface Language {
  code: LangCode;
  name: string; // English name
  nativeName: string; // Native script
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
];

// Translation dictionaries. Keys are dot-separated; English is the source of
// truth and is also the fallback for any missing key in another locale.
const STRINGS: Record<LangCode, Record<string, string>> = {
  en: {
    'common.see_all': 'See all',
    'common.search': 'Search',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.back': 'Back',
    'common.deliver_to': 'Deliver to',
    'common.tomorrow': 'Tomorrow',

    'home.qwipo_buyer_app': 'Qwipo Buyer App',
    'home.authorised_distributors': 'Authorised distributors',
    'home.wholesalers': 'Wholesalers',
    'home.distributors': 'Distributors',
    'home.all_brands': 'All brands',
    'home.categories': 'Categories',
    'home.exclusive_offers': 'Exclusive offers',
    'home.top_categories': 'Top categories',
    'home.top_brands': 'Top Brands',
    'home.shop_now': 'Shop now',

    'nav.home': 'Home',
    'nav.reorder': 'Reorder',
    'nav.cart': 'Cart',
    'nav.account': 'Account',

    'storefront.authorised_distributor': 'Authorised Distributor',
    'storefront.minimum_order_value': 'Minimum Order Value',
    'storefront.delivery_by': 'Delivery by',
    'storefront.shop_by_category': 'Shop by category',
    'storefront.top_brands': 'Top brands',
    'storefront.best_sellers': 'Best sellers',
    'storefront.authorised': 'Authorised',

    'orders.my_orders': 'My Orders',
    'orders.order_details': 'Order Details',
    'orders.cancel_order': 'Cancel Order',
    'orders.cancel': 'Cancel',
    'orders.track_order': 'Track Order',
    'orders.invoice': 'Invoice',
    'orders.reorder': 'Reorder',
    'orders.no_orders_yet': 'No orders yet',
    'orders.total': 'Total',
    'orders.items': 'items',
    'orders.item': 'item',
    'orders.placed': 'Placed',

    'cart.your_cart': 'Your Cart',
    'cart.proceed_to_checkout': 'Proceed to checkout',
    'cart.continue_shopping': 'Continue shopping',
    'cart.grand_total': 'Grand Total',
    'cart.view_cart': 'View cart',

    'account.my_account': 'My Account',
    'account.business_details': 'Business Details',
    'account.qwipo_credit': 'Qwipo Credit',
    'account.available': 'available',
    'account.used': 'Used',
    'account.limit': 'Limit',
    'account.track_orders': 'My Orders',
    'account.saved_addresses': 'Saved addresses',
    'account.payment_methods': 'Payment methods',
    'account.refer_earn': 'Refer & earn',
    'account.language': 'Language',
    'account.notification_preferences': 'Notification preferences',
    'account.help_support': 'Help & Support',
    'account.tax_invoices': 'Tax invoices',
    'account.sign_out': 'Sign out',

    'lang.choose_language': 'Choose your language',
    'lang.choose_language_sub':
      'The app will switch to your selected language immediately.',
    'lang.applied': 'Language updated',
  },
  hi: {
    'common.see_all': 'सभी देखें',
    'common.search': 'खोजें',
    'common.cancel': 'रद्द करें',
    'common.confirm': 'पुष्टि करें',
    'common.save': 'सेव करें',
    'common.back': 'वापस',
    'common.deliver_to': 'डिलीवरी पता',
    'common.tomorrow': 'कल',

    'home.qwipo_buyer_app': 'क्विपो बायर ऐप',
    'home.authorised_distributors': 'अधिकृत डिस्ट्रिब्यूटर',
    'home.wholesalers': 'होलसेलर',
    'home.distributors': 'डिस्ट्रिब्यूटर',
    'home.all_brands': 'सभी ब्रांड',
    'home.categories': 'श्रेणियाँ',
    'home.exclusive_offers': 'विशेष ऑफर',
    'home.top_categories': 'मुख्य श्रेणियाँ',
    'home.top_brands': 'मुख्य ब्रांड',
    'home.shop_now': 'अभी खरीदें',

    'nav.home': 'होम',
    'nav.reorder': 'फिर ऑर्डर',
    'nav.cart': 'कार्ट',
    'nav.account': 'अकाउंट',

    'storefront.authorised_distributor': 'अधिकृत डिस्ट्रिब्यूटर',
    'storefront.minimum_order_value': 'न्यूनतम ऑर्डर मूल्य',
    'storefront.delivery_by': 'डिलीवरी',
    'storefront.shop_by_category': 'श्रेणी से खरीदें',
    'storefront.top_brands': 'मुख्य ब्रांड',
    'storefront.best_sellers': 'बेस्ट सेलर',
    'storefront.authorised': 'अधिकृत',

    'orders.my_orders': 'मेरे ऑर्डर',
    'orders.order_details': 'ऑर्डर विवरण',
    'orders.cancel_order': 'ऑर्डर रद्द करें',
    'orders.cancel': 'रद्द करें',
    'orders.track_order': 'ऑर्डर ट्रैक करें',
    'orders.invoice': 'चालान',
    'orders.reorder': 'फिर ऑर्डर',
    'orders.no_orders_yet': 'अभी तक कोई ऑर्डर नहीं',
    'orders.total': 'कुल',
    'orders.items': 'आइटम',
    'orders.item': 'आइटम',
    'orders.placed': 'दिया गया',

    'cart.your_cart': 'आपका कार्ट',
    'cart.proceed_to_checkout': 'चेकआउट करें',
    'cart.continue_shopping': 'खरीदारी जारी रखें',
    'cart.grand_total': 'कुल राशि',
    'cart.view_cart': 'कार्ट देखें',

    'account.my_account': 'मेरा अकाउंट',
    'account.business_details': 'व्यवसाय विवरण',
    'account.qwipo_credit': 'क्विपो क्रेडिट',
    'account.available': 'उपलब्ध',
    'account.used': 'उपयोग',
    'account.limit': 'सीमा',
    'account.track_orders': 'मेरे ऑर्डर',
    'account.saved_addresses': 'सेव किए गए पते',
    'account.payment_methods': 'भुगतान विधियाँ',
    'account.refer_earn': 'रेफर करें और कमाएँ',
    'account.language': 'भाषा',
    'account.notification_preferences': 'सूचना प्राथमिकताएँ',
    'account.help_support': 'सहायता',
    'account.tax_invoices': 'टैक्स चालान',
    'account.sign_out': 'साइन आउट',

    'lang.choose_language': 'अपनी भाषा चुनें',
    'lang.choose_language_sub': 'ऐप तुरंत आपकी चुनी हुई भाषा में बदल जाएगा।',
    'lang.applied': 'भाषा बदल दी गई',
  },
  te: {
    'common.see_all': 'అన్నీ చూడండి',
    'common.search': 'వెతకండి',
    'common.cancel': 'రద్దు',
    'common.confirm': 'నిర్ధారించండి',
    'common.save': 'సేవ్',
    'common.back': 'వెనుకకు',
    'common.deliver_to': 'డెలివరీ చిరునామా',
    'common.tomorrow': 'రేపు',

    'home.qwipo_buyer_app': 'క్విపో బయర్ యాప్',
    'home.authorised_distributors': 'అధికారిక డిస్ట్రిబ్యూటర్లు',
    'home.wholesalers': 'హోల్‌సేలర్లు',
    'home.distributors': 'డిస్ట్రిబ్యూటర్లు',
    'home.all_brands': 'అన్ని బ్రాండ్‌లు',
    'home.categories': 'వర్గాలు',
    'home.exclusive_offers': 'ప్రత్యేక ఆఫర్‌లు',
    'home.top_categories': 'ముఖ్య వర్గాలు',
    'home.top_brands': 'ముఖ్య బ్రాండ్‌లు',
    'home.shop_now': 'ఇప్పుడే కొనండి',

    'nav.home': 'హోం',
    'nav.reorder': 'మళ్ళీ ఆర్డర్',
    'nav.cart': 'కార్ట్',
    'nav.account': 'ఖాతా',

    'storefront.authorised_distributor': 'అధికారిక డిస్ట్రిబ్యూటర్',
    'storefront.minimum_order_value': 'కనీస ఆర్డర్ విలువ',
    'storefront.delivery_by': 'డెలివరీ',
    'storefront.shop_by_category': 'వర్గం ద్వారా షాపింగ్',
    'storefront.top_brands': 'ముఖ్య బ్రాండ్‌లు',
    'storefront.best_sellers': 'బెస్ట్ సెల్లర్‌లు',
    'storefront.authorised': 'అధికారిక',

    'orders.my_orders': 'నా ఆర్డర్లు',
    'orders.order_details': 'ఆర్డర్ వివరాలు',
    'orders.cancel_order': 'ఆర్డర్ రద్దు చేయండి',
    'orders.cancel': 'రద్దు',
    'orders.track_order': 'ఆర్డర్ ట్రాక్ చేయండి',
    'orders.invoice': 'ఇన్‌వాయిస్',
    'orders.reorder': 'మళ్ళీ ఆర్డర్',
    'orders.no_orders_yet': 'ఇంకా ఆర్డర్లు లేవు',
    'orders.total': 'మొత్తం',
    'orders.items': 'వస్తువులు',
    'orders.item': 'వస్తువు',
    'orders.placed': 'ఇవ్వబడింది',

    'cart.your_cart': 'మీ కార్ట్',
    'cart.proceed_to_checkout': 'చెక్‌అవుట్ చేయండి',
    'cart.continue_shopping': 'షాపింగ్ కొనసాగించండి',
    'cart.grand_total': 'మొత్తం',
    'cart.view_cart': 'కార్ట్ చూడండి',

    'account.my_account': 'నా ఖాతా',
    'account.business_details': 'వ్యాపార వివరాలు',
    'account.qwipo_credit': 'క్విపో క్రెడిట్',
    'account.available': 'అందుబాటులో',
    'account.used': 'ఉపయోగించబడింది',
    'account.limit': 'పరిమితి',
    'account.track_orders': 'నా ఆర్డర్లు',
    'account.saved_addresses': 'సేవ్ చేసిన చిరునామాలు',
    'account.payment_methods': 'చెల్లింపు పద్ధతులు',
    'account.refer_earn': 'రెఫర్ చేసి సంపాదించండి',
    'account.language': 'భాష',
    'account.notification_preferences': 'నోటిఫికేషన్ ప్రాధాన్యతలు',
    'account.help_support': 'సహాయం',
    'account.tax_invoices': 'పన్ను ఇన్‌వాయిస్‌లు',
    'account.sign_out': 'సైన్ అవుట్',

    'lang.choose_language': 'మీ భాషను ఎంచుకోండి',
    'lang.choose_language_sub': 'యాప్ వెంటనే ఎంచుకున్న భాషకు మారుతుంది.',
    'lang.applied': 'భాష మారింది',
  },
  ta: {
    'common.see_all': 'அனைத்தையும் காண்',
    'common.search': 'தேடு',
    'common.cancel': 'ரத்து',
    'common.confirm': 'உறுதி செய்',
    'common.save': 'சேமி',
    'common.back': 'பின்',
    'common.deliver_to': 'டெலிவரி முகவரி',
    'common.tomorrow': 'நாளை',

    'home.qwipo_buyer_app': 'குய்போ பயர் ஆப்',
    'home.authorised_distributors': 'அங்கீகரிக்கப்பட்ட விநியோகஸ்தர்கள்',
    'home.wholesalers': 'மொத்த விற்பனையாளர்கள்',
    'home.distributors': 'விநியோகஸ்தர்கள்',
    'home.all_brands': 'அனைத்து பிராண்டுகள்',
    'home.categories': 'வகைகள்',
    'home.exclusive_offers': 'சிறப்பு சலுகைகள்',
    'home.top_categories': 'முக்கிய வகைகள்',
    'home.top_brands': 'முக்கிய பிராண்டுகள்',
    'home.shop_now': 'இப்போதே வாங்கு',

    'nav.home': 'முகப்பு',
    'nav.reorder': 'மீண்டும் ஆர்டர்',
    'nav.cart': 'கூடை',
    'nav.account': 'கணக்கு',

    'storefront.authorised_distributor': 'அங்கீகரிக்கப்பட்ட விநியோகஸ்தர்',
    'storefront.minimum_order_value': 'குறைந்தபட்ச ஆர்டர் மதிப்பு',
    'storefront.delivery_by': 'டெலிவரி',
    'storefront.shop_by_category': 'வகை வாரியாக ஷாப்பிங்',
    'storefront.top_brands': 'முக்கிய பிராண்டுகள்',
    'storefront.best_sellers': 'பெஸ்ட் செல்லர்ஸ்',
    'storefront.authorised': 'அங்கீகரிக்கப்பட்ட',

    'orders.my_orders': 'எனது ஆர்டர்கள்',
    'orders.order_details': 'ஆர்டர் விவரங்கள்',
    'orders.cancel_order': 'ஆர்டரை ரத்து செய்',
    'orders.cancel': 'ரத்து',
    'orders.track_order': 'ஆர்டரை கண்காணி',
    'orders.invoice': 'விலைப்பட்டியல்',
    'orders.reorder': 'மீண்டும் ஆர்டர்',
    'orders.no_orders_yet': 'இதுவரை ஆர்டர்கள் இல்லை',
    'orders.total': 'மொத்தம்',
    'orders.items': 'பொருட்கள்',
    'orders.item': 'பொருள்',
    'orders.placed': 'வைக்கப்பட்டது',

    'cart.your_cart': 'உங்கள் கூடை',
    'cart.proceed_to_checkout': 'செக்அவுட் செய்',
    'cart.continue_shopping': 'ஷாப்பிங் தொடர்',
    'cart.grand_total': 'மொத்த தொகை',
    'cart.view_cart': 'கூடையை பார்',

    'account.my_account': 'எனது கணக்கு',
    'account.business_details': 'வணிக விவரங்கள்',
    'account.qwipo_credit': 'குய்போ கிரெடிட்',
    'account.available': 'கிடைக்கிறது',
    'account.used': 'பயன்படுத்தப்பட்டது',
    'account.limit': 'வரம்பு',
    'account.track_orders': 'எனது ஆர்டர்கள்',
    'account.saved_addresses': 'சேமித்த முகவரிகள்',
    'account.payment_methods': 'பணம் செலுத்தும் முறைகள்',
    'account.refer_earn': 'பரிந்துரை செய்து சம்பாதி',
    'account.language': 'மொழி',
    'account.notification_preferences': 'அறிவிப்பு விருப்பத்தேர்வுகள்',
    'account.help_support': 'உதவி',
    'account.tax_invoices': 'வரி விலைப்பட்டியல்',
    'account.sign_out': 'வெளியேறு',

    'lang.choose_language': 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    'lang.choose_language_sub':
      'ஆப் உடனடியாக நீங்கள் தேர்ந்தெடுத்த மொழிக்கு மாறும்.',
    'lang.applied': 'மொழி மாற்றப்பட்டது',
  },
};

const LS_KEY = 'qwipo:lang';

interface I18nCtx {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(LS_KEY) : null;
    if (saved && (LANGUAGES as Language[]).some((l) => l.code === saved)) {
      return saved as LangCode;
    }
    return 'en';
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(LS_KEY, lang);
    } catch {
      /* storage disabled — ignore */
    }
  }, [lang]);

  const setLang = useCallback((code: LangCode) => setLangState(code), []);

  const t = useCallback(
    (key: string) => STRINGS[lang][key] ?? STRINGS.en[key] ?? key,
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
