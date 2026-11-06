import React, { useMemo, useState } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
import resources from '../data/psychologyResources.json';
import { Theme } from '../styles/theme';

export default function ResourcesScreen() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => resources.filter(r => (r.title + ' ' + r.category + ' ' + r.description).toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <Screen>
      <Text style={styles.heading}>Psychology Library</Text>
      <Text style={styles.subtitle}>Explore locally stored educational resources.</Text>
      <TextInput value={query} onChangeText={setQuery} placeholder="Search resources..." style={styles.input} />
      {filtered.map(item => <SectionCard key={item.id} title={item.title} description={`${item.category} • ${item.description}`} />)}
      {!filtered.length ? <Text style={styles.empty}>No matching resources found.</Text> : null}
    </Screen>
  );
}
const styles = StyleSheet.create({
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 6 },
  subtitle: { color: Theme.muted, marginBottom: 14 },
  input: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 12, padding: 12, marginBottom: 16 },
  empty: { color: Theme.muted, textAlign: 'center', marginTop: 20 },
});