import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, Animated, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import MessageBubble from '../components/MessageBubble';
import api from '../services/api';
import io from 'socket.io-client';

const EMOJIS = ['😀', '😂', '😍', '😎', '🥰', '😊', '❤️', '🔥', '👍', '🎉', '😢', '😡', '😱', '🤔', '🙏', '✨', '💯', '😘'];
const ENDPOINT = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
var socket, selectedChatCompare;

export default function ChatRoomScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { chatName, chatId } = route.params || { chatName: 'Contact' };
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const flatListRef = useRef(null);

  const fetchMessages = async () => {
    if (!chatId) return;
    try {
      const response = await api.get(`/messages/${chatId}`);
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    if (currentUser) {
      socket.emit('setup', currentUser);
      socket.on('connected', () => setSocketConnected(true));
      
      socket.on('message recieved', (newMessageRecieved) => {
        if (!selectedChatCompare || selectedChatCompare !== newMessageRecieved.chat._id) {
          // notification feature coming
        } else {
          setMessages((prev) => [...prev, newMessageRecieved]);
        }
      });
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = chatId;
    if (socketConnected && chatId) {
      socket.emit('join chat', chatId);
    }
  }, [chatId, socketConnected]);

  // Simple typing indicator animation dots
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isTyping) {
      const animateDot = (dot, delay) => {
        return Animated.sequence([
          Animated.delay(delay),
          Animated.loop(
            Animated.sequence([
              Animated.timing(dot, { toValue: -5, duration: 300, useNativeDriver: true }),
              Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
            ])
          )
        ]);
      };
      Animated.parallel([
        animateDot(dot1, 0),
        animateDot(dot2, 200),
        animateDot(dot3, 400)
      ]).start();
    } else {
      dot1.setValue(0);
      dot2.setValue(0);
      dot3.setValue(0);
    }
  }, [isTyping]);

  const handleSend = async () => {
    if (!message.trim() || !chatId) return;
    
    try {
      const sentMsg = message;
      setMessage('');
      setShowEmojiPicker(false);
      
      const response = await api.post('/messages', { content: sentMsg, chatId });
      socket.emit('new message', response.data);
      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTyping = (text) => {
    setMessage(text);
    if (showEmojiPicker) setShowEmojiPicker(false);
  };

  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.textLight} />
        </TouchableOpacity>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>{chatName.charAt(0)}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.textDark }]}>{chatName}</Text>
          {isTyping && (
            <View style={styles.typingIndicator}>
              <Text style={{ fontSize: 12, color: theme.textLight, marginRight: 4 }}>typing</Text>
              <Animated.View style={[styles.dot, { backgroundColor: theme.primary, transform: [{ translateY: dot1 }] }]} />
              <Animated.View style={[styles.dot, { backgroundColor: theme.primary, transform: [{ translateY: dot2 }] }]} />
              <Animated.View style={[styles.dot, { backgroundColor: theme.primary, transform: [{ translateY: dot3 }] }]} />
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="call" size={20} color={theme.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="videocam" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item._id}
          renderItem={({ item }) => {
            const isSent = item.sender?._id === currentUser._id;
            const messageData = {
              content: item.content,
              time: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            return <MessageBubble message={messageData} isSent={isSent} />;
          }}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      {showEmojiPicker && (
        <View style={[styles.emojiPicker, { backgroundColor: theme.headerBg, borderTopColor: theme.border }]}>
          <FlatList
            data={EMOJIS}
            numColumns={6}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.emojiItem} onPress={() => addEmoji(item)}>
                <Text style={styles.emojiText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <View style={[styles.inputContainer, { backgroundColor: theme.headerBg, borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.actionIcon}>
          <Ionicons name="add-circle" size={28} color={theme.textLight} />
        </TouchableOpacity>
        
        <View style={[styles.inputWrapper, { backgroundColor: theme.background }]}>
          <TouchableOpacity onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
            <Ionicons name="happy-outline" size={24} color={theme.textLight} />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { color: theme.textDark }]}
            placeholder="Type a message"
            placeholderTextColor={theme.textLight}
            value={message}
            onChangeText={handleTyping}
            multiline
          />
          <TouchableOpacity>
            <Ionicons name="mic-outline" size={24} color={theme.textLight} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.sendBtn, { backgroundColor: message.trim() ? theme.primary : theme.textLight }]} 
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Ionicons name="send" size={16} color="white" style={{ marginLeft: 3 }} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // rough safe area margin
    borderBottomWidth: 1,
    elevation: 2,
  },
  backBtn: {
    paddingRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerAction: {
    padding: 8,
    marginLeft: 5,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1.5,
  },
  messagesList: {
    padding: 15,
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
  },
  actionIcon: {
    padding: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  emojiPicker: {
    height: 200,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  emojiItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  emojiText: {
    fontSize: 28,
  },
});
