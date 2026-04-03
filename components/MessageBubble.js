import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function MessageBubble({ message, isSent }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.messageWrapper, isSent ? styles.sentWrapper : styles.receivedWrapper]}>
      <View 
        style={[
          styles.messageBubble, 
          isSent ? styles.sentBubble : styles.receivedBubble,
          isSent 
            ? { backgroundColor: theme.primary + '20' } // Adding 20 for some transparency simulating sent-msg
            : { backgroundColor: theme.headerBg }
        ]}
      >
        <Text style={[styles.messageText, { color: theme.textDark }]}>
          {message.content}
        </Text>
        <Text style={[styles.messageTime, { color: theme.textLight }]}>
          {message.time}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageWrapper: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 4,
  },
  sentWrapper: {
    justifyContent: 'flex-end',
  },
  receivedWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 10,
    borderRadius: 18,
    position: 'relative',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
  },
  sentBubble: {
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});
