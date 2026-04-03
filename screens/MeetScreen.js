import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Share, Alert, Clipboard, Platform
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

// Mock meeting history
const RECENT_MEETINGS = [
  { id: 'DAILY-SC', title: 'Daily Standup', time: 'Today, 10:00 AM', participants: 4, canRejoin: true },
  { id: 'PROJ-REV', title: 'Project Review', time: 'Yesterday, 3:00 PM', participants: 7, canRejoin: false },
  { id: '1ON1-MT', title: 'One-on-One', time: 'Mon, 2:30 PM', participants: 2, canRejoin: true },
];

export default function MeetScreen({ navigation }) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [meetingCode, setMeetingCode] = useState('');
  const [activeCodes, setActiveCodes] = useState(['DAILY-SC', 'PROJ-REV', '1ON1-MT']);

  // Generate a unique 8-character meeting code
  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const createMeeting = () => {
    const newCode = generateCode();
    // In a real app, you'd register this code on the backend
    navigation.navigate('CallScreen', { roomId: newCode, isHost: true });
  };

  const joinMeeting = (code = meetingCode) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode.length < 4) {
      return Alert.alert('Invalid Code', 'Please enter a valid meeting code.');
    }
    navigation.navigate('CallScreen', { roomId: cleanCode, isHost: false });
  };

  const shareMeeting = async (code) => {
    const link = `https://nchat.app/join/${code}`;
    await Share.share({
      message: `Join my NChat meeting!\nCode: ${code}\nLink: ${link}`,
      title: 'NChat Meeting Invitation'
    });
  };

  const copyCode = (code) => {
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(code);
    } else {
      Clipboard?.setString(code);
    }
    Alert.alert('Copied!', `Meeting code ${code} copied to clipboard.`);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator
      indicatorStyle={theme.isDark ? 'white' : 'black'}
      scrollIndicatorInsets={{ right: 1 }}
    >
      {/* Hero Section */}
      <View style={[styles.hero, { backgroundColor: theme.headerBg, borderColor: theme.border }]}>
        <View style={[styles.heroIcon, { backgroundColor: `${theme.primary}15` }]}>
          <Ionicons name="videocam" size={48} color={theme.primary} />
        </View>
        <Text style={[styles.heroTitle, { color: theme.textDark }]}>Instant Conferences</Text>
        <Text style={[styles.heroSub, { color: theme.textLight }]}>
          Secure HD video meetings with anyone, anywhere
        </Text>
      </View>

      {/* Main Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.mainAction, { backgroundColor: theme.primary }]} 
          onPress={createMeeting}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={32} color="#fff" />
          <Text style={styles.mainActionText}>New Meeting</Text>
          <Text style={styles.mainActionSub}>Get a link to share</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.mainAction, { backgroundColor: theme.headerBg, borderColor: theme.border, borderWidth: 1.5 }]} 
          onPress={() => navigation.navigate('CallScreen', { roomId: 'SCHEDULED', isHost: false })}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar-outline" size={30} color={theme.primary} />
          <Text style={[styles.mainActionText, { color: theme.textDark }]}>Schedule</Text>
          <Text style={[styles.mainActionSub, { color: theme.textLight }]}>Plan for later</Text>
        </TouchableOpacity>
      </View>

      {/* Join Section */}
      <View style={[styles.section, { backgroundColor: theme.headerBg, borderColor: theme.border }]}>
        <Text style={[styles.sectionLabel, { color: theme.textDark }]}>Join with a code</Text>
        <View style={styles.joinRow}>
          <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Ionicons name="keypad" size={18} color={theme.textLight} style={{ marginRight: 10 }} />
            <TextInput
              style={[styles.input, { color: theme.textDark }]}
              placeholder="e.g. ABCD-1234"
              placeholderTextColor={theme.textLight}
              value={meetingCode}
              onChangeText={setMeetingCode}
              autoCapitalize="characters"
            />
          </View>
          <TouchableOpacity 
            style={[styles.joinBtn, { backgroundColor: meetingCode.length > 3 ? theme.primary : theme.border }]} 
            onPress={() => joinMeeting()}
            disabled={meetingCode.length < 4}
          >
            <Text style={[styles.joinBtnText, { color: meetingCode.length > 3 ? '#fff' : theme.textLight }]}>Join</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent / History */}
      <View style={styles.recentHeader}>
        <Text style={[styles.recentLabel, { color: theme.primary }]}>Recent Meetings</Text>
      </View>
      
      {RECENT_MEETINGS.map((m) => (
        <View key={m.id} style={[styles.meetCard, { backgroundColor: theme.headerBg, borderColor: theme.border }]}>
          <View style={[styles.meetIconBox, { backgroundColor: m.canRejoin ? `${theme.primary}12` : `${theme.textLight}10` }]}>
            <Ionicons name="videocam-outline" size={24} color={m.canRejoin ? theme.primary : theme.textLight} />
          </View>
          <View style={styles.meetInfo}>
            <Text style={[styles.meetTitle, { color: theme.textDark }]}>{m.title}</Text>
            <Text style={[styles.meetMeta, { color: theme.textLight }]}>
              {m.time} • {m.participants} participants
            </Text>
          </View>
          <TouchableOpacity style={styles.meetAction} onPress={() => shareMeeting(m.id)}>
            <Ionicons name="share-social-outline" size={20} color={theme.textLight} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.meetAction, { marginLeft: 8 }]} 
            onPress={() => m.canRejoin ? joinMeeting(m.id) : Alert.alert('Expired', 'This meeting link has expired.')}
          >
            <Ionicons 
              name={m.canRejoin ? "refresh" : "lock-closed-outline"} 
              size={20} 
              color={m.canRejoin ? theme.primary : theme.textLight} 
            />
          </TouchableOpacity>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    margin: 16, borderRadius: 24, padding: 24, alignItems: 'center',
    borderWidth: 1, elevation: 4,
    shadowColor: '#000', shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 12,
  },
  heroIcon: { width: 84, height: 84, borderRadius: 42, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  heroTitle: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5, marginBottom: 6 },
  heroSub: { fontSize: 13, textAlign: 'center', lineHeight: 18, opacity: 0.8 },
  actionRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 16 },
  mainAction: {
    flex: 1, borderRadius: 20, padding: 18, alignItems: 'center',
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 6,
  },
  mainActionText: { color: '#fff', fontSize: 16, fontWeight: '800', marginTop: 10 },
  mainActionSub: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 },
  section: { marginHorizontal: 16, borderRadius: 20, padding: 18, borderWidth: 1, marginBottom: 20 },
  sectionLabel: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  joinRow: { flexDirection: 'row', gap: 10 },
  inputWrapper: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, borderWidth: 1,
  },
  input: { flex: 1, fontSize: 15, fontWeight: '700', letterSpacing: 1 },
  joinBtn: { paddingHorizontal: 20, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  joinBtnText: { fontWeight: '800', fontSize: 14 },
  recentHeader: { paddingHorizontal: 20, marginBottom: 10 },
  recentLabel: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  meetCard: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 16,
    marginBottom: 10, padding: 14, borderRadius: 18, borderWidth: 1,
  },
  meetIconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  meetInfo: { flex: 1 },
  meetTitle: { fontSize: 16, fontWeight: '700' },
  meetMeta: { fontSize: 12, marginTop: 2, opacity: 0.7 },
  meetAction: { padding: 8 },
});
