import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, FlatList, Animated,
  ActivityIndicator, Image, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import io from 'socket.io-client';
import * as ImagePicker from 'expo-image-picker';

const EMOJIS = ['😀','😂','😍','😎','🥰','😊','❤️','🔥','👍','🎉','😢','😡','😱','🤔','🙏','✨','💯','😘','🫡','🎵','🤩','💪','🙌','👏','🫶','😴','🤣','🥳','🫠','🤝'];
const ENDPOINT = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
var socket, selectedChatCompare;

export default function ChatRoomScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { chatName, chatId, chatPic } = route.params || {};

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const flatListRef = useRef(null);
  let typingTimeout = useRef(null);

  // Animated dots for typing indicator
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const fetchMessages = async () => {
    if (!chatId) return;
    try {
      const res = await api.get(`/messages/${chatId}`);
      setMessages(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    if (currentUser) {
      socket.emit('setup', currentUser);
      socket.on('connected', () => setSocketConnected(true));
      socket.on('message recieved', (msg) => {
        if (!selectedChatCompare || selectedChatCompare !== msg.chat._id) return;
        setMessages(prev => [...prev, msg]);
      });
      socket.on('typing', () => setIsTyping(true));
      socket.on('stop typing', () => setIsTyping(false));
    }
    return () => { socket.disconnect(); };
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = chatId;
    if (socketConnected && chatId) socket.emit('join chat', chatId);
  }, [chatId, socketConnected]);

  useEffect(() => {
    if (isTyping) {
      const animateDot = (dot, delay) => Animated.sequence([
        Animated.delay(delay),
        Animated.loop(Animated.sequence([
          Animated.timing(dot, { toValue: -5, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]))
      ]);
      Animated.parallel([animateDot(dot1, 0), animateDot(dot2, 200), animateDot(dot3, 400)]).start();
    } else { dot1.setValue(0); dot2.setValue(0); dot3.setValue(0); }
  }, [isTyping]);

  const handleTyping = (text) => {
    setMessage(text);
    if (showEmojiPicker) setShowEmojiPicker(false);
    if (!socketConnected) return;
    socket.emit('typing', chatId);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => socket.emit('stop typing', chatId), 2000);
  };

  const handleSend = async (content = message, type = 'text') => {
    if (!content.trim() && type === 'text') return;
    if (!chatId) return;
    setMessage('');
    setShowEmojiPicker(false);
    socket.emit('stop typing', chatId);
    try {
      const res = await api.post('/messages', { content, chatId });
      socket.emit('new message', res.data);
      setMessages(prev => [...prev, res.data]);
    } catch (e) { console.error(e); }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      // Send image URI as message content for now (in production: upload to cloud first)
      handleSend(`📷 [Image] ${result.assets[0].uri}`, 'image');
    }
  };

  const renderMessage = ({ item, index }) => {
    const isSent = item.sender?._id === currentUser._id;
    const time = item.createdAt
      ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';
    const isImage = item.content?.startsWith('📷 [Image]');
    const imageUri = isImage ? item.content.replace('📷 [Image] ', '') : null;
    const prevItem = index > 0 ? messages[index - 1] : null;
    const showAvatar = !isSent && (!prevItem || prevItem.sender?._id !== item.sender?._id);

    return (
      <View style={[styles.msgRow, isSent ? styles.msgRowSent : styles.msgRowReceived]}>
        {!isSent && (
          <View style={[styles.msgAvatar, { opacity: showAvatar ? 1 : 0 }]}>
            <View style={[styles.msgAvatarCircle, { backgroundColor: theme.primary }]}>
              <Text style={styles.msgAvatarText}>
                {item.sender?.name?.charAt(0)?.toUpperCase() || '?'}
              </Text>
            </View>
          </View>
        )}
        <View style={[
          styles.bubble,
          isSent
            ? [styles.sentBubble, { backgroundColor: theme.sentMsg }]
            : [styles.receivedBubble, { backgroundColor: theme.receivedMsg, borderColor: theme.border }]
        ]}>
          {isImage ? (
            <Image source={{ uri: imageUri }} style={styles.imageMsg} resizeMode="cover" />
          ) : (
            <Text style={[styles.bubbleText, { color: isSent ? '#fff' : theme.textDark }]}>
              {item.content}
            </Text>
          )}
          <View style={styles.bubbleMeta}>
            <Text style={[styles.bubbleTime, { color: isSent ? 'rgba(255,255,255,0.7)' : theme.textLight }]}>
              {time}
            </Text>
            {isSent && (
              <Ionicons name="checkmark-done" size={14} color="rgba(255,255,255,0.8)" style={{ marginLeft: 4 }} />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.textDark} />
        </TouchableOpacity>
        <View style={[styles.headerAvatar, { backgroundColor: theme.primary }]}>
          {chatPic ? (
            <Image source={{ uri: chatPic }} style={styles.headerAvatarImg} />
          ) : (
            <Text style={styles.headerAvatarText}>{chatName?.charAt(0)?.toUpperCase()}</Text>
          )}
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.textDark }]}>{chatName}</Text>
          {isTyping ? (
            <View style={styles.typingRow}>
              <Text style={[styles.typingText, { color: theme.primary }]}>typing</Text>
              <Animated.View style={[styles.dot, { backgroundColor: theme.primary, transform: [{ translateY: dot1 }] }]} />
              <Animated.View style={[styles.dot, { backgroundColor: theme.primary, transform: [{ translateY: dot2 }] }]} />
              <Animated.View style={[styles.dot, { backgroundColor: theme.primary, transform: [{ translateY: dot3 }] }]} />
            </View>
          ) : (
            <Text style={[styles.onlineStatus, { color: theme.primary }]}>online</Text>
          )}
        </View>
        <TouchableOpacity style={styles.headerAction} onPress={() => navigation.navigate('CallScreen', { roomId: chatId, isHost: true })}>
          <Ionicons name="call" size={22} color={theme.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerAction} onPress={() => navigation.navigate('CallScreen', { roomId: chatId, isHost: true })}>
          <Ionicons name="videocam" size={22} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item._id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator
          indicatorStyle={theme.isDark ? 'white' : 'black'}
          scrollIndicatorInsets={{ right: 1 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Ionicons name="chatbubble-ellipses-outline" size={60} color={theme.textLight} />
              <Text style={[styles.emptyChatText, { color: theme.textLight }]}>Say hello! 👋</Text>
            </View>
          }
        />
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <View style={[styles.emojiPicker, { backgroundColor: theme.headerBg, borderTopColor: theme.border }]}>
          <FlatList
            data={EMOJIS}
            numColumns={6}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.emojiItem} onPress={() => setMessage(prev => prev + item)}>
                <Text style={styles.emojiText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Input Bar */}
      <View style={[styles.inputContainer, { backgroundColor: theme.headerBg, borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.actionIcon} onPress={handleImagePick}>
          <Ionicons name="image-outline" size={26} color={theme.textLight} />
        </TouchableOpacity>
        <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <TouchableOpacity onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
            <Ionicons name={showEmojiPicker ? 'keypad-outline' : 'happy-outline'} size={22} color={theme.textLight} />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { color: theme.textDark }]}
            placeholder="Message..."
            placeholderTextColor={theme.textLight}
            value={message}
            onChangeText={handleTyping}
            multiline
            maxLength={2000}
          />
        </View>
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: message.trim() ? theme.primary : theme.border }]}
          onPress={() => handleSend()}
          disabled={!message.trim()}
          activeOpacity={0.8}
        >
          <Ionicons name="send" size={18} color={message.trim() ? '#fff' : theme.textLight} style={{ marginLeft: 2 }} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 52 : 16,
    borderBottomWidth: 1, elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
  },
  backBtn: { marginRight: 6 },
  headerAvatar: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', marginRight: 10, overflow: 'hidden' },
  headerAvatarImg: { width: 42, height: 42, borderRadius: 21 },
  headerAvatarText: { color: '#fff', fontWeight: '800', fontSize: 17 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  onlineStatus: { fontSize: 12, fontWeight: '600', marginTop: 1 },
  typingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  typingText: { fontSize: 12, fontWeight: '600', marginRight: 4 },
  dot: { width: 4, height: 4, borderRadius: 2, marginHorizontal: 1.5 },
  headerAction: { padding: 8, marginLeft: 2 },
  messagesList: { padding: 12, paddingBottom: 8 },
  msgRow: { flexDirection: 'row', marginVertical: 2, alignItems: 'flex-end' },
  msgRowSent: { justifyContent: 'flex-end' },
  msgRowReceived: { justifyContent: 'flex-start' },
  msgAvatar: { marginRight: 6, marginBottom: 2 },
  msgAvatarCircle: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  msgAvatarText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  bubble: { maxWidth: '72%', paddingHorizontal: 14, paddingTop: 9, paddingBottom: 6, borderRadius: 18 },
  sentBubble: { borderBottomRightRadius: 4 },
  receivedBubble: { borderBottomLeftRadius: 4, borderWidth: 1 },
  bubbleText: { fontSize: 15, lineHeight: 21 },
  imageMsg: { width: 200, height: 160, borderRadius: 12, marginBottom: 4 },
  bubbleMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 4 },
  bubbleTime: { fontSize: 11 },
  emptyChat: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyChatText: { fontSize: 18, fontWeight: '600', marginTop: 12 },
  emojiPicker: { height: 220, borderTopWidth: 1, paddingTop: 8 },
  emojiItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  emojiText: { fontSize: 28 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 10, paddingVertical: 10, borderTopWidth: 1,
  },
  actionIcon: { padding: 5, marginRight: 6, marginBottom: 4 },
  inputWrapper: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    borderRadius: 22, paddingHorizontal: 12, paddingVertical: 8,
    marginRight: 8, borderWidth: 1,
  },
  input: { flex: 1, marginHorizontal: 8, maxHeight: 120, fontSize: 15 },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center', marginBottom: 2,
  },
});
