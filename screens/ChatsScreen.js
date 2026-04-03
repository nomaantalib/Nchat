import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const mockChats = [
  { id: '1', name: 'Rahul Sharma', preview: 'Tap to chat', time: '10:30 AM', unread: 2 },
  { id: '2', name: 'Priya Patel', preview: 'See you tomorrow!', time: '9:15 AM', unread: 0 },
  { id: '3', name: 'Amit Kumar', preview: 'Thanks!', time: 'Yesterday', unread: 1 },
  { id: '4', name: 'Neha Gupta', preview: 'Are we still on for the meeting?', time: 'Yesterday', unread: 0 },
];

export default function ChatsScreen() {
  const { theme } = useTheme();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.chatItem, { borderBottomColor: theme.border }]}>
      <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, { color: theme.textDark }]}>{item.name}</Text>
          <Text style={[styles.time, { color: theme.primary }]}>{item.time}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={[styles.preview, { color: theme.textLight }]} numberOfLines={1}>
            {item.preview}
          </Text>
          {item.unread > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.primary }]}>
              <Text style={styles.badgeText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={mockChats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 8 }}
      />
      <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]}>
        <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preview: {
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});
