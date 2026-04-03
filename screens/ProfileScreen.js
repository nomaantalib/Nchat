import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { theme, switchTheme } = useTheme();
  const { logout } = useAuth();

  const settings = [
    { icon: 'key-outline', name: 'Account', desc: 'Security notifications, change number' },
    { icon: 'chatbubbles-outline', name: 'Chats', desc: 'Theme, wallpapers, chat history' },
    { icon: 'notifications-outline', name: 'Notifications', desc: 'Message, group & call tones' },
    { icon: 'help-circle-outline', name: 'Help', desc: 'Help center, contact us, privacy policy' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>M</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.textDark }]}>Mohdn</Text>
          <Text style={[styles.userStatus, { color: theme.textLight }]}>Available</Text>
        </View>
        <Ionicons name="qr-code-outline" size={24} color={theme.primary} />
      </View>

      <View style={styles.settingsList}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>Select Theme</Text>
        <View style={styles.themeOptions}>
          <TouchableOpacity onPress={() => switchTheme('telegram')} style={[styles.themeBtn, theme.primary === '#0088cc' && styles.activeTheme]}>
            <Text style={{ color: theme.textDark }}>Telegram</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => switchTheme('whatsapp')} style={[styles.themeBtn, theme.primary === '#25D366' && styles.activeTheme]}>
            <Text style={{ color: theme.textDark }}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => switchTheme('dark')} style={[styles.themeBtn, theme.primary === '#8774e1' && styles.activeTheme]}>
            <Text style={{ color: theme.textDark }}>Dark</Text>
          </TouchableOpacity>
        </View>

        {settings.map((item, index) => (
          <TouchableOpacity key={index} style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <Ionicons name={item.icon} size={24} color={theme.textLight} style={styles.settingIcon} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingName, { color: theme.textDark }]}>{item.name}</Text>
              <Text style={[styles.settingDesc, { color: theme.textLight }]}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: theme.border, marginTop: 20 }]} 
          onPress={() => {
             logout();
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="#fa3e3e" style={styles.settingIcon} />
          <View style={styles.settingInfo}>
            <Text style={[styles.settingName, { color: '#fa3e3e' }]}>Logout</Text>
            <Text style={[styles.settingDesc, { color: theme.textLight }]}>Sign out of your account</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
  },
  settingsList: {
    marginTop: 10,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  themeOptions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  themeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeTheme: {
    borderColor: '#0088cc',
    backgroundColor: 'rgba(0,136,204,0.1)',
  },
  settingItem: {
    flexDirection: 'row',
    padding: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  settingIcon: {
    marginRight: 20,
  },
  settingInfo: {
    flex: 1,
  },
  settingName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 14,
  },
});
