import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const { theme } = useTheme();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const result = await register(name, email, password);
    if (!result.success) {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={theme.textDark} />
        </TouchableOpacity>
        
        <View style={styles.authHeader}>
          <Text style={[styles.title, { color: theme.textDark }]}>Create Account</Text>
          <Text style={{ color: theme.textLight }}>Join NChat today</Text>
        </View>

        <View style={styles.formGroup}>
          <TextInput
            style={[styles.input, { borderColor: theme.border, backgroundColor: theme.headerBg, color: theme.textDark }]}
            placeholder="Full Name"
            placeholderTextColor={theme.textLight}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInput
            style={[styles.input, { borderColor: theme.border, backgroundColor: theme.headerBg, color: theme.textDark }]}
            placeholder="Email Address"
            placeholderTextColor={theme.textLight}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={[styles.input, { borderColor: theme.border, backgroundColor: theme.headerBg, color: theme.textDark }]}
            placeholder="Password"
            placeholderTextColor={theme.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity style={[styles.authBtn, { backgroundColor: theme.primary }]} onPress={handleRegister}>
            <Text style={styles.authBtnText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 30,
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  authHeader: {
    marginBottom: 40,
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  formGroup: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  authBtn: {
    width: '100%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  authBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
