import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function MeetScreen({ navigation }) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [meetingCode, setMeetingCode] = useState('');

  const createMeeting = () => {
    // Generate a random 6-character alphanumeric code
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigation.navigate('CallScreen', { roomId: newCode, isHost: true });
  };

  const joinMeeting = () => {
    if (meetingCode.trim().length > 0) {
      navigation.navigate('CallScreen', { roomId: meetingCode.toUpperCase(), isHost: false });
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3042/3042083.png' }} 
          style={styles.heroImage} 
        />
        <Text style={[styles.title, { color: theme.textDark }]}>Video Meetings</Text>
        <Text style={[styles.subtitle, { color: theme.textLight }]}>
          Connect with high-quality video calling powered by WebRTC structure.
        </Text>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.createButton, { backgroundColor: theme.primary }]}
          onPress={createMeeting}
        >
          <Ionicons name="videocam" size={24} color="#fff" />
          <Text style={styles.createButtonText}>New Meeting</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={[styles.orText, { color: theme.textLight }]}>OR</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.joinContainer}>
          <View style={[styles.inputWrapper, { borderColor: theme.border }]}>
            <Ionicons name="keypad" size={20} color={theme.textLight} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.textDark }]}
              placeholder="Enter meeting code"
              placeholderTextColor={theme.textLight}
              value={meetingCode}
              onChangeText={setMeetingCode}
              autoCapitalize="characters"
              maxLength={8}
            />
          </View>
          <TouchableOpacity 
            style={[
              styles.joinButton, 
              { backgroundColor: meetingCode.trim().length > 0 ? theme.primary : theme.border }
            ]}
            onPress={joinMeeting}
            disabled={meetingCode.trim().length === 0}
          >
            <Text style={[
              styles.joinButtonText, 
              { color: meetingCode.trim().length > 0 ? '#fff' : theme.textLight }
            ]}>Join</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 30,
    marginTop: 20,
  },
  heroImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  actionContainer: {
    padding: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  orText: {
    marginHorizontal: 15,
    fontWeight: 'bold',
  },
  joinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  joinButton: {
    marginLeft: 15,
    paddingHorizontal: 25,
    height: 50,
    justifyContent: 'center',
    borderRadius: 12,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
