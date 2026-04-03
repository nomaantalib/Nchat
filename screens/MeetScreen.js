import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function MeetScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.meetingSection, { backgroundColor: theme.background }]}>
        <TouchableOpacity style={[styles.meetingCard, { backgroundColor: theme.primary }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="videocam" size={24} color="#fff" />
            <Text style={styles.cardTitle}>Instant Meeting</Text>
          </View>
          <Text style={styles.cardDesc}>Start a video meeting instantly</Text>
          <View style={styles.meetingButtons}>
            <TouchableOpacity style={styles.meetingBtn}>
              <Text style={[styles.btnText, { color: theme.primary }]}>New Meeting</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.meetingBtn, styles.joinBtn]}>
              <Text style={styles.joinBtnText}>Join with Code</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <View style={styles.recentMeetings}>
          <Text style={[styles.recentTitle, { color: theme.textDark }]}>Recent Meetings</Text>
          <View style={[styles.recentItem, { backgroundColor: theme.headerBg }]}>
            <Text style={{ color: theme.textDark, fontWeight: 'bold' }}>Meeting XYZ123</Text>
            <Text style={{ color: theme.textLight }}>Yesterday, 4:00 PM</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  meetingSection: {
    marginVertical: 8,
    borderRadius: 15,
  },
  meetingCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cardDesc: {
    color: 'white',
    opacity: 0.9,
    marginBottom: 15,
  },
  meetingButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  meetingBtn: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
  },
  btnText: {
    fontWeight: '600',
  },
  joinBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  joinBtnText: {
    color: 'white',
    fontWeight: '600',
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
  },
  recentItem: {
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
