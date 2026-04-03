import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const mockStories = [
  { id: '1', name: 'Rahul Sharma', time: '10:30 AM' },
  { id: '2', name: 'Neha Gupta', time: '9:15 AM' },
];

export default function StatusScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.section, { backgroundColor: theme.headerBg }]}>
        <View style={styles.storyItem}>
          <View style={[styles.avatarContainer, { borderColor: theme.border }]}>
            <View style={[styles.myStatusAvatar, { backgroundColor: theme.primary }]}>
              <Ionicons name="add" size={24} color="#fff" />
            </View>
          </View>
          <View style={styles.storyInfo}>
            <Text style={[styles.name, { color: theme.textDark }]}>My Status</Text>
            <Text style={[styles.time, { color: theme.textLight }]}>Tap to add status update</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.textLight }]}>Recent updates</Text>

      <View style={[styles.section, { backgroundColor: theme.headerBg }]}>
        {mockStories.map(story => (
          <TouchableOpacity key={story.id} style={styles.storyItem}>
            <View style={[styles.avatarContainer, { borderColor: theme.primary }]}>
              <View style={[styles.statusAvatar, { backgroundColor: theme.secondary }]}>
                <Text style={styles.avatarText}>{story.name.charAt(0)}</Text>
              </View>
            </View>
            <View style={styles.storyInfo}>
              <Text style={[styles.name, { color: theme.textDark }]}>{story.name}</Text>
              <Text style={[styles.time, { color: theme.textLight }]}>{story.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 10,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#e4e6eb',
  },
  sectionTitle: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  storyItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  myStatusAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  storyInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
  },
});
