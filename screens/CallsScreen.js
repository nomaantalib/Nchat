import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const mockCalls = [
  { id: '1', name: 'Rahul Sharma', time: 'Today, 10:30 AM', type: 'audio', missed: false },
  { id: '2', name: 'Priya Patel', time: 'Yesterday, 9:15 AM', type: 'video', missed: true },
];

export default function CallsScreen() {
  const { theme } = useTheme();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.callItem, { borderBottomColor: theme.border }]}>
      <View style={[styles.avatar, { backgroundColor: theme.primaryDark }]}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.callInfo}>
        <Text style={[styles.callName, { color: item.missed ? '#fa3e3e' : theme.textDark }]}>
          {item.name}
        </Text>
        <View style={styles.callDetails}>
          <Ionicons 
            name={item.missed ? 'arrow-down-left' : 'arrow-up-right'} 
            size={16} 
            color={item.missed ? '#fa3e3e' : theme.secondary} 
          />
          <Text style={[styles.time, { color: theme.textLight }]}>{item.time}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.actionIcon}>
        <Ionicons 
          name={item.type === 'video' ? 'videocam' : 'call'} 
          size={24} 
          color={theme.primary} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={mockCalls}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 8 }}
      />
      <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]}>
        <Ionicons name="call" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  callItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
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
  callInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  callName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  callDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    marginLeft: 5,
  },
  actionIcon: {
    padding: 10,
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
