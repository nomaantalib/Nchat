import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationsScreen() {
  const { theme } = useTheme();

  const [settings, setSettings] = useState({
    messageNotifs: true,
    groupNotifs: true,
    callNotifs: true,
    messageTone: true,
    vibration: true,
    previewMessages: true,
    statusNotifs: false,
  });

  useEffect(() => {
    AsyncStorage.getItem('notificationSettings').then(json => {
      if (json) setSettings(JSON.parse(json));
    });
  }, []);

  const toggle = async (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    await AsyncStorage.setItem('notificationSettings', JSON.stringify(updated));
  };

  const options = [
    { key: 'messageNotifs', label: 'Message notifications', icon: 'chatbubble-outline', desc: 'Show notifications for new messages' },
    { key: 'groupNotifs', label: 'Group notifications', icon: 'people-outline', desc: 'Show notifications for group messages' },
    { key: 'callNotifs', label: 'Call notifications', icon: 'call-outline', desc: 'Alert for incoming calls' },
    { key: 'messageTone', label: 'Message tone', icon: 'musical-note-outline', desc: 'Play sound for new messages' },
    { key: 'vibration', label: 'Vibration', icon: 'phone-portrait-outline', desc: 'Vibrate on notifications' },
    { key: 'previewMessages', label: 'Message preview', icon: 'eye-outline', desc: 'Show message content in notifications' },
    { key: 'statusNotifs', label: 'Status updates', icon: 'disc-outline', desc: 'Notify when contacts post a status' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator indicatorStyle={theme.isDark ? 'white' : 'black'}>
      <Text style={[styles.sectionTitle, { color: theme.primary }]}>Notifications</Text>
      <View style={[styles.card, { backgroundColor: theme.headerBg, borderColor: theme.border }]}>
        {options.map((opt, i) => (
          <View key={opt.key}>
            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: `${theme.primary}18` }]}>
                <Ionicons name={opt.icon} size={20} color={theme.primary} />
              </View>
              <View style={styles.info}>
                <Text style={[styles.label, { color: theme.textDark }]}>{opt.label}</Text>
                <Text style={[styles.desc, { color: theme.textLight }]}>{opt.desc}</Text>
              </View>
              <Switch
                value={settings[opt.key]}
                onValueChange={() => toggle(opt.key)}
                trackColor={{ false: theme.border, true: `${theme.primary}88` }}
                thumbColor={settings[opt.key] ? theme.primary : '#ccc'}
              />
            </View>
            {i < options.length - 1 && <View style={[styles.divider, { backgroundColor: theme.border }]} />}
          </View>
        ))}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8, textTransform: 'uppercase' },
  card: { marginHorizontal: 15, borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingHorizontal: 16 },
  iconBox: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  info: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  desc: { fontSize: 12 },
  divider: { height: 1, marginLeft: 68 },
});
