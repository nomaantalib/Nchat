import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, TextInput, Modal, Image, Animated
} from 'react-native';
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
  const [search, setSearch] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const fetchChats = async () => {
    try {
      const res = await api.get('/chats');
      setChats(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChats(); }, []);

  // Search users for new chat
  const handleUserSearch = async (text) => {
    setUserSearch(text);
    if (!text.trim()) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await api.get(`/auth/users?search=${text}`);
      setSearchResults(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const startChat = async (userId) => {
    try {
      setShowNewChat(false);
      const res = await api.post('/chats', { userId });
      navigation.navigate('ChatRoom', {
        chatId: res.data._id,
        chatName: res.data.isGroupChat ? res.data.chatName : res.data.users.find(u => u._id !== currentUser._id)?.name,
      });
      fetchChats();
    } catch (e) {
      console.error(e);
    }
  };

  const getOtherUser = (users) => {
    if (!users || users.length < 2) return { name: 'Unknown', pic: '' };
    return users[0]._id === currentUser._id ? users[1] : users[0];
  };

  const filtered = chats.filter(c => {
    const other = getOtherUser(c.users);
    const name = c.isGroupChat ? c.chatName : other.name;
    return name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: theme.headerBg, borderColor: theme.border }]}>
        <Ionicons name="search" size={18} color={theme.textLight} style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.searchInput, { color: theme.textDark }]}
          placeholder="Search chats..."
          placeholderTextColor={theme.textLight}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={theme.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 30 }} />
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color={theme.textLight} />
          <Text style={[styles.emptyText, { color: theme.textLight }]}>No chats yet</Text>
          <Text style={[styles.emptySubText, { color: theme.textLight }]}>Tap + to start a new conversation</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator
          indicatorStyle={theme.isDark ? 'white' : 'black'}
          scrollIndicatorInsets={{ right: 1 }}
          renderItem={({ item }) => {
            const other = getOtherUser(item.users);
            const formattedItem = {
              name: item.isGroupChat ? item.chatName : other.name,
              pic: other.pic,
              preview: item.latestMessage?.content || 'Tap to start chatting',
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
                  chatName: formattedItem.name,
                  chatPic: formattedItem.pic,
                })}
              />
            );
          }}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      {/* New Chat FAB */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]} onPress={() => setShowNewChat(true)}>
        <Ionicons name="create-outline" size={26} color="#fff" />
      </TouchableOpacity>

      {/* New Chat Modal */}
      <Modal visible={showNewChat} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.headerBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textDark }]}>New Chat</Text>
              <TouchableOpacity onPress={() => { setShowNewChat(false); setUserSearch(''); setSearchResults([]); }}>
                <Ionicons name="close" size={26} color={theme.textLight} />
              </TouchableOpacity>
            </View>

            <View style={[styles.searchBar, { backgroundColor: theme.background, borderColor: theme.border, marginBottom: 10 }]}>
              <Ionicons name="search" size={18} color={theme.textLight} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.searchInput, { color: theme.textDark }]}
                placeholder="Search by name or email..."
                placeholderTextColor={theme.textLight}
                value={userSearch}
                onChangeText={handleUserSearch}
                autoFocus
              />
            </View>

            {searching && <ActivityIndicator color={theme.primary} style={{ marginTop: 10 }} />}

            <FlatList
              data={searchResults}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={
                userSearch.length > 0 && !searching ? (
                  <Text style={[styles.noResults, { color: theme.textLight }]}>No users found</Text>
                ) : null
              }
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.userRow, { borderBottomColor: theme.border }]} onPress={() => startChat(item._id)}>
                  <View style={[styles.userAvatar, { backgroundColor: theme.primary }]}>
                    {item.pic ? (
                      <Image source={{ uri: item.pic }} style={styles.userAvatarImg} />
                    ) : (
                      <Text style={styles.userAvatarText}>{item.name?.charAt(0).toUpperCase()}</Text>
                    )}
                  </View>
                  <View>
                    <Text style={[styles.userName, { color: theme.textDark }]}>{item.name}</Text>
                    <Text style={[styles.userEmail, { color: theme.textLight }]}>{item.email}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 80 },
  emptyText: { fontSize: 18, fontWeight: '700', marginTop: 16 },
  emptySubText: { fontSize: 14, marginTop: 6 },
  fab: {
    position: 'absolute', bottom: 24, right: 20,
    width: 58, height: 58, borderRadius: 29,
    justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: '#000', shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 6,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%', minHeight: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  userAvatar: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginRight: 14, overflow: 'hidden' },
  userAvatarImg: { width: 46, height: 46, borderRadius: 23 },
  userAvatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  userName: { fontSize: 16, fontWeight: '600' },
  userEmail: { fontSize: 13, marginTop: 2 },
  noResults: { textAlign: 'center', marginTop: 20, fontSize: 15 },
});
