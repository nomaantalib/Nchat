import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const mockCalls = [
  { id: '1', name: 'Rahul Sharma', time: 'Today, 10:30 AM', type: 'video', direction: 'incoming', missed: false },
  { id: '2', name: 'Priya Patel', time: 'Today, 9:15 AM', type: 'audio', direction: 'incoming', missed: true },
  { id: '3', name: 'Amit Kumar', time: 'Yesterday, 3:40 PM', type: 'video', direction: 'outgoing', missed: false },
  { id: '4', name: 'Neha Gupta', time: 'Yesterday, 11:02 AM', type: 'audio', direction: 'incoming', missed: false },
  { id: '5', name: 'Rohit Singh', time: 'Mon, 8:20 PM', type: 'video', direction: 'outgoing', missed: false },
  { id: '6', name: 'Ananya Verma', time: 'Sun, 7:50 PM', type: 'audio', direction: 'incoming', missed: true },
];

const AVATAR_COLORS = ['#00BCD4', '#FF6B6B', '#4CAF50', '#FF9800', '#9C27B0', '#2196F3'];

export default function CallsScreen({ navigation }) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('all'); // all, missed

  const filteredCalls = activeTab === 'missed' ? mockCalls.filter(c => c.missed) : mockCalls;

  const renderItem = ({ item, index }) => {
    const isMissed = item.missed;
    const isOutgoing = item.direction === 'outgoing';
    const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

    return (
      <TouchableOpacity
        style={[styles.callItem, { borderBottomColor: theme.border, backgroundColor: theme.headerBg }]}
        onLongPress={() => Alert.alert('Call Options', `Delete call log for ${item.name}?`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => {} },
        ])}
      >
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.callInfo}>
          <Text style={[styles.callName, { color: isMissed ? '#FF4B4B' : theme.textDark }]}>
            {item.name}
          </Text>
          <View style={styles.callMeta}>
            <Ionicons
              name={isOutgoing ? 'arrow-up-circle' : 'arrow-down-circle'}
              size={14}
              color={isMissed ? '#FF4B4B' : isOutgoing ? theme.primary : '#4CAF50'}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.callType, { color: theme.textLight }]}>
              {item.type === 'video' ? 'Video' : 'Voice'} · {item.time}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.callbackBtn, { borderColor: theme.primary }]}
          onPress={() => navigation.navigate('CallScreen', { roomId: item.id, isHost: true })}
        >
          <Ionicons
            name={item.type === 'video' ? 'videocam-outline' : 'call-outline'}
            size={20}
            color={theme.primary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Tab Bar */}
      <View style={[styles.tabRow, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        {['all', 'missed'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && { borderBottomColor: theme.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? theme.primary : theme.textLight, fontWeight: activeTab === tab ? '800' : '500' }]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'missed' && <Text style={{ color: '#FF4B4B' }}> {mockCalls.filter(c => c.missed).length}</Text>}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredCalls}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator
        indicatorStyle={theme.isDark ? 'white' : 'black'}
        scrollIndicatorInsets={{ right: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="call-outline" size={60} color={theme.textLight} />
            <Text style={[styles.emptyText, { color: theme.textLight }]}>No missed calls</Text>
          </View>
        }
      />

      {/* New Call FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('CallScreen', { roomId: 'new-' + Date.now(), isHost: true })}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabRow: {
    flexDirection: 'row', borderBottomWidth: 1,
    paddingHorizontal: 20, paddingTop: 8,
  },
  tab: { flex: 1, alignItems: 'center', paddingBottom: 12, marginHorizontal: 4 },
  tabText: { fontSize: 15 },
  callItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, marginHorizontal: 12,
    marginTop: 6, borderRadius: 14,
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 20 },
  callInfo: { flex: 1 },
  callName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  callMeta: { flexDirection: 'row', alignItems: 'center' },
  callType: { fontSize: 13 },
  callbackBtn: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1.5,
  },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 16, marginTop: 12 },
  fab: {
    position: 'absolute', bottom: 24, right: 20,
    width: 58, height: 58, borderRadius: 29,
    justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: '#000', shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 6,
  },
});
