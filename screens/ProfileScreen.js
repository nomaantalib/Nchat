import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { currentUser, logout } = useAuth();

  const settings = [
    { icon: 'key-outline', name: 'Account', desc: 'Security notifications, change number', route: 'AccountSettings' },
    { icon: 'chatbubbles-outline', name: 'Chats', desc: 'Wallpapers, chat history, backup', route: 'ChatsSettings' },
    { icon: 'notifications-outline', name: 'Notifications', desc: 'Message, group & call tones', route: 'NotificationsSettings' },
    { icon: 'lock-closed-outline', name: 'Privacy', desc: 'Block contacts, disappearing messages', route: 'PrivacySettings' },
    { icon: 'help-circle-outline', name: 'Help', desc: 'Help center, contact us, privacy policy', route: 'HelpSettings' },
  ];

  const themeOptions = [
    { key: 'system', label: 'System Default', icon: 'phone-portrait-outline' },
    { key: 'light', label: 'Light', icon: 'sunny-outline' },
    { key: 'dark', label: 'Dark', icon: 'moon-outline' },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={true}
      indicatorStyle={theme.isDark ? 'white' : 'black'}
      scrollIndicatorInsets={{ right: 1 }}
    >
      {/* Profile Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.textDark }]}>{currentUser?.name || 'User'}</Text>
          <Text style={[styles.userStatus, { color: theme.textLight }]}>{currentUser?.email || 'Available'}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="qr-code-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Appearance Section */}
      <Text style={[styles.sectionTitle, { color: theme.primary }]}>Appearance</Text>
      <View style={[styles.card, { backgroundColor: theme.headerBg, borderColor: theme.border }]}>
        {themeOptions.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.themeRow, { borderBottomColor: theme.border }]}
            onPress={() => setThemeMode(opt.key)}
          >
            <Ionicons name={opt.icon} size={22} color={themeMode === opt.key ? theme.primary : theme.textLight} style={{ marginRight: 15 }} />
            <Text style={[styles.themeLabel, { color: themeMode === opt.key ? theme.primary : theme.textDark }]}>
              {opt.label}
            </Text>
            {themeMode === opt.key && (
              <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Settings Section */}
      <Text style={[styles.sectionTitle, { color: theme.primary }]}>Settings</Text>
      <View style={[styles.card, { backgroundColor: theme.headerBg, borderColor: theme.border }]}>
        {settings.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.settingItem, { borderBottomColor: theme.border, borderBottomWidth: index < settings.length - 1 ? 1 : 0 }]}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={[styles.iconBox, { backgroundColor: `${theme.primary}18` }]}>
              <Ionicons name={item.icon} size={20} color={theme.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingName, { color: theme.textDark }]}>{item.name}</Text>
              <Text style={[styles.settingDesc, { color: theme.textLight }]}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textLight} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={[styles.logoutBtn, { borderColor: '#ff4b4b' }]}
        onPress={logout}
      >
        <Ionicons name="log-out-outline" size={22} color="#ff4b4b" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  userInfo: { flex: 1 },
  userName: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  userStatus: { fontSize: 14 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
    textTransform: 'uppercase',
  },
  card: {
    marginHorizontal: 15,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },
  themeLabel: { flex: 1, fontSize: 16 },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 18,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingInfo: { flex: 1 },
  settingName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  settingDesc: { fontSize: 13 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 10,
  },
  logoutText: { color: '#ff4b4b', fontSize: 16, fontWeight: '700' },
});
