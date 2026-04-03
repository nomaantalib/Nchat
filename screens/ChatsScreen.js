import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import ChatItem from '../components/ChatItem';
import api from '../services/api';

export default function ChatsScreen({ navigation }) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    try {
      const response = await api.get('/chats');
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const getOtherUser = (users) => {
    if (!users || users.length < 2) return { name: 'Unknown', pic: '' };
    return users[0]._id === currentUser._id ? users[1] : users[0];
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
      ) : chats.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: theme.textLight }}>No chats yet. Start a conversation!</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const otherUser = getOtherUser(item.users);
            const formattedItem = {
              name: item.isGroupChat ? item.chatName : otherUser.name,
              preview: item.latestMessage ? item.latestMessage.content : 'Tap to chat',
              time: item.latestMessage 
                    ? new Date(item.latestMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    : '',
              unread: 0,
            };

            return (
              <ChatItem 
                item={formattedItem} 
                onPress={() => navigation.navigate('ChatRoom', { 
                  chatId: item._id, 
                  chatName: formattedItem.name 
                })}
              />
            );
          }}
          contentContainerStyle={{ padding: 8 }}
        />
      )}
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

