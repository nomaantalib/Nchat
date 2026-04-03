import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function HelpScreen() {
  const { theme } = useTheme();

  const faqs = [
    { q: 'How do I start a new chat?', a: 'Tap the chat bubble FAB button on the Chats screen to search for a contact and start a conversation.' },
    { q: 'How do I post a status?', a: 'Go to the Status tab and tap the camera FAB button to upload an image or video. It auto-expires after 24 hours.' },
    { q: 'How do I join a video meeting?', a: 'Go to the Meet tab. Either create a new meeting room or enter an existing meeting code to join.' },
    { q: 'Are my messages end-to-end encrypted?', a: 'All messages are transmitted securely over HTTPS. Full E2E encryption is on the roadmap.' },
    { q: 'How do I log out?', a: 'Go to the Profile tab and tap the Log Out button at the bottom.' },
  ];

  const [expanded, setExpanded] = React.useState(null);

  const contactSupport = () => {
    Linking.openURL('mailto:support@nchat.app').catch(() => {
      Alert.alert('Error', 'Could not open email client');
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator indicatorStyle={theme.isDark ? 'white' : 'black'}>

      <Text style={[styles.sectionTitle, { color: theme.primary }]}>Frequently Asked Questions</Text>
      <View style={[styles.card, { backgroundColor: theme.headerBg, borderColor: theme.border }]}>
        {faqs.map((faq, i) => (
          <View key={i}>
            <TouchableOpacity style={styles.faqRow} onPress={() => setExpanded(expanded === i ? null : i)}>
              <Text style={[styles.question, { color: theme.textDark }]}>{faq.q}</Text>
              <Ionicons name={expanded === i ? 'chevron-up' : 'chevron-down'} size={18} color={theme.textLight} />
            </TouchableOpacity>
            {expanded === i && (
              <Text style={[styles.answer, { color: theme.textLight, borderTopColor: theme.border }]}>{faq.a}</Text>
            )}
            {i < faqs.length - 1 && <View style={[styles.divider, { backgroundColor: theme.border }]} />}
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.primary }]}>Contact & Legal</Text>
      <View style={[styles.card, { backgroundColor: theme.headerBg, borderColor: theme.border }]}>
        <TouchableOpacity style={styles.row} onPress={contactSupport}>
          <View style={[styles.iconBox, { backgroundColor: `${theme.primary}18` }]}>
            <Ionicons name="mail-outline" size={20} color={theme.primary} />
          </View>
          <View style={styles.info}>
            <Text style={[styles.label, { color: theme.textDark }]}>Email Support</Text>
            <Text style={[styles.desc, { color: theme.textLight }]}>support@nchat.app</Text>
          </View>
          <Ionicons name="open-outline" size={18} color={theme.textLight} />
        </TouchableOpacity>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <TouchableOpacity style={styles.row} onPress={() => Linking.openURL('https://github.com/nomaantalib/Nchat')}>
          <View style={[styles.iconBox, { backgroundColor: `${theme.primary}18` }]}>
            <Ionicons name="logo-github" size={20} color={theme.primary} />
          </View>
          <View style={styles.info}>
            <Text style={[styles.label, { color: theme.textDark }]}>View Source Code</Text>
            <Text style={[styles.desc, { color: theme.textLight }]}>github.com/nomaantalib/Nchat</Text>
          </View>
          <Ionicons name="open-outline" size={18} color={theme.textLight} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.version, { color: theme.textLight }]}>NChat v1.0.0</Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8, textTransform: 'uppercase' },
  card: { marginHorizontal: 15, borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  faqRow: { flexDirection: 'row', alignItems: 'center', padding: 16, justifyContent: 'space-between' },
  question: { flex: 1, fontSize: 15, fontWeight: '600', paddingRight: 10 },
  answer: { fontSize: 14, lineHeight: 20, paddingHorizontal: 16, paddingBottom: 14, paddingTop: 10, borderTopWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingHorizontal: 16 },
  iconBox: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  info: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  desc: { fontSize: 12 },
  divider: { height: 1, marginLeft: 16 },
  version: { textAlign: 'center', marginTop: 30, fontSize: 13 },
});
