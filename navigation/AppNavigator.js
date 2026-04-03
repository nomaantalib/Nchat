import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

import ChatsScreen from '../screens/ChatsScreen';
import CallsScreen from '../screens/CallsScreen';
import MeetScreen from '../screens/MeetScreen';
import StatusScreen from '../screens/StatusScreen';
import ProfileScreen from '../screens/ProfileScreen';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import StoryViewerScreen from '../screens/StoryViewerScreen';
import CallScreen from '../screens/CallScreen';
import AccountScreen from '../screens/settings/AccountScreen';
import NotificationsScreen from '../screens/settings/NotificationsScreen';
import PrivacyScreen from '../screens/settings/PrivacyScreen';
import ChatsSettingsScreen from '../screens/settings/ChatsSettingsScreen';
import HelpScreen from '../screens/settings/HelpScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Chats') iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          else if (route.name === 'Calls') iconName = focused ? 'call' : 'call-outline';
          else if (route.name === 'Meet') iconName = focused ? 'videocam' : 'videocam-outline';
          else if (route.name === 'Status') iconName = focused ? 'disc' : 'disc-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          return (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{ scale: focused ? 1.18 : 1 }],
            }}>
              {focused && (
                <View style={{
                  position: 'absolute',
                  top: -6,
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: `${theme.primary}22`,
                }} />
              )}
              <Ionicons name={iconName} size={focused ? 26 : 22} color={color} />
            </View>
          );
        },
        tabBarLabel: ({ focused, color }) => (
          <Text style={{
            fontSize: focused ? 11 : 10,
            fontWeight: focused ? '800' : '500',
            color,
            letterSpacing: focused ? 0.4 : 0,
            marginBottom: 2,
          }}>
            {route.name}
          </Text>
        ),
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textLight,
        tabBarStyle: {
          backgroundColor: theme.headerBg,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          paddingBottom: 6,
          paddingTop: 6,
          height: 68,
          elevation: 12,
          shadowColor: theme.primary,
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: -3 },
          shadowRadius: 10,
        },
        headerStyle: { backgroundColor: theme.headerBg },
        headerTintColor: theme.textDark,
        headerTitleStyle: { fontWeight: '800', fontSize: 18, letterSpacing: 0.3 },
      })}
    >
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Calls" component={CallsScreen} />
      <Tab.Screen name="Meet" component={MeetScreen} />
      <Tab.Screen name="Status" component={StatusScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
      <Stack.Screen name="StoryViewer" component={StoryViewerScreen} />
      <Stack.Screen name="CallScreen" component={CallScreen} />
      <Stack.Screen name="AccountSettings" component={AccountScreen} options={{ headerShown: true, title: 'Account' }} />
      <Stack.Screen name="NotificationsSettings" component={NotificationsScreen} options={{ headerShown: true, title: 'Notifications' }} />
      <Stack.Screen name="PrivacySettings" component={PrivacyScreen} options={{ headerShown: true, title: 'Privacy' }} />
      <Stack.Screen name="ChatsSettings" component={ChatsSettingsScreen} options={{ headerShown: true, title: 'Chats' }} />
      <Stack.Screen name="HelpSettings" component={HelpScreen} options={{ headerShown: true, title: 'Help' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { theme } = useTheme();
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {currentUser ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
