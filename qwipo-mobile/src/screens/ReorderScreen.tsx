import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '../components/Icons';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme/tokens';
import { reorderHistory, products } from '../data/mockData';

export default function ReorderScreen() {
  const [tab, setTab] = useState<'distributor' | 'wholesaler'>('distributor');
  const visible = reorderHistory.filter((h) => h.sellerType === tab);

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.topTitle}>Reorder</Text>
          <Text style={styles.topSub}>Quick re-buy from your purchase history</Text>
        </View>
        <Pressable style={styles.iconBtn} hitSlop={8}>
          <Icon.Search size={18} />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tab, tab === 'distributor' && styles.tabActive]}
          onPress={() => setTab('distributor')}
        >
          <View style={[styles.tabIcon, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.tabEmoji}>📦</Text>
          </View>
          <Text style={[styles.tabLabel, tab === 'distributor' && styles.tabLabelActive]}>
            Distributors
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, tab === 'wholesaler' && styles.tabActive]}
          onPress={() => setTab('wholesaler')}
        >
          <View style={[styles.tabIcon, { backgroundColor: '#FED7AA' }]}>
            <Text style={styles.tabEmoji}>🏪</Text>
          </View>
          <Text style={[styles.tabLabel, tab === 'wholesaler' && styles.tabLabelActive]}>
            Wholesalers
          </Text>
        </Pressable>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          <Text style={styles.summaryBold}>{visible.length} items</Text> available to reorder
        </Text>
        <Pressable style={styles.bulkBtn}>
          <Text style={styles.bulkBtnText}>+ Reorder all</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {visible.map((h) => {
          const product = products.find((p) => p.id === h.productId);
          if (!product) return null;
          const variant = product.variants.find((v) => v.id === h.variantId) ?? product.variants[0];
          return (
            <View key={h.productId + h.variantId} style={styles.card}>
              <View style={[styles.cardImg, { backgroundColor: product.bgColor }]}>
                {product.images?.[0] ? (
                  <Image source={{ uri: product.images[0] }} style={styles.cardImgImg} resizeMode="contain" />
                ) : (
                  <Text style={styles.cardEmoji}>{product.image}</Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.brandPill}>
                  <Text style={styles.brandPillText}>{product.brand}</Text>
                </View>
                <Text style={styles.cardName} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.cardVariant}>
                  {variant.size} · {variant.casePack}
                </Text>
                <View style={styles.meta}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>LAST ORDERED</Text>
                    <Text style={styles.metaValue}>{formatDate(h.lastOrderedAt)}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>LAST QTY</Text>
                    <Text style={styles.metaValue}>{h.lastQty} pcs</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>ORDERED</Text>
                    <Text style={styles.metaValue}>{h.timesOrdered}×</Text>
                  </View>
                </View>
                <View style={styles.foot}>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>₹{variant.sellingPrice}</Text>
                    <Text style={styles.mrp}>₹{variant.mrp}</Text>
                    <View style={styles.marginPill}>
                      <Text style={styles.marginText}>{variant.margin}%</Text>
                    </View>
                  </View>
                  <Pressable style={styles.reorderBtn}>
                    <Icon.Reorder size={13} color="#fff" />
                    <Text style={styles.reorderBtnText}>Reorder</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.muted },
  topBar: {
    backgroundColor: colors.background, paddingHorizontal: spacing[4], paddingVertical: spacing[3],
    flexDirection: 'row', alignItems: 'center', gap: spacing[3],
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  topTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.medium, color: colors.foreground },
  topSub: { fontSize: fontSize.xs, color: colors.mutedFg, marginTop: 2 },
  iconBtn: {
    width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.muted,
    alignItems: 'center', justifyContent: 'center',
  },

  tabRow: { flexDirection: 'row', gap: 10, paddingHorizontal: spacing[4], paddingTop: spacing[3] },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10,
    backgroundColor: colors.background, borderWidth: 1.5, borderColor: colors.neutralBorder, borderRadius: radius.xl,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabIcon: { width: 38, height: 38, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  tabEmoji: { fontSize: 18 },
  tabLabel: { fontSize: fontSize.xs, fontWeight: fontWeight.medium, color: colors.primary, flex: 1 },
  tabLabelActive: { color: '#fff' },

  summary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing[4], paddingTop: 14,
  },
  summaryText: { fontSize: 12, color: colors.mutedFg },
  summaryBold: { color: colors.foreground, fontWeight: fontWeight.medium },
  bulkBtn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#EFF6FF', borderRadius: radius.lg },
  bulkBtnText: { fontSize: 12, fontWeight: fontWeight.medium, color: colors.primary },

  card: {
    backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.xl, padding: 12, marginBottom: 10, flexDirection: 'row', gap: 12,
  },
  cardImg: { width: 72, height: 72, borderRadius: radius.lg, padding: 6, alignItems: 'center', justifyContent: 'center' },
  cardImgImg: { width: '100%', height: '100%' },
  cardEmoji: { fontSize: 32 },
  brandPill: { alignSelf: 'flex-start', backgroundColor: colors.muted, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.md },
  brandPillText: { fontSize: 10, fontWeight: fontWeight.medium, color: colors.neutral, letterSpacing: 0.4 },
  cardName: { fontSize: 13, fontWeight: fontWeight.medium, color: colors.foreground, marginTop: 4 },
  cardVariant: { fontSize: 11, color: colors.mutedFg, marginTop: 2 },
  meta: {
    flexDirection: 'row', gap: 10, marginTop: 8, paddingVertical: 6,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border, borderStyle: 'dashed',
  },
  metaItem: { flex: 1 },
  metaLabel: { fontSize: 9, color: '#9CA3AF', fontWeight: fontWeight.medium, letterSpacing: 0.4 },
  metaValue: { fontSize: 11, color: colors.foreground, fontWeight: fontWeight.medium, marginTop: 1 },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  price: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.foreground },
  mrp: { fontSize: 11, color: colors.mutedFg, textDecorationLine: 'line-through' },
  marginPill: { backgroundColor: '#D1FAE5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.md },
  marginText: { fontSize: 10, fontWeight: fontWeight.medium, color: '#065F46' },
  reorderBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, height: 32,
    backgroundColor: colors.foreground, borderRadius: radius.lg,
  },
  reorderBtnText: { fontSize: 12, fontWeight: fontWeight.medium, color: '#fff' },
});
