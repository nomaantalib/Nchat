import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Share, Clipboard, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const RECENT_MEETINGS = [
  { id: 'MEET01', title: 'Daily Standup', time: 'Today, 10:00 AM', participants: 4 },
  { id: 'XK92PL', title: 'Project Review', time: 'Yesterday, 3:00 PM', participants: 7 },
  { id: 'AZ7TX3', title: 'One-on-One', time: 'Mon, 2:30 PM', participants: 2 },
];

export default function MeetScreen({ navigation }) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [meetingCode, setMeetingCode] = useState('');

  const createMeeting = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigation.navigate('CallScreen', { roomId: newCode, isHost: true });
  };

  const joinMeeting = () => {
    if (meetingCode.trim().length < 4)
      return Alert.alert('Invalid Code', 'Please enter a valid meeting code.');
    navigation.navigate('CallScreen', { roomId: meetingCode.toUpperCase(), isHost: false });
  };

  const shareMeeting = async (code) => {
    await Share.share({ message: `Join my NChat meeting! Code: ${code}` });
  };

  const copyCode = (code) => {
    Clipboard.setString(code);
    Alert.alert('Copied!', `Meeting code ${code} copied to clipboard.`);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator
      indicatorStyle={theme.isDark ? 'white' : 'black'}
      scrollIndicatorInsets={{ right: 1 }}
    >
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: theme.headerBg, borderColor: theme.border }]}>
        <View style={[styles.heroIcon, { backgroundColor: `${theme.primary}20` }]}>
          <Ionicons name="videocam" size={52} color={theme.primary} />
        </View>
        <Text style={[styles.heroTitle, { color: theme.textDark }]}>Video Meetings</Text>
        <Text style={[styles.heroSub, { color: theme.textLight }]}>
          HD video & audio — invite anyone with a code
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.primary }]} onPress={createMeeting}>
          <Ionicons name="add-circle" size={30} color="#fff" />
          <Text style={styles.actionCardText}>New Meeting</Text>
          <Text style={styles.actionCardSub}>Start instantly</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: theme.headerBg, borderColor: theme.border, borderWidth: 1.5 }]}
          onPress={() => navigation.navigate('CallScreen', { roomId: 'SCHED01', isHost: false })}
        >
          <Ionicons name="calendar" size={30} color={theme.primary} />
          <Text style={[styles.actionCardText, { color: theme.textDark }]}>Schedule</Text>
          <Text style={[styles.actionCardSub, { color: theme.textLight }]}>Plan for later</Text>
        </TouchableOpacity>
      </View>

      {/* Join via Code */}
      <View style={[styles.joinCard, { backgroundColor: theme.headerBg, borderColor: theme.border }]}>
        <Text style={[styles.joinLabel, { color: theme.textDark }]}>Join with a code</Text>
        <View style={styles.joinRow}>
          <View style={[styles.codeInput, { borderColor: theme.border, backgroundColor: theme.background }]}>
            <Ionicons name="keypad-outline" size={18} color={theme.textLight} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.codeInputText, { color: theme.textDark }]}
              placeholder="Enter code"
              placeholderTextColor={theme.textLight}
              value={meetingCode}
              onChangeText={setMeetingCode}
              autoCapitalize="characters"
              maxLength={8}
            />
          </View>
          <TouchableOpacity
            style={[styles.joinBtn, { backgroundColor: meetingCode.trim().length >= 4 ? theme.primary : theme.border }]}
            onPress={joinMeeting}
          >
            <Ionicons name="enter-outline" size={22} color={meetingCode.trim().length >= 4 ? '#fff' : theme.textLight} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Meetings */}
      <Text style={[styles.sectionLabel, { color: theme.primary }]}>Recent Meetings</Text>
      {RECENT_MEETINGS.map((m) => (
        <View key={m.id} style={[styles.meetCard, { backgroundColor: theme.headerBg, borderColor: theme.border }]}>
          <View style={[styles.meetIcon, { backgroundColor: `${theme.primary}18` }]}>
            <Ionicons name="videocam-outline" size={22} color={theme.primary} />
          </View>
          <View style={styles.meetInfo}>
            <Text style={[styles.meetTitle, { color: theme.textDark }]}>{m.title}</Text>
            <Text style={[styles.meetMeta, { color: theme.textLight }]}>
              {m.time} · {m.participants} participants · #{m.id}
            </Text>
          </View>
          <TouchableOpacity style={styles.meetAction} onPress={() => shareMeeting(m.id)}>
            <Ionicons name="share-social-outline" size={20} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.meetAction} onPress={() => navigation.navigate('CallScreen', { roomId: m.id, isHost: false })}>
            <Ionicons name="enter-outline" size={20} color={theme.primary} />
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
    alignItems: 'center', margin: 16, borderRadius: 20, padding: 28,
    borderWidth: 1, elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 6,
  },
  heroIcon: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  heroTitle: { fontSize: 24, fontWeight: '800', marginBottom: 6 },
  heroSub: { fontSize: 14, textAlign: 'center' },
  actionRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 16 },
  actionCard: {
    flex: 1, borderRadius: 18, padding: 18, alignItems: 'center',
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 6,
  },
  actionCardText: { color: '#fff', fontWeight: '800', fontSize: 15, marginTop: 10 },
  actionCardSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
  joinCard: { marginHorizontal: 16, borderRadius: 18, padding: 18, borderWidth: 1, marginBottom: 16 },
  joinLabel: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  joinRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  codeInput: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12,
  },
  codeInputText: { flex: 1, fontSize: 16, fontWeight: '700', letterSpacing: 2 },
  joinBtn: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  sectionLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', paddingHorizontal: 20, marginBottom: 10 },
  meetCard: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 16,
    marginBottom: 10, borderRadius: 14, padding: 14, borderWidth: 1,
  },
  meetIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  meetInfo: { flex: 1 },
  meetTitle: { fontSize: 15, fontWeight: '700' },
  meetMeta: { fontSize: 12, marginTop: 2 },
  meetAction: { padding: 8, marginLeft: 4 },
});
