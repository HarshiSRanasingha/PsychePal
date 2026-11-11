import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import Screen from '../components/Screen';
import { ResourceArtwork } from '../components/CozyArt';
import { CozyText as Text } from '../components/CozyText';
import TextInput from '../components/CozyInput';
import resources from '../data/psychologyResources.json';
import { Theme } from '../styles/theme';

export default function ResourcesScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const categories = ['All', ...new Set(resources.map(resource => resource.category))];
  const filtered = useMemo(() => resources.filter(resource => {
    const matchesCategory = category === 'All' || resource.category === category;
    const searchableText = `${resource.title} ${resource.category} ${resource.description} ${resource.details}`.toLowerCase();
    return matchesCategory && searchableText.includes(query.trim().toLowerCase());
  }), [query, category]);

  function showDetails(resource) {
    Alert.alert(resource.title, `${resource.category}\n\n${resource.details}`);
  }
  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>GROW AT YOUR OWN PACE</Text>
        <Text style={styles.heading}>A little reading nook</Text>
        <Text style={styles.subtitle}>Gentle ideas for understanding and caring for yourself.</Text>
        <Text style={styles.heroDecoration}>✿</Text>
      </View>
      <TextInput value={query} onChangeText={setQuery} placeholder="Search resources..." style={styles.input} />
      <Text style={styles.filterLabel}>Filter by category</Text>
      <View style={styles.filters}>
        {categories.map(option => (
          <Pressable
            key={option}
            onPress={() => setCategory(option)}
            style={[styles.filter, category === option && styles.activeFilter]}
          >
            <Text style={[styles.filterText, category === option && styles.activeFilterText]}>{option}</Text>
          </Pressable>
        ))}
      </View>
      {filtered.map(item => (
        <Pressable
          accessibilityRole="button"
          key={item.id}
          onPress={() => showDetails(item)}
          style={({ pressed }) => [styles.resourceCard, pressed && styles.pressed]}
        >
          <ResourceArtwork category={item.category} />
          <View style={styles.resourceCopy}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.resourceTitle}>{item.title}</Text>
            <Text style={styles.resourceDescription}>{item.description}</Text>
            <Text style={styles.readMore}>Read a little  ›</Text>
          </View>
        </Pressable>
      ))}
      {filtered.length ? <Text style={styles.count}>{filtered.length} {filtered.length === 1 ? 'resource' : 'resources'} found</Text> : null}
      {!filtered.length ? <Text style={styles.empty}>No matching resources found.</Text> : null}
    </Screen>
  );
}
const styles = StyleSheet.create({
  hero: { minHeight: 153, justifyContent: 'center', backgroundColor: '#E8EDF3', overflow: 'hidden', borderRadius: 24, padding: 19, marginBottom: 17 },
  eyebrow: { color: Theme.primary, fontSize: 9, fontWeight: '800', letterSpacing: 1.4, marginBottom: 8 },
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 6 },
  subtitle: { color: Theme.muted, lineHeight: 20, maxWidth: '84%' },
  heroDecoration: { position: 'absolute', fontSize: 110, right: -2, bottom: -34, color: 'rgba(255,255,255,0.42)' },
  input: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 16, padding: 13, marginBottom: 12 },
  filterLabel: { color: Theme.text, fontWeight: '700', marginBottom: 8 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  filter: { minHeight: 36, justifyContent: 'center', paddingHorizontal: 12, borderWidth: 1, borderColor: Theme.border, borderRadius: 18, marginRight: 6, marginBottom: 6, backgroundColor: 'rgba(255,255,255,0.62)' },
  activeFilter: { backgroundColor: '#729A87', borderColor: '#729A87' },
  filterText: { color: Theme.text },
  activeFilterText: { color: '#FFFFFF', fontWeight: '700' },
  resourceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.surface, borderRadius: 21, padding: 13, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', elevation: 2, shadowColor: '#788078', shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  pressed: { opacity: 0.84 },
  resourceCopy: { flex: 1, paddingLeft: 13 },
  category: { color: Theme.primary, fontWeight: '800', fontSize: 9, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4 },
  resourceTitle: { color: Theme.text, fontSize: 14, fontWeight: '800', lineHeight: 19 },
  resourceDescription: { color: Theme.muted, fontSize: 11, lineHeight: 16, marginTop: 4 },
  readMore: { color: Theme.primaryDark, fontWeight: '700', fontSize: 11, marginTop: 7 },
  empty: { color: Theme.muted, textAlign: 'center', marginTop: 20 },
  count: { color: Theme.muted, fontSize: 12, textAlign: 'center', marginTop: 4 },
});