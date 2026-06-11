import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '../components/Icons';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme/tokens';
import { initialCart } from '../data/mockData';

export default function MultiSellerCart({ navigation }: any) {
  // Compute per-seller subtotal, MOV met, savings
  const sellerData = initialCart.sellers.map((s) => {
    let sub = 0;
    let mrp = 0;
    let schemeSav = 0;
    s.items.forEach((i) => {
      const it = i.price * i.quantity;
      sub += it;
      mrp += i.mrp * i.quantity;
      if (i.extraDiscount) schemeSav += it * i.extraDiscount;
      if (i.flatOff) schemeSav += i.flatOff;
    });
    const final = sub - schemeSav;
    const met = final >= s.mov;
    const pct = Math.min((final / s.mov) * 100, 100);
    return { ...s, sub, mrp, schemeSav, final, met, pct, savings: mrp - final };
  });

  const grand = sellerData.reduce((a, s) => a + s.final, 0);
  const savings = sellerData.reduce((a, s) => a + s.savings, 0);
  const canCheckout = sellerData.every((s) => s.met);
  const ready = sellerData.filter((s) => s.met).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={8}>
          <Icon.Back size={18} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.topTitle}>Your cart</Text>
          <Text style={styles.topSub}>
            {initialCart.sellers.length} sellers ·{' '}
            {initialCart.sellers.reduce((n, s) => n + s.items.length, 0)} items
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 200 }}>
        {/* Savings banner */}
        {savings > 0 && (
          <View style={styles.savings}>
            <View style={styles.savingsIcon}>
              <Icon.Tag size={18} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.savingsTitle}>
                You're saving ₹{Math.round(savings).toLocaleString('en-IN')}
              </Text>
              <Text style={styles.savingsSub}>Discounts and schemes applied</Text>
            </View>
          </View>
        )}

        {sellerData.map((s) => (
          <View key={s.id} style={styles.sellerBlock}>
            <View style={styles.sellerHead}>
              <View style={[styles.sellerLogo, { backgroundColor: s.logoColor }]}>
                <Text style={styles.sellerLogoText}>{s.logo}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sellerName}>{s.name}</Text>
                <View style={styles.deliveryRow}>
                  <Icon.Truck size={12} color={colors.mutedFg} />
                  <Text style={styles.deliveryText}>Delivery: {s.deliveryTime}</Text>
                </View>
              </View>
            </View>

            {/* MOV bar */}
            <View style={styles.movBlock}>
              <View style={styles.movRow}>
                <Text style={styles.movLabel}>Minimum Order Value</Text>
                <Text style={[styles.movStatus, { color: s.met ? '#059669' : '#D97706' }]}>
                  {s.met
                    ? '✓ MOV Met'
                    : `₹${Math.round(s.mov - s.final).toLocaleString('en-IN')} to go`}
                </Text>
              </View>
              <View style={styles.movBar}>
                <View
                  style={[
                    styles.movFill,
                    { width: `${s.pct}%`, backgroundColor: s.met ? '#10B981' : '#F59E0B' },
                  ]}
                />
              </View>
              <View style={styles.movDetail}>
                <Text style={styles.movDetailText}>
                  Current: <Text style={styles.movDetailBold}>₹{Math.round(s.final).toLocaleString('en-IN')}</Text>
                </Text>
                <Text style={styles.movDetailText}>
                  MOV: <Text style={styles.movDetailBold}>₹{s.mov.toLocaleString('en-IN')}</Text>
                </Text>
              </View>
            </View>

            {/* Items */}
            <View style={styles.items}>
              {s.items.map((item, idx) => (
                <View key={idx} style={styles.item}>
                  <View style={[styles.itemImg, { backgroundColor: item.bgColor }]}>
                    <Text style={styles.itemEmoji}>{item.image}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemVariant}>
                      {item.variant} · {item.brand}
                    </Text>
                    <View style={styles.itemPricing}>
                      <Text style={styles.itemPrice}>₹{item.price}</Text>
                      <Text style={styles.itemMrp}>₹{item.mrp}</Text>
                    </View>
                    {item.scheme && (
                      <View style={styles.schemeTag}>
                        <Icon.Gift size={10} color="#92400E" />
                        <Text style={styles.schemeText}>{item.scheme}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.qty}>
                    <Pressable style={styles.qtyBtn}><Icon.Minus size={12} color={colors.foreground} /></Pressable>
                    <Text style={styles.qtyVal}>{item.quantity}</Text>
                    <Pressable style={styles.qtyBtn}><Icon.Plus size={12} color={colors.foreground} /></Pressable>
                  </View>
                </View>
              ))}
            </View>

            {/* Seller subtotal */}
            <View style={styles.subtotal}>
              <View style={styles.subRow}>
                <Text style={styles.subRowLabel}>Item total ({s.items.reduce((n, i) => n + i.quantity, 0)} pcs)</Text>
                <Text style={styles.subRowVal}>₹{s.sub.toLocaleString('en-IN')}</Text>
              </View>
              {s.schemeSav > 0 && (
                <View style={styles.subRow}>
                  <Text style={styles.subRowLabel}>Scheme savings</Text>
                  <Text style={[styles.subRowVal, { color: '#059669' }]}>
                    - ₹{Math.round(s.schemeSav).toLocaleString('en-IN')}
                  </Text>
                </View>
              )}
              <View style={[styles.subRow, styles.subRowBold]}>
                <Text style={styles.subRowBoldText}>Seller subtotal</Text>
                <Text style={styles.subRowBoldText}>₹{Math.round(s.final).toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Sticky footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.footerLabel}>Grand total</Text>
            <Text style={styles.footerTotal}>₹{Math.round(grand).toLocaleString('en-IN')}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.footerSavings}>You saved ₹{Math.round(savings).toLocaleString('en-IN')}</Text>
            <Text style={styles.footerStatus}>{ready}/{initialCart.sellers.length} sellers ready</Text>
          </View>
        </View>
        <Pressable
          style={[styles.checkoutBtn, !canCheckout && styles.checkoutBtnDisabled]}
          disabled={!canCheckout}
        >
          <Text style={styles.checkoutText}>
            {canCheckout ? 'Proceed to checkout' : 'Add more items to checkout'}
          </Text>
        </Pressable>
      </View>
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

  savings: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12,
    backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0', borderRadius: radius.lg,
    marginBottom: 14,
  },
  savingsIcon: { width: 36, height: 36, borderRadius: radius.lg, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  savingsTitle: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: '#065F46' },
  savingsSub: { fontSize: 11, color: '#047857', marginTop: 1 },

  sellerBlock: { backgroundColor: colors.background, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, marginBottom: 14 },
  sellerHead: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  sellerLogo: { width: 36, height: 36, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  sellerLogoText: { color: '#fff', fontSize: 12, fontWeight: fontWeight.medium },
  sellerName: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.foreground },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  deliveryText: { fontSize: 11, color: colors.mutedFg },

  movBlock: { padding: 14, backgroundColor: '#FAFBFF' },
  movRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  movLabel: { fontSize: 11, fontWeight: fontWeight.medium, color: colors.neutral },
  movStatus: { fontSize: 11, fontWeight: fontWeight.medium },
  movBar: { height: 6, backgroundColor: colors.neutralBorder, borderRadius: 999, overflow: 'hidden', marginBottom: 6 },
  movFill: { height: '100%', borderRadius: 999 },
  movDetail: { flexDirection: 'row', justifyContent: 'space-between' },
  movDetailText: { fontSize: 11, color: colors.mutedFg },
  movDetailBold: { color: colors.foreground, fontWeight: fontWeight.medium },

  items: { paddingHorizontal: 14 },
  item: { flexDirection: 'row', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  itemImg: { width: 56, height: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  itemEmoji: { fontSize: 26 },
  itemName: { fontSize: 12, fontWeight: fontWeight.medium, color: colors.foreground },
  itemVariant: { fontSize: 11, color: colors.mutedFg, marginTop: 2 },
  itemPricing: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  itemPrice: { fontSize: 13, fontWeight: fontWeight.medium, color: colors.foreground },
  itemMrp: { fontSize: 11, color: colors.mutedFg, textDecorationLine: 'line-through' },
  schemeTag: {
    flexDirection: 'row', alignItems: 'center', gap: 3, alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.md, marginTop: 6,
  },
  schemeText: { fontSize: 10, fontWeight: fontWeight.medium, color: '#92400E' },

  qty: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, alignSelf: 'flex-end', height: 28,
  },
  qtyBtn: { width: 28, height: '100%', alignItems: 'center', justifyContent: 'center' },
  qtyVal: { width: 30, textAlign: 'center', fontSize: 12, fontWeight: fontWeight.medium, color: colors.foreground },

  subtotal: { padding: 14, backgroundColor: '#FAFBFF', borderTopWidth: 1, borderTopColor: colors.border, gap: 6 },
  subRow: { flexDirection: 'row', justifyContent: 'space-between' },
  subRowLabel: { fontSize: 11, color: colors.mutedFg },
  subRowVal: { fontSize: 11, color: colors.foreground },
  subRowBold: { paddingTop: 6, borderTopWidth: 1, borderTopColor: colors.neutralBorder },
  subRowBoldText: { fontSize: 13, fontWeight: fontWeight.medium, color: colors.foreground },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.background, padding: 16, paddingBottom: 24,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  footerLabel: { fontSize: 11, color: colors.mutedFg },
  footerTotal: { fontSize: 22, fontWeight: fontWeight.medium, color: colors.foreground, letterSpacing: -0.3 },
  footerSavings: { fontSize: 11, color: '#059669', fontWeight: fontWeight.medium },
  footerStatus: { fontSize: 11, color: colors.mutedFg, marginTop: 2 },
  checkoutBtn: {
    height: 48, backgroundColor: colors.primary, borderRadius: radius.xl,
    alignItems: 'center', justifyContent: 'center',
  },
  checkoutBtnDisabled: { backgroundColor: colors.neutralBorder },
  checkoutText: { fontSize: 14, fontWeight: fontWeight.medium, color: '#fff' },
});
