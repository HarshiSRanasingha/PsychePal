import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
import music from '../data/music.json';
import books from '../data/books.json';
import movies from '../data/movies.json';
import { Theme } from '../styles/theme';

const media = [
  ['Music', 'Nature, relaxing music and calm playlists', music],
  ['Books', 'Fiction, poetry and reflective reading', books],
  ['Movies', 'Drama, comedy and feel-good stories', movies],
];

export default function RecommendationsScreen() {
  const [selectedType, setSelectedType] = useState('Music');
  const [category, setCategory] = useState('All');
  const selectedMedia = media.find(([type]) => type === selectedType)?.[2] || [];
  const categories = useMemo(() => ['All', ...new Set(selectedMedia.map(item => item.category))], [selectedType, selectedMedia]);
  const filtered = selectedMedia.filter(item => category === 'All' || item.category === category);

  return (
    <Screen>
      <Text style={styles.heading}>Recommendations</Text>
      <Text style={styles.subtitle}>Choose a type, then narrow the selection to what fits your mood.</Text>
      <View style={styles.types}>
        {media.map(([type, description]) => (
          <Pressable
            key={type}
            style={[styles.typeCard, selectedType === type && styles.activeType]}
            onPress={() => { setSelectedType(type); setCategory('All'); }}
          >
            <Text style={[styles.typeTitle, selectedType === type && styles.activeTypeText]}>{type}</Text>
            <Text style={[styles.typeDescription, selectedType === type && styles.activeTypeText]}>{description}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.label}>Category</Text>
      <View style={styles.categories}>
        {categories.map(option => (
          <Pressable key={option} style={[styles.category, category === option && styles.activeCategory]} onPress={() => setCategory(option)}>
            <Text style={[styles.categoryText, category === option && styles.activeCategoryText]}>{option}</Text>
          </Pressable>
        ))}
      </View>
      {filtered.map(item => <SectionCard key={item.id} title={item.title} description={`${item.language} • ${item.category}`} />)}
      {!filtered.length ? <Text style={styles.empty}>No recommendations match this category.</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 6 },
  subtitle: { color: Theme.muted, lineHeight: 20, marginBottom: 16 },
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  typeCard: { width: '48%', minHeight: 96, backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 16, padding: 12 },
  activeType: { backgroundColor: Theme.primary, borderColor: Theme.primary },
  typeTitle: { color: Theme.primaryDark, fontSize: 17, fontWeight: '800', marginBottom: 5 },
  typeDescription: { color: Theme.muted, fontSize: 12, lineHeight: 17 },
  activeTypeText: { color: '#FFFFFF' },
  label: { color: Theme.text, fontWeight: '700', marginBottom: 8 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 },
  category: { borderWidth: 1, borderColor: Theme.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, marginRight: 6, marginBottom: 6, backgroundColor: Theme.surface },
  activeCategory: { backgroundColor: Theme.primary, borderColor: Theme.primary },
  categoryText: { color: Theme.text, fontSize: 12 },
  activeCategoryText: { color: '#FFFFFF', fontWeight: '700' },
  empty: { color: Theme.muted, textAlign: 'center', marginTop: 18 },
});