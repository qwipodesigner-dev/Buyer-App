import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '../components/Icons';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme/tokens';
import { seller, categories, products } from '../data/mockData';
import type { RootStackScreenProps } from '../navigation/types';

export default function SellerStorefront({
  route,
  navigation,
}: RootStackScreenProps<'Storefront'>) {
  const d = route.params?.distributor;
  const active = d
    ? {
        ...seller,
        name: d.name,
        location: d.location,
        mov: d.mov,
        totalSKUs: d.skuCount,
      }
    : seller;

  const initials = active.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 4)
    .toUpperCase();

  const featured = products.slice(0, 4);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={8}>
          <Icon.Back size={18} />
        </Pressable>
        <Text style={styles.topTitle}>Storefront</Text>
        <Pressable style={styles.iconBtn} hitSlop={8}>
          <Icon.Bell size={18} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroRow}>
            <View style={styles.sellerLogo}>
              <Text style={styles.sellerLogoText}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.sellerNameRow}>
                <Text style={styles.sellerName}>{active.name}</Text>
                <View style={styles.verifiedBadge}>
                  <Icon.Check size={11} color="#fff" />
                </View>
              </View>
              <View style={styles.sellerMeta}>
                <View style={styles.authPill}>
                  <Text style={styles.authPillText}>AUTHORISED</Text>
                </View>
                <Text style={styles.dot}>·</Text>
                <Text style={styles.sellerLoc}>{active.location}</Text>
              </View>
            </View>
          </View>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>MIN ORDER</Text>
              <Text style={styles.statValue}>₹{active.mov.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.statBorder} />
            <View style={styles.stat}>
              <Text style={styles.statLabel}>DELIVERY</Text>
              <Text style={styles.statValue}>Tomorrow</Text>
              <Text style={styles.statSub}>by 11 AM</Text>
            </View>
            <View style={styles.statBorder} />
            <View style={styles.stat}>
              <Text style={styles.statLabel}>CATALOG</Text>
              <Text style={styles.statValue}>{active.totalSKUs}</Text>
              <Text style={styles.statSub}>SKUs</Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Icon.Search size={18} color={colors.mutedFg} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products, brands, SKUs…"
              placeholderTextColor={colors.mutedFg}
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Shop by category</Text>
            <Text style={styles.sectionLink}>See all</Text>
          </View>
          <View style={styles.catGrid}>
            {categories.slice(0, 8).map((c) => (
              <Pressable
                key={c.id}
                style={styles.catTile}
                onPress={() => navigation.navigate('ProductListing', { category: c })}
              >
                <View style={[styles.catIcon, { backgroundColor: c.color }]}>
                  <Text style={styles.catEmoji}>{c.icon}</Text>
                </View>
                <Text style={styles.catName} numberOfLines={2}>
                  {c.name}
                </Text>
                <Text style={styles.catCount}>{c.count} items</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Best sellers */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Best sellers</Text>
            <Text style={styles.sectionLink}>View catalog</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featured.map((p) => (
              <Pressable
                key={p.id}
                style={styles.productCard}
                onPress={() =>
                  navigation.navigate('ProductListing', {
                    category: { id: p.category, name: p.category, icon: '', count: 0, color: '' },
                  })
                }
              >
                <View style={[styles.productImg, { backgroundColor: p.bgColor }]}>
                  <Text style={styles.productEmoji}>{p.image}</Text>
                </View>
                <Text style={styles.productName} numberOfLines={2}>
                  {p.name}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={styles.priceCurrent}>₹{p.variants[0].sellingPrice}</Text>
                  <Text style={styles.priceMrp}>₹{p.variants[0].mrp}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.muted },
  topBar: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { flex: 1, fontSize: fontSize.lg, fontWeight: fontWeight.medium, color: colors.foreground },

  hero: {
    backgroundColor: '#1E3A8A',
    padding: spacing[4],
  },
  heroRow: { flexDirection: 'row', gap: spacing[3], alignItems: 'flex-start' },
  sellerLogo: {
    width: 52, height: 52, borderRadius: radius.xl, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  sellerLogoText: { fontSize: 16, fontWeight: fontWeight.medium, color: '#1E3A8A' },
  sellerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sellerName: { fontSize: fontSize.xl, fontWeight: fontWeight.medium, color: '#fff' },
  verifiedBadge: {
    width: 16, height: 16, borderRadius: 8, backgroundColor: '#3B82F6',
    alignItems: 'center', justifyContent: 'center',
  },
  sellerMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  authPill: {
    backgroundColor: 'rgba(16,185,129,0.18)', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: radius.full,
  },
  authPillText: { fontSize: 10, fontWeight: fontWeight.medium, color: '#A7F3D0', letterSpacing: 0.4 },
  dot: { color: 'rgba(255,255,255,0.5)' },
  sellerLoc: { fontSize: fontSize.xs, color: 'rgba(255,255,255,0.75)' },

  stats: {
    marginTop: 16, flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.xl, padding: 12,
  },
  stat: { flex: 1, alignItems: 'center' },
  statBorder: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.65)', letterSpacing: 0.6, marginBottom: 4 },
  statValue: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: '#fff' },
  statSub: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 1 },

  searchWrap: { paddingHorizontal: spacing[4], paddingTop: spacing[4] },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, height: 44,
    backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl,
  },
  searchInput: { flex: 1, fontSize: fontSize.base, color: colors.foreground },

  section: { paddingHorizontal: spacing[4], paddingTop: spacing[6] },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.foreground },
  sectionLink: { fontSize: fontSize.xs, fontWeight: fontWeight.medium, color: colors.primary },

  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catTile: {
    width: '23.5%', padding: 12, backgroundColor: colors.background,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, alignItems: 'center',
  },
  catIcon: { width: 44, height: 44, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  catEmoji: { fontSize: 22 },
  catName: { fontSize: 11, fontWeight: fontWeight.medium, color: colors.foreground, textAlign: 'center' },
  catCount: { fontSize: 10, color: colors.mutedFg, marginTop: 2 },

  productCard: {
    width: 152, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.xl, padding: 10, marginRight: 10,
  },
  productImg: {
    aspectRatio: 1, borderRadius: radius.lg,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  productEmoji: { fontSize: 44 },
  productName: { fontSize: fontSize.xs, fontWeight: fontWeight.medium, color: colors.foreground, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  priceCurrent: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.foreground },
  priceMrp: { fontSize: 11, color: colors.mutedFg, textDecorationLine: 'line-through' },
});
