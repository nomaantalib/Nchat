import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import MessageBubble from '../components/MessageBubble';

const EMOJIS = ['😀', '😂', '😍', '😎', '🥰', '😊', '❤️', '🔥', '👍', '🎉', '😢', '😡', '😱', '🤔', '🙏', '✨', '💯', '😘'];

export default function ChatRoomScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { chatName } = route.params || { chatName: 'Contact' };
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', type: 'text', content: 'Hello! How are you?', sender: 'other', time: '10:00 AM' },
    { id: '2', type: 'text', content: 'I am good, thanks! How about you?', sender: 'current', time: '10:05 AM' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const flatListRef = useRef(null);

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

  const handleSend = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      type: 'text',
      content: message,
      sender: 'current',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setShowEmojiPicker(false);
    
    // Simulate auto reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMessage = {
        id: (Date.now() + 1).toString(),
        type: 'text',
        content: 'Got it! 👍',
        sender: 'other',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 1500);
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

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <MessageBubble message={item} isSent={item.sender === 'current'} />}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

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
