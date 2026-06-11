import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import QwipoLogo from '../../assets/brand/qwipo-logo.svg';
import DigiDukaanLogo from '../../assets/brand/digidukaan-logo.svg';
import { Icon } from '../components/Icons';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme/tokens';
import {
  brands,
  distributors,
  heroBanners,
  wholesalerBanners,
  wholesalerCategories,
  exclusiveOffers,
} from '../data/mockData';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BANNER_WIDTH = SCREEN_WIDTH - 32; // 16px padding each side
const BANNER_GAP = 10;

export default function HomeScreen() {
  const [tab, setTab] = useState<'distributors' | 'wholesalers'>('distributors');
  const visibleDistributors = distributors.filter((d) =>
    tab === 'distributors' ? d.isAuthorised : true
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand header */}
        <View style={styles.header}>
          <QwipoLogo width={92} height={28} />
          <View style={styles.ondcBadge}>
            <DigiDukaanLogo width={101} height={26} />
          </View>
          <Pressable style={styles.iconBtn} hitSlop={8}>
            <Icon.Bell size={18} color={colors.foreground} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        {/* Location */}
        <View style={styles.locationBar}>
          <Text style={styles.locationPin}>📍</Text>
          <Text style={styles.locationPrefix}>Deliver to </Text>
          <Text style={styles.locationValue} numberOfLines={1}>
            Lit Box, Rai Durg, Hitech City
          </Text>
          <Icon.ChevronDown size={14} color={colors.primary} />
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Icon.Search size={18} color={colors.mutedFg} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for products, brands…"
              placeholderTextColor={colors.mutedFg}
            />
          </View>
        </View>

        {/* Tab cards */}
        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tab, tab === 'distributors' && styles.tabActive]}
            onPress={() => setTab('distributors')}
          >
            <View style={[styles.tabIcon, { backgroundColor: colors.bgYellow }]}>
              <Text style={styles.tabEmoji}>📦</Text>
            </View>
            <Text
              style={[styles.tabLabel, tab === 'distributors' && styles.tabLabelActive]}
            >
              Authorised{'\n'}distributors
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, tab === 'wholesalers' && styles.tabActive]}
            onPress={() => setTab('wholesalers')}
          >
            <View style={[styles.tabIcon, { backgroundColor: colors.bgOrange }]}>
              <Text style={styles.tabEmoji}>🏪</Text>
            </View>
            <Text
              style={[styles.tabLabel, tab === 'wholesalers' && styles.tabLabelActive]}
            >
              Wholesalers
            </Text>
          </Pressable>
        </View>

        {tab === 'distributors' ? (
          <DistributorsView visibleDistributors={visibleDistributors} />
        ) : (
          <WholesalersView />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ============================================================
   DistributorsView — hero carousel + distributors rail + brands
   ============================================================ */
function DistributorsView({ visibleDistributors }: { visibleDistributors: any[] }) {
  const railRef = useRef<ScrollView>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const lastTouchRef = useRef(0);

  // Auto-scroll banner every 5 seconds — pause for 8s after touch
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastTouchRef.current < 8000) return;
      setActiveIdx((idx) => {
        const next = (idx + 1) % heroBanners.length;
        railRef.current?.scrollTo({
          x: next * (BANNER_WIDTH + BANNER_GAP),
          animated: true,
        });
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    lastTouchRef.current = Date.now();
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / (BANNER_WIDTH + BANNER_GAP));
    if (idx !== activeIdx) setActiveIdx(idx);
  };

  return (
    <>
      {/* Hero banner carousel */}
      <ScrollView
        ref={railRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={BANNER_WIDTH + BANNER_GAP}
        snapToAlignment="start"
        contentContainerStyle={styles.bannerRail}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onTouchStart={() => (lastTouchRef.current = Date.now())}
      >
        {heroBanners.map((b) => (
          <View key={b.id} style={[styles.heroBanner, { backgroundColor: '#FBCFE8' }]}>
            <View style={styles.heroText}>
              <Text style={styles.heroTag}>{b.tag}</Text>
              <Text style={styles.heroTitle}>{b.title}</Text>
              <Text style={styles.heroSub}>{b.subtitle}</Text>
              {b.bullets.map((bl, i) => (
                <Text key={i} style={styles.heroBullet}>
                  ✓ {bl}
                </Text>
              ))}
              <View style={styles.heroCta}>
                <Text style={styles.heroCtaText}>{b.cta} →</Text>
              </View>
            </View>
            <Text style={styles.heroEmoji}>{b.emoji}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dots}>
        {heroBanners.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              idx === activeIdx ? styles.dotActive : null,
            ]}
          />
        ))}
      </View>

      {/* Distributors rail */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Distributors</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {visibleDistributors.map((d) => (
            <Pressable key={d.id} style={styles.distributorCard}>
              <View
                style={[
                  styles.distributorImg,
                  { backgroundColor: d.featuredColor },
                ]}
              >
                <Text style={styles.distributorBrand}>{d.featuredBrand}</Text>
              </View>
              <Text style={styles.distributorTitle}>{d.featuredBrandTitle}</Text>
              <Text style={styles.distributorSub} numberOfLines={1}>
                {d.shortName}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* All brands grid */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>All brands</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </View>
        <View style={styles.brandGrid}>
          {brands.map((b) => (
            <Pressable key={b.id} style={styles.brandTile}>
              <View
                style={[
                  styles.brandCircle,
                  { backgroundColor: b.logo ? '#fff' : b.color },
                ]}
              >
                {b.logo ? (
                  <Image source={{ uri: b.logo }} style={styles.brandImg} />
                ) : (
                  <Text style={styles.brandLogoText}>{b.logoText}</Text>
                )}
              </View>
              <Text style={styles.brandName} numberOfLines={1}>
                {b.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </>
  );
}

/* ============================================================
   WholesalersView
   ============================================================ */
function WholesalersView() {
  return (
    <>
      <View style={styles.bannerRail}>
        {wholesalerBanners.slice(0, 1).map((b) => (
          <View key={b.id} style={[styles.heroBanner, { backgroundColor: '#FCE7F3' }]}>
            <View style={styles.heroText}>
              <Text style={[styles.heroTag, { color: colors.danger }]}>{b.tag}</Text>
              <Text style={[styles.heroTitle, { color: '#7C2D12' }]}>{b.title}</Text>
              <View style={styles.snackDiscount}>
                <Text style={styles.snackDiscountText}>{b.discount}</Text>
              </View>
            </View>
            <Text style={styles.heroEmoji}>{b.emoji}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.wholesaleCats}>
          {wholesalerCategories.map((c) => (
            <Pressable
              key={c.id}
              style={[styles.wholesaleCatCard, { backgroundColor: '#D1FAE5' }]}
            >
              <Text style={styles.wholesaleCatEmoji}>{c.emoji}</Text>
              <Text style={styles.wholesaleCatName}>{c.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Exclusive offers</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {exclusiveOffers.map((o) => (
            <Pressable
              key={o.id}
              style={[styles.exclusiveCard, { backgroundColor: '#FEF3C7' }]}
            >
              <Text style={[styles.exclusiveDiscount, { color: o.textColor }]}>
                {o.discount}
              </Text>
              <Text style={styles.exclusiveArt}>{o.emoji}</Text>
              <Text style={[styles.exclusiveTitle, { color: o.textColor }]}>
                {o.title}
              </Text>
              <Text style={[styles.exclusiveSub, { color: o.textColor }]}>
                {o.subtitle}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

/* ============================================================
   Styles
   ============================================================ */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.muted },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing[6] },

  header: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ondcBadge: {
    flex: 1,
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: '#fff',
  },

  locationBar: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing[4],
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  locationPin: { fontSize: fontSize.base },
  locationPrefix: { fontSize: fontSize.sm, color: colors.mutedFg },
  locationValue: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
    flex: 1,
  },

  searchWrap: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 44,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.foreground,
  },

  tabRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.neutralBorder,
    borderRadius: radius.xl,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabEmoji: { fontSize: 18 },
  tabLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.primary,
    flex: 1,
  },
  tabLabelActive: { color: '#fff' },

  bannerRail: {
    paddingHorizontal: spacing[4],
    paddingTop: 14,
    gap: BANNER_GAP,
  },
  heroBanner: {
    width: BANNER_WIDTH,
    borderRadius: radius.xl,
    padding: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  heroText: { flex: 1 },
  heroTag: {
    fontSize: 9,
    fontWeight: fontWeight.medium,
    color: '#BE185D',
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.medium,
    color: '#5B21B6',
    marginBottom: 2,
  },
  heroSub: {
    fontSize: fontSize.tiny,
    color: '#6B21A8',
    fontWeight: fontWeight.medium,
    marginBottom: 8,
  },
  heroBullet: {
    fontSize: 9,
    color: '#5B21B6',
    fontWeight: fontWeight.medium,
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  heroCta: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1E293B',
    borderRadius: radius.full,
  },
  heroCtaText: {
    fontSize: 10,
    fontWeight: fontWeight.medium,
    color: '#FEF3C7',
  },
  heroEmoji: { fontSize: 56 },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    paddingTop: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.neutralBorder,
  },
  dotActive: {
    width: 16,
    borderRadius: 4,
    backgroundColor: '#6366F1',
  },

  section: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[6],
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
  },
  sectionLink: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },

  distributorCard: {
    width: 140,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: 10,
    marginRight: 10,
  },
  distributorImg: {
    aspectRatio: 1,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  distributorBrand: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
  },
  distributorTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
    marginBottom: 2,
  },
  distributorSub: {
    fontSize: 10,
    color: colors.mutedFg,
  },

  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  brandTile: {
    width: (SCREEN_WIDTH - 32 - 36) / 4,
    alignItems: 'center',
  },
  brandCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 6,
  },
  brandImg: { width: '70%', height: '70%' },
  brandLogoText: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
    color: '#fff',
  },
  brandName: {
    fontSize: 10,
    fontWeight: fontWeight.medium,
    color: colors.neutral,
    textAlign: 'center',
  },

  snackDiscount: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.danger,
    borderRadius: radius.full,
    marginTop: 8,
  },
  snackDiscountText: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.medium,
    color: '#FEF3C7',
  },

  wholesaleCats: {
    flexDirection: 'row',
    gap: 10,
  },
  wholesaleCatCard: {
    flex: 1,
    aspectRatio: 1.05,
    borderRadius: radius.xl,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  wholesaleCatEmoji: { fontSize: 48 },
  wholesaleCatName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
  },

  exclusiveCard: {
    width: 160,
    borderRadius: radius.xl,
    padding: 12,
    marginRight: 8,
  },
  exclusiveDiscount: {
    alignSelf: 'flex-start',
    fontSize: 10,
    fontWeight: fontWeight.medium,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.md,
    marginBottom: 8,
  },
  exclusiveArt: {
    fontSize: 44,
    textAlign: 'center',
    marginVertical: 4,
  },
  exclusiveTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  exclusiveSub: {
    fontSize: 10,
    fontWeight: fontWeight.medium,
    opacity: 0.85,
    marginTop: 2,
  },
});
