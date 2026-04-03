import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, TextInput, Modal, Image, Share, Alert
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import ChatItem from '../components/ChatItem';
import api from '../services/api';
import * as Contacts from 'expo-contacts';

export default function ChatsScreen({ navigation }) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const [nchatContacts, setNchatContacts] = useState([]);     // on NChat
  const [otherContacts, setOtherContacts] = useState([]);     // not on NChat
  const [loadingContacts, setLoadingContacts] = useState(false);

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

  const openNewChat = async () => {
    setShowNewChat(true);
    setLoadingContacts(true);
    try {
      // 1. Read device contacts
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Cannot access contacts without permission.');
        setLoadingContacts(false);
        return;
      }
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
      });

      // 2. Collect all phone numbers
      const allPhones = [];
      const phoneToContact = {};
      data.forEach(contact => {
        (contact.phoneNumbers || []).forEach(p => {
          const normalized = p.number.replace(/[\s\-().+]/g, '');
          allPhones.push(normalized);
          phoneToContact[normalized] = contact.name || 'Unknown';
        });
      });

      // 3. Match against backend
      const res = await api.post('/auth/match-phones', { phones: allPhones });
      const matchedPhones = res.data.map(u => u.phone);

      setNchatContacts(res.data);

      // 4. Build "not on NChat" list from device contacts
      const notOnNchat = [];
      data.forEach(contact => {
        const nums = (contact.phoneNumbers || []).map(p => p.number.replace(/[\s\-().+]/g, ''));
        const matched = nums.some(n => matchedPhones.includes(n));
        if (!matched && nums.length > 0) {
          notOnNchat.push({ name: contact.name, phone: (contact.phoneNumbers[0]?.number || '') });
        }
      });
      setOtherContacts(notOnNchat);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingContacts(false);
    }
  };

  const startChat = async (userId) => {
    try {
      setShowNewChat(false);
      const res = await api.post('/chats', { userId });
      const otherUser = res.data.users?.find(u => u._id !== currentUser._id);
      navigation.navigate('ChatRoom', {
        chatId: res.data._id,
        chatName: res.data.isGroupChat ? res.data.chatName : otherUser?.name,
        chatPic: otherUser?.pic,
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
      <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]} onPress={openNewChat}>
        <Ionicons name="create-outline" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Contacts Modal */}
      <Modal visible={showNewChat} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.headerBg }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textDark }]}>New Chat</Text>
              <TouchableOpacity onPress={() => { setShowNewChat(false); setContactSearch(''); }}>
                <Ionicons name="close" size={26} color={theme.textLight} />
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={[styles.searchBar, { backgroundColor: theme.background, borderColor: theme.border, marginBottom: 8 }]}>
              <Ionicons name="search" size={16} color={theme.textLight} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.searchInput, { color: theme.textDark }]}
                placeholder="Search contacts..."
                placeholderTextColor={theme.textLight}
                value={contactSearch}
                onChangeText={setContactSearch}
              />
            </View>

            {loadingContacts ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[{ color: theme.textLight, marginTop: 10 }]}>Reading contacts...</Text>
              </View>
            ) : (
              <FlatList
                data={[
                  ...(nchatContacts.filter(u =>
                    !contactSearch || u.name?.toLowerCase().includes(contactSearch.toLowerCase()) || u.phone?.includes(contactSearch)
                  ).map(u => ({ ...u, isNchat: true }))),
                  ...(otherContacts.filter(c =>
                    !contactSearch || c.name?.toLowerCase().includes(contactSearch.toLowerCase()) || c.phone?.includes(contactSearch)
                  ).map(c => ({ ...c, isNchat: false }))),
                ]}
                keyExtractor={(item, index) => item._id || `other-${index}`}
                showsVerticalScrollIndicator
                indicatorStyle={theme.isDark ? 'white' : 'black'}
                ListHeaderComponent={
                  nchatContacts.length > 0 && (
                    <Text style={[styles.contactsLabel, { color: theme.primary }]}>
                      On NChat ({nchatContacts.length})
                    </Text>
                  )
                }
                renderItem={({ item, index }) => {
                  // Separator label
                  const isFirstOther = !item.isNchat && index === nchatContacts.filter(u =>
                    !contactSearch || u.name?.toLowerCase().includes(contactSearch.toLowerCase())
                  ).length;

                  return (
                    <>
                      {isFirstOther && otherContacts.length > 0 && (
                        <Text style={[styles.contactsLabel, { color: theme.textLight }]}>
                          Invite to NChat ({otherContacts.length})
                        </Text>
                      )}
                      <TouchableOpacity
                        style={[styles.userRow, { borderBottomColor: theme.border }]}
                        onPress={() => {
                          if (item.isNchat) {
                            startChat(item._id);
                          } else {
                            Share.share({ message: `Hey! I'm using NChat to chat. Join me here: https://nchat.app\nInviting ${item.name} (${item.phone})` });
                          }
                        }}
                      >
                        <View style={[styles.userAvatar, { backgroundColor: item.isNchat ? theme.primary : theme.border }]}>
                          {item.pic ? (
                            <Image source={{ uri: item.pic }} style={styles.userAvatarImg} />
                          ) : (
                            <Text style={[styles.userAvatarText, { color: item.isNchat ? '#fff' : theme.textLight }]}>
                              {item.name?.charAt(0)?.toUpperCase()}
                            </Text>
                          )}
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.userName, { color: theme.textDark }]}>{item.name}</Text>
                          <Text style={[styles.userEmail, { color: theme.textLight }]}>
                            {item.isNchat ? `📱 ${item.phone || item.email}` : `📞 ${item.phone}`}
                          </Text>
                        </View>
                        {item.isNchat ? (
                          <View style={[styles.chatBadge, { backgroundColor: theme.primary }]}>
                            <Text style={styles.chatBadgeText}>Chat</Text>
                          </View>
                        ) : (
                          <View style={[styles.inviteBadge, { borderColor: theme.primary }]}>
                            <Text style={[styles.inviteBadgeText, { color: theme.primary }]}>Invite</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </>
                  );
                }}
                ListEmptyComponent={
                  <View style={{ alignItems: 'center', marginTop: 40 }}>
                    <Ionicons name="people-outline" size={50} color={theme.textLight} />
                    <Text style={[{ color: theme.textLight, marginTop: 10 }]}>No contacts found</Text>
                  </View>
                }
              />
            )}
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
  contactsLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase', paddingVertical: 10, paddingHorizontal: 4 },
  chatBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  chatBadgeText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  inviteBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1.5 },
  inviteBadgeText: { fontWeight: '700', fontSize: 13 },
});
