import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

export default function AccountScreen({ navigation }) {
  const { theme } = useTheme();
  const { currentUser, setCurrentUser } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [pic, setPic] = useState(currentUser?.pic || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: false,
    });
    if (!result.canceled) {
      setPic(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Name cannot be empty');
    setSaving(true);
    try {
      const response = await api.put('/auth/profile', { name, pic });
      const updated = { ...currentUser, name, pic: response.data.pic || pic };
      await AsyncStorage.setItem('user', JSON.stringify(updated));
      setCurrentUser(updated);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword)
      return Alert.alert('Error', 'Please fill in both password fields');
    if (newPassword.length < 6)
      return Alert.alert('Error', 'New password must be at least 6 characters');
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      Alert.alert('Success', 'Password changed!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Could not change password');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={true} indicatorStyle={theme.isDark ? 'white' : 'black'}>
      
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={pickImage}>
          {pic ? (
            <Image source={{ uri: pic }} style={[styles.avatarImg, { borderColor: theme.primary }]} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
              <Text style={styles.avatarInitial}>{name.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <View style={[styles.editBadge, { backgroundColor: theme.primary }]}>
            <Ionicons name="camera" size={14} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={[styles.changePhotoText, { color: theme.primary }]}>Change Photo</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.primary }]}>Profile Info</Text>
      <View style={[styles.card, { backgroundColor: theme.headerBg, borderColor: theme.border }]}>
        <View style={styles.inputRow}>
          <Ionicons name="person-outline" size={20} color={theme.textLight} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.textDark }]}
            value={name}
            onChangeText={setName}
            placeholder="Display name"
            placeholderTextColor={theme.textLight}
          />
        </View>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <View style={styles.inputRow}>
          <Ionicons name="mail-outline" size={20} color={theme.textLight} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.textDark }]}
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor={theme.textLight}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.primary }]} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { color: theme.primary }]}>Change Password</Text>
      <View style={[styles.card, { backgroundColor: theme.headerBg, borderColor: theme.border }]}>
        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.textLight} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.textDark }]}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Current password"
            placeholderTextColor={theme.textLight}
            secureTextEntry
          />
        </View>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <View style={styles.inputRow}>
          <Ionicons name="lock-open-outline" size={20} color={theme.textLight} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.textDark }]}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New password"
            placeholderTextColor={theme.textLight}
            secureTextEntry
          />
        </View>
      </View>

      <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.secondary }]} onPress={handleChangePassword}>
        <Text style={styles.saveBtnText}>Change Password</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  avatarSection: { alignItems: 'center', paddingVertical: 30 },
  avatarImg: { width: 100, height: 100, borderRadius: 50, borderWidth: 3 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
  editBadge: { position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  changePhotoText: { marginTop: 10, fontSize: 14, fontWeight: '600' },
  sectionTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8, textTransform: 'uppercase' },
  card: { marginHorizontal: 15, borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16 },
  divider: { height: 1, marginLeft: 50 },
  saveBtn: { marginHorizontal: 15, marginTop: 14, padding: 14, borderRadius: 14, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
