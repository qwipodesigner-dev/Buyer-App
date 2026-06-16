import React, { useState, useMemo } from 'react';
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
import { products, seller } from '../data/mockData';
import type { RootStackScreenProps } from '../navigation/types';

const stockLabel: Record<string, string> = {
  available: 'In Stock',
  limited: 'Limited',
  out: 'Out of Stock',
};
const stockColor: Record<string, { bg: string; fg: string; dot: string }> = {
  available: { bg: '#D1FAE5', fg: '#065F46', dot: '#10B981' },
  limited: { bg: '#FEF3C7', fg: '#92400E', dot: '#F59E0B' },
  out: { bg: '#FEE2E2', fg: '#991B1B', dot: '#EF4444' },
};

export default function ProductListing({
  route,
  navigation,
}: RootStackScreenProps<'ProductListing'>) {
  const category = route.params?.category;
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});

  const visible = useMemo(() => {
    if (!category) return products;
    const matches = products.filter((p) => p.category === category.id);
    return matches.length ? matches : products;
  }, [category]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={8}>
          <Icon.Back size={18} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.topTitle}>{category?.name || 'Catalog'}</Text>
          <Text style={styles.topSub}>{seller.name} · {visible.length} products</Text>
        </View>
        <Pressable style={styles.iconBtn} hitSlop={8}>
          <Icon.Search size={18} />
        </Pressable>
        <Pressable style={styles.iconBtn} hitSlop={8}>
          <Icon.Sliders size={18} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 100 }}>
        {visible.map((product) => {
          const activeVar = selectedVariant[product.id] || product.variants[0].id;
          const variant = product.variants.find((v) => v.id === activeVar)!;
          const sc = stockColor[variant.stock];

          return (
            <View key={product.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={[styles.productImg, { backgroundColor: product.bgColor }]}>
                  {product.images?.[0] ? (
                    <Image source={{ uri: product.images[0] }} style={styles.productImgImg} resizeMode="contain" />
                  ) : (
                    <Text style={styles.productEmoji}>{product.image}</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.brandRow}>
                    <View style={styles.brandPill}>
                      <Text style={styles.brandPillText}>{product.brand}</Text>
                    </View>
                    <View style={[styles.stockChip, { backgroundColor: sc.bg }]}>
                      <View style={[styles.stockDot, { backgroundColor: sc.dot }]} />
                      <Text style={[styles.stockText, { color: sc.fg }]}>{stockLabel[variant.stock]}</Text>
                    </View>
                  </View>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <View style={styles.manufacturerPill}>
                    <Text style={styles.manufacturerText}>{product.manufacturer}</Text>
                  </View>
                </View>
              </View>

              {/* Variants */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                {product.variants.map((v) => (
                  <Pressable
                    key={v.id}
                    style={[styles.variantPill, v.id === activeVar && styles.variantPillActive]}
                    onPress={() => setSelectedVariant({ ...selectedVariant, [product.id]: v.id })}
                  >
                    <Text style={[styles.variantPillText, v.id === activeVar && styles.variantPillTextActive]}>
                      {v.size}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              {/* Price row */}
              <View style={styles.priceRow}>
                <View style={{ flex: 1 }}>
                  <View style={styles.priceMainRow}>
                    <Text style={styles.priceCurrent}>₹{variant.sellingPrice}</Text>
                    <Text style={styles.priceMrp}>₹{variant.mrp}</Text>
                  </View>
                  <Text style={styles.priceMeta}>
                    per pc · Case ₹{variant.casePrice.toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.marginBadge}>
                  <Text style={styles.marginText}>{variant.margin}% Margin</Text>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <Pressable style={styles.discountsBtn}>
                  <Text style={styles.discountsText}>Discounts</Text>
                  <Icon.ChevronDown size={12} color="#fff" />
                </Pressable>
                <Pressable style={styles.addBtn}>
                  <Icon.Plus size={12} color="#fff" />
                  <Text style={styles.addText}>Add</Text>
                </Pressable>
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
  iconBtn: {
    width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.muted,
    alignItems: 'center', justifyContent: 'center',
  },
  topTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.medium, color: colors.foreground },
  topSub: { fontSize: fontSize.xs, color: colors.mutedFg, marginTop: 2 },

  card: {
    backgroundColor: colors.background, borderRadius: radius.lg,
    padding: 12, marginBottom: 10, borderWidth: 1, borderColor: colors.border,
  },
  cardTop: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  productImg: {
    width: 64, height: 64, borderRadius: radius.lg, padding: 4,
    alignItems: 'center', justifyContent: 'center',
  },
  productImgImg: { width: '100%', height: '100%' },
  productEmoji: { fontSize: 30 },
  brandRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  brandPill: { backgroundColor: colors.muted, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.md },
  brandPillText: { fontSize: 10, fontWeight: fontWeight.medium, color: colors.neutral, letterSpacing: 0.4 },
  stockChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.md },
  stockDot: { width: 5, height: 5, borderRadius: 2.5 },
  stockText: { fontSize: 10, fontWeight: fontWeight.medium, letterSpacing: 0.4 },
  productName: {
    fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.foreground,
    marginTop: 4, marginBottom: 0,
  },
  manufacturerPill: { alignSelf: 'flex-start', backgroundColor: colors.muted, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.md, marginTop: 4 },
  manufacturerText: { fontSize: 10, fontWeight: fontWeight.medium, color: colors.neutral },

  variantPill: {
    paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, marginRight: 6, backgroundColor: colors.background,
  },
  variantPillActive: { backgroundColor: '#EFF6FF', borderColor: colors.primary },
  variantPillText: { fontSize: 11, fontWeight: fontWeight.medium, color: colors.neutral },
  variantPillTextActive: { color: colors.primary },

  priceRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border, borderStyle: 'dashed',
  },
  priceMainRow: { flexDirection: 'row', alignItems: 'baseline', gap: 5 },
  priceCurrent: { fontSize: fontSize.lg, fontWeight: fontWeight.medium, color: colors.foreground },
  priceMrp: { fontSize: 11, color: colors.mutedFg, textDecorationLine: 'line-through' },
  priceMeta: { fontSize: 11, color: colors.mutedFg, marginTop: 2 },
  marginBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.md },
  marginText: { fontSize: 11, fontWeight: fontWeight.medium, color: '#065F46' },

  actions: {
    flexDirection: 'row', gap: 8, marginTop: 10, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: colors.border, borderStyle: 'dashed',
  },
  discountsBtn: {
    flex: 1, height: 34, backgroundColor: '#10B981', borderRadius: radius.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  discountsText: { fontSize: 12, fontWeight: fontWeight.medium, color: '#fff' },
  addBtn: {
    flex: 1, height: 34, backgroundColor: colors.primary, borderRadius: radius.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  addText: { fontSize: 12, fontWeight: fontWeight.medium, color: '#fff' },
});
