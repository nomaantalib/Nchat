import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatsSettingsScreen() {
  const { theme } = useTheme();

  const [settings, setSettings] = useState({
    enterToSend: false,
    mediaAutoDownload: true,
    keepChatsBackup: true,
  });

  useEffect(() => {
    AsyncStorage.getItem('chatSettings').then(json => {
      if (json) setSettings(JSON.parse(json));
    });
  }, []);

  const toggle = async (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    await AsyncStorage.setItem('chatSettings', JSON.stringify(updated));
  };

  const clearChatHistory = () => {
    Alert.alert(
      'Clear Chat History',
      'This will delete all local message history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All', style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('localMessages');
            Alert.alert('Done', 'Chat history cleared.');
          }
        },
      ]
    );
  };

  const exportChatHistory = () => {
    Alert.alert('Export Chats', 'Chat export feature coming soon!', [{ text: 'OK' }]);
  };

  const options = [
    { key: 'enterToSend', label: 'Enter key sends message', icon: 'send-outline', desc: 'Press Enter to send instead of new line' },
    { key: 'mediaAutoDownload', label: 'Auto-download media', icon: 'download-outline', desc: 'Automatically download photos and videos' },
    { key: 'keepChatsBackup', label: 'Keep chats backup', icon: 'cloud-upload-outline', desc: 'Back up messages to cloud storage' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator indicatorStyle={theme.isDark ? 'white' : 'black'}>

      <Text style={[styles.sectionTitle, { color: theme.primary }]}>Chat Preferences</Text>
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

      <Text style={[styles.sectionTitle, { color: theme.primary }]}>Data & Storage</Text>
      <View style={[styles.card, { backgroundColor: theme.headerBg, borderColor: theme.border }]}>
        <TouchableOpacity style={styles.row} onPress={exportChatHistory}>
          <View style={[styles.iconBox, { backgroundColor: `${theme.primary}18` }]}>
            <Ionicons name="share-outline" size={20} color={theme.primary} />
          </View>
          <View style={styles.info}>
            <Text style={[styles.label, { color: theme.textDark }]}>Export chat history</Text>
            <Text style={[styles.desc, { color: theme.textLight }]}>Save your messages as a file</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textLight} />
        </TouchableOpacity>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <TouchableOpacity style={styles.row} onPress={clearChatHistory}>
          <View style={[styles.iconBox, { backgroundColor: '#ff4b4b18' }]}>
            <Ionicons name="trash-outline" size={20} color="#ff4b4b" />
          </View>
          <View style={styles.info}>
            <Text style={[styles.label, { color: '#ff4b4b' }]}>Clear all chat history</Text>
            <Text style={[styles.desc, { color: theme.textLight }]}>Delete all local messages permanently</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textLight} />
        </TouchableOpacity>
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
