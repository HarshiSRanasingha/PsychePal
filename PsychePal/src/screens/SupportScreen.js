import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import support from '../data/supportContacts.json';
import { Theme } from '../styles/theme';

export default function SupportScreen() {
  return (
    <Screen>
      <Text style={styles.heading}>Support Directory</Text>
      <Text style={styles.note}>Contact details must be verified before using or publishing this directory. If you are in immediate danger, contact local emergency services or a trusted person.</Text>
      {support.map(item => <Text key={item.id} style={styles.card}>{item.name}{'\\n'}{item.description}{'\\n'}{item.contact}</Text>)}
    </Screen>
  );
}
const styles = StyleSheet.create({
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 10 },
  note: { color: Theme.muted, lineHeight: 20, marginBottom: 14 },
  card: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 12, padding: 14, marginBottom: 10, color: Theme.text, lineHeight: 21 },
});