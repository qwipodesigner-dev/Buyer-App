import React, { useState } from 'react';
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
import { notifications as initialNotifs } from '../data/mockData';
import type { AppNotification, NotificationType } from '../types';

type Filter = 'all' | NotificationType;

export default function NotificationsScreen({ navigation }: any) {
  const [tab, setTab] = useState<Filter>('all');
  const [notifs, setNotifs] = useState<AppNotification[]>(initialNotifs);

  const filtered = tab === 'all' ? notifs : notifs.filter((n) => n.type === tab);
  const unread = notifs.filter((n) => n.unread).length;

  const markAll = () => setNotifs(notifs.map((n) => ({ ...n, unread: false })));
  const markOne = (id: string) =>
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  const chips: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'order', label: 'Orders' },
    { id: 'promo', label: 'Offers' },
    { id: 'stock', label: 'Stock' },
    { id: 'system', label: 'System' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable style={styles.iconBtn} onPress={() => navigation?.goBack()} hitSlop={8}>
          <Icon.Back size={18} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.topTitle}>Notifications</Text>
          <Text style={styles.topSub}>{unread} unread</Text>
        </View>
        {unread > 0 && (
          <Pressable onPress={markAll} hitSlop={8}>
            <Text style={styles.markAll}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipBar}
      >
        {chips.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => setTab(c.id)}
            style={[styles.chip, tab === c.id && styles.chipActive]}
          >
            <Text style={[styles.chipText, tab === c.id && styles.chipTextActive]}>
              {c.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
        {filtered.map((n) => (
          <Pressable
            key={n.id}
            onPress={() => markOne(n.id)}
            style={[styles.card, n.unread && styles.cardUnread]}
          >
            <View style={[styles.iconBox, { backgroundColor: n.iconColor }]}>
              <Text style={styles.iconEmoji}>{n.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{n.title}</Text>
                {n.unread && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.body}>{n.body}</Text>
              <Text style={styles.time}>{n.time.toUpperCase()}</Text>
            </View>
          </Pressable>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔕</Text>
            <Text style={styles.emptyTitle}>All caught up</Text>
            <Text style={styles.emptySub}>No notifications in this category.</Text>
          </View>
        )}
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
  markAll: { fontSize: 12, fontWeight: fontWeight.medium, color: colors.primary, padding: 4 },

  chipBar: { paddingHorizontal: 16, paddingVertical: 10, gap: 8, backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6, backgroundColor: colors.muted, borderRadius: radius.full,
  },
  chipActive: { backgroundColor: colors.foreground },
  chipText: { fontSize: 12, fontWeight: fontWeight.medium, color: colors.neutral },
  chipTextActive: { color: '#fff' },

  card: {
    backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.xl, padding: 14, flexDirection: 'row', gap: 12, marginBottom: 8,
  },
  cardUnread: { backgroundColor: '#FAFBFF', borderColor: '#E0E7FF' },
  iconBox: { width: 40, height: 40, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  iconEmoji: { fontSize: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  title: { fontSize: 13, fontWeight: fontWeight.medium, color: colors.foreground, flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  body: { fontSize: 12, color: colors.neutral, lineHeight: 17, marginBottom: 6 },
  time: { fontSize: 10, color: colors.mutedFg, fontWeight: fontWeight.medium, letterSpacing: 0.5 },

  empty: { alignItems: 'center', padding: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.foreground, marginBottom: 4 },
  emptySub: { fontSize: 12, color: colors.mutedFg, textAlign: 'center' },
});
