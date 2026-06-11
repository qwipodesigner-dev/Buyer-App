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
import { userProfile } from '../data/mockData';

export default function ProfileScreen() {
  const initials = userProfile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const creditPct = (userProfile.creditUsed / userProfile.creditLimit) * 100;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>My Account</Text>
        <Pressable style={styles.iconBtn} hitSlop={8}>
          <Icon.Settings size={18} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{userProfile.name}</Text>
            {userProfile.kycVerified && (
              <View style={styles.verified}>
                <Icon.Check size={11} color="#fff" />
              </View>
            )}
          </View>
          <Text style={styles.business}>{userProfile.businessName}</Text>
          <Text style={styles.meta}>
            {userProfile.businessType} · {userProfile.location}
          </Text>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{userProfile.totalOrders}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statBorder} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                ₹{userProfile.totalSavings.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statBorder} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{userProfile.memberSince}</Text>
              <Text style={styles.statLabel}>Member since</Text>
            </View>
          </View>
        </View>

        {/* Credit */}
        <View style={styles.section}>
          <Pressable style={styles.credit}>
            <View style={styles.creditHead}>
              <View>
                <Text style={styles.creditLabel}>QWIPO CREDIT</Text>
                <Text style={styles.creditValue}>
                  ₹{(userProfile.creditLimit - userProfile.creditUsed).toLocaleString('en-IN')} available
                </Text>
              </View>
              <View style={styles.creditCta}>
                <Text style={styles.creditCtaText}>View →</Text>
              </View>
            </View>
            <View style={styles.creditBar}>
              <View style={[styles.creditBarFill, { width: `${creditPct}%` }]} />
            </View>
            <View style={styles.creditDetail}>
              <Text style={styles.creditDetailText}>
                Used: <Text style={styles.creditDetailBold}>₹{userProfile.creditUsed.toLocaleString('en-IN')}</Text>
              </Text>
              <Text style={styles.creditDetailText}>
                Limit: <Text style={styles.creditDetailBold}>₹{userProfile.creditLimit.toLocaleString('en-IN')}</Text>
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Business details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BUSINESS DETAILS</Text>
          <View style={styles.cardSection}>
            <Row label="Phone" value={userProfile.phone} />
            <Row label="Email" value={userProfile.email} />
            <Row label="GST" value={userProfile.gst} mono />
            <Row label="FSSAI" value={userProfile.fssai} mono last />
          </View>
        </View>

        {/* Menus */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          <View style={styles.cardSection}>
            <MenuItem icon="📍" label="Saved addresses" detail="3 addresses" />
            <MenuItem icon="🚚" label="Track orders" detail="2 in transit" />
            <MenuItem icon="💳" label="Payment methods" detail="UPI, Card, Credit" />
            <MenuItem icon="📄" label="Tax invoices" detail="Download GST reports" />
            <MenuItem icon="🎁" label="Refer & earn" detail="Earn ₹500 per referral" last />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SETTINGS & SUPPORT</Text>
          <View style={styles.cardSection}>
            <MenuItem icon="🔔" label="Notification preferences" />
            <MenuItem icon="🌐" label="Language" detail="English" />
            <MenuItem icon="🆘" label="Help & support" />
            <MenuItem icon="📜" label="Terms & privacy" />
            <MenuItem icon="🚪" label="Sign out" danger last />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  label,
  value,
  mono,
  last,
}: {
  label: string;
  value: string;
  mono?: boolean;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, mono && { fontFamily: 'Menlo' }]}>{value}</Text>
    </View>
  );
}

function MenuItem({
  icon,
  label,
  detail,
  danger,
  last,
}: {
  icon: string;
  label: string;
  detail?: string;
  danger?: boolean;
  last?: boolean;
}) {
  return (
    <Pressable style={[styles.menu, last && styles.menuLast]}>
      <View
        style={[
          styles.menuIcon,
          { backgroundColor: danger ? '#FEE2E2' : colors.muted },
        ]}
      >
        <Text style={styles.menuIconEmoji}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.menuLabel, danger && { color: '#DC2626' }]}>{label}</Text>
        {detail && <Text style={styles.menuDetail}>{detail}</Text>}
      </View>
      <Icon.ChevronRight size={14} color={colors.mutedFg} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.muted },
  topBar: {
    backgroundColor: colors.background, paddingHorizontal: spacing[4], paddingVertical: spacing[3],
    flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  topTitle: { flex: 1, fontSize: fontSize.lg, fontWeight: fontWeight.medium, color: colors.foreground, paddingLeft: 4 },
  iconBtn: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.muted, alignItems: 'center', justifyContent: 'center' },

  hero: { backgroundColor: '#1E3A8A', padding: 22, alignItems: 'center' },
  avatar: {
    width: 68, height: 68, borderRadius: 34, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { fontSize: 22, fontWeight: fontWeight.medium, color: '#1E3A8A' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: fontSize.xl, fontWeight: fontWeight.medium, color: '#fff' },
  verified: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  business: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: fontWeight.medium, marginTop: 2 },
  meta: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  stats: {
    marginTop: 16, flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.xl, padding: 12, alignSelf: 'stretch',
  },
  stat: { flex: 1, alignItems: 'center' },
  statBorder: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  statValue: { fontSize: 14, fontWeight: fontWeight.medium, color: '#fff' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  section: { paddingHorizontal: spacing[4], paddingTop: spacing[4] },
  sectionTitle: { fontSize: 11, fontWeight: fontWeight.medium, color: colors.mutedFg, letterSpacing: 0.6, marginBottom: 10 },

  credit: {
    backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#A7F3D0',
    borderRadius: radius.xl, padding: 14,
  },
  creditHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  creditLabel: { fontSize: 11, fontWeight: fontWeight.medium, color: '#065F46', letterSpacing: 0.4 },
  creditValue: { fontSize: fontSize.xl, fontWeight: fontWeight.medium, color: '#065F46', marginTop: 2 },
  creditCta: { backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.lg },
  creditCtaText: { fontSize: 11, fontWeight: fontWeight.medium, color: '#fff' },
  creditBar: { height: 6, backgroundColor: 'rgba(16,185,129,0.25)', borderRadius: 3, marginTop: 10, overflow: 'hidden' },
  creditBarFill: { height: '100%', backgroundColor: '#10B981', borderRadius: 3 },
  creditDetail: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  creditDetailText: { fontSize: 11, color: colors.mutedFg },
  creditDetailBold: { color: colors.foreground, fontWeight: fontWeight.medium },

  cardSection: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, overflow: 'hidden' },

  row: { padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: { fontSize: 12, color: colors.mutedFg },
  rowValue: { fontSize: 12, fontWeight: fontWeight.medium, color: colors.foreground },

  menu: { padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuLast: { borderBottomWidth: 0 },
  menuIcon: { width: 32, height: 32, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  menuIconEmoji: { fontSize: 16 },
  menuLabel: { fontSize: 13, fontWeight: fontWeight.medium, color: colors.foreground },
  menuDetail: { fontSize: 11, color: colors.mutedFg, marginTop: 1 },
});
