import React, { useMemo, useState } from 'react';
import { Alert, Pressable, Text, TextInput, StyleSheet, View } from 'react-native';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
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
      <Text style={styles.heading}>Psychology Library</Text>
      <Text style={styles.subtitle}>Explore locally stored educational resources.</Text>
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
        <SectionCard
          key={item.id}
          title={item.title}
          description={`${item.category} • ${item.description}`}
          onPress={() => showDetails(item)}
        />
      ))}
      {!filtered.length ? <Text style={styles.empty}>No matching resources found.</Text> : null}
    </Screen>
  );
}
const styles = StyleSheet.create({
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 6 },
  subtitle: { color: Theme.muted, marginBottom: 14 },
  input: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 12, padding: 12, marginBottom: 12 },
  filterLabel: { color: Theme.text, fontWeight: '700', marginBottom: 8 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  filter: { minHeight: 34, justifyContent: 'center', paddingHorizontal: 10, borderWidth: 1, borderColor: Theme.border, borderRadius: 8, marginRight: 6, marginBottom: 6 },
  activeFilter: { backgroundColor: Theme.primary, borderColor: Theme.primary },
  filterText: { color: Theme.text },
  activeFilterText: { color: '#FFFFFF', fontWeight: '700' },
  empty: { color: Theme.muted, textAlign: 'center', marginTop: 20 },
});