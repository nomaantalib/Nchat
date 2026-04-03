import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { theme } = useTheme();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    const result = await login(email, password);
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
        <View style={styles.authHeader}>
          <View style={[styles.authLogo, { backgroundColor: theme.primary }]}>
            <Ionicons name="paper-plane" size={40} color="white" style={{ transform: [{ rotate: '-45deg' }] }} />
          </View>
          <Text style={[styles.title, { color: theme.textDark }]}>NChat</Text>
          <Text style={{ color: theme.textLight }}>Connect with friends</Text>
        </View>

        <View style={styles.formGroup}>
          <TextInput
            style={[styles.input, { borderColor: theme.border, backgroundColor: theme.headerBg, color: theme.textDark }]}
            placeholder="Email or Phone"
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
          
          <TouchableOpacity style={[styles.authBtn, { backgroundColor: theme.primary }]} onPress={handleLogin}>
            <Text style={styles.authBtnText}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.authBtn, { backgroundColor: theme.secondary, marginTop: 10 }]} 
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.authBtnText}>Create Account</Text>
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
    justifyContent: 'center',
    padding: 30,
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  authLogo: {
    width: 80,
    height: 80,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    transform: [{ rotate: '45deg' }],
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
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
