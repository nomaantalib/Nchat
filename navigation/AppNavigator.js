import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

import ChatsScreen from '../screens/ChatsScreen';
import CallsScreen from '../screens/CallsScreen';
import MeetScreen from '../screens/MeetScreen';
import StatusScreen from '../screens/StatusScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Chats') {
              iconName = focused ? 'chatbubble' : 'chatbubble-outline';
            } else if (route.name === 'Calls') {
              iconName = focused ? 'call' : 'call-outline';
            } else if (route.name === 'Meet') {
              iconName = focused ? 'videocam' : 'videocam-outline';
            } else if (route.name === 'Status') {
              iconName = focused ? 'disc' : 'disc-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textLight,
          tabBarStyle: {
            backgroundColor: theme.headerBg,
            borderTopColor: theme.border,
            paddingBottom: 5,
            height: 60,
          },
          headerStyle: {
            backgroundColor: theme.headerBg,
          },
          headerTintColor: theme.textDark,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen name="Chats" component={ChatsScreen} />
        <Tab.Screen name="Calls" component={CallsScreen} />
        <Tab.Screen name="Meet" component={MeetScreen} />
        <Tab.Screen name="Status" component={StatusScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
