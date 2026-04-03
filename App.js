import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Platform } from 'react-native';

// Advanced Permission Managers
import { Camera } from 'expo-camera';
import * as Contacts from 'expo-contacts';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

// Enhance Web UI with slim transparent scrollbars globally
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(150, 150, 150, 0.3);
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(150, 150, 150, 0.6);
    }
  `;
  document.head.appendChild(style);
}

export default function App() {

  useEffect(() => {
    const requestCorePermissions = async () => {
      try {
        const { status: camStatus } = await Camera.requestCameraPermissionsAsync();
        const { status: micStatus } = await Camera.requestMicrophonePermissionsAsync();
        const { status: conStatus } = await Contacts.requestPermissionsAsync();
        const { status: libStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log("Core Permissions Status:", { camStatus, micStatus, conStatus, libStatus });
      } catch (err) {
        console.log("Permission system ignored on Web or missing modules", err);
      }
    };
    
    requestCorePermissions();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
