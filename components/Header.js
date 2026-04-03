import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function Header({ title }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
      <Text style={[styles.title, { color: theme.textDark }]}>{title}</Text>
      <View style={styles.icons}>
        <Ionicons name="search" size={24} color={theme.textLight} style={styles.icon} />
        <Ionicons name="ellipsis-vertical" size={24} color={theme.textLight} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
});
