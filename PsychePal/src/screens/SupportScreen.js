import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import Screen from '../components/Screen';
import support from '../data/supportContacts.json';
import { Theme } from '../styles/theme';

export default function SupportScreen() {
  const languages = ['All', ...new Set(support.map(item => item.language).filter(Boolean))];
  const [language, setLanguage] = useState('All');
  const filtered = support.filter(item => language === 'All' || item.language === language);
  return (
    <Screen>
      <Text style={styles.heading}>Support Directory</Text>
      <Text style={styles.note}>Contact details must be verified before using or publishing this directory. If you are in immediate danger, contact local emergency services or a trusted person.</Text>
      <View style={styles.languages}>
        {languages.map(option => (
          <Pressable key={option} style={[styles.language, language === option && styles.activeLanguage]} onPress={() => setLanguage(option)}>
            <Text style={[styles.languageText, language === option && styles.activeLanguageText]}>{option}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.helpline}><Text style={styles.helplineTitle}>Sri Lanka 24/7 helpline</Text><Text style={styles.helplineNumber}>1333</Text></View>
      {filtered.map(item => <Text key={item.id} style={styles.card}>{item.name}{'\n'}{item.description}{'\n'}{item.contact}</Text>)}
    </Screen>
  );
}
const styles = StyleSheet.create({
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 10 },
  note: { color: Theme.muted, lineHeight: 20, marginBottom: 14 },
  card: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 12, padding: 14, marginBottom: 10, color: Theme.text, lineHeight: 21 },
  languages: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  language: { borderWidth: 1, borderColor: Theme.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, marginRight: 6, marginBottom: 6 },
  activeLanguage: { backgroundColor: Theme.primary, borderColor: Theme.primary },
  languageText: { color: Theme.text },
  activeLanguageText: { color: '#FFFFFF', fontWeight: '700' },
  helpline: { backgroundColor: Theme.lavender, borderRadius: 14, padding: 14, marginBottom: 12 },
  helplineTitle: { color: Theme.primaryDark, fontWeight: '700' },
  helplineNumber: { color: Theme.primaryDark, fontSize: 26, fontWeight: '800', marginTop: 4 },
});