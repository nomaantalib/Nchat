import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import ChatItem from '../components/ChatItem';

const mockChats = [
  { id: '1', name: 'Rahul Sharma', preview: 'Tap to chat', time: '10:30 AM', unread: 2 },
  { id: '2', name: 'Priya Patel', preview: 'See you tomorrow!', time: '9:15 AM', unread: 0 },
  { id: '3', name: 'Amit Kumar', preview: 'Thanks!', time: 'Yesterday', unread: 1 },
  { id: '4', name: 'Neha Gupta', preview: 'Are we still on for the meeting?', time: 'Yesterday', unread: 0 },
];

export default function ChatsScreen({ navigation }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={mockChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem 
            item={item} 
            onPress={() => navigation.navigate('ChatRoom', { chatName: item.name })}
          />
        )}
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

