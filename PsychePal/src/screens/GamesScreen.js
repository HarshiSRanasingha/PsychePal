import React, { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
import { Theme } from '../styles/theme';

const games = {
  Puzzle: ['Monument Valley', 'The Room', 'Lumino City'],
  Relaxing: ["Alto's Odyssey", 'Flower', 'Prune'],
  Word: ['Wordscapes', 'Wordle', 'SpellTower'],
  Strategy: ['Clash of Clans', 'Plants vs Zombies', 'Township'],
};

export default function GamesScreen() {
  const [category, setCategory] = useState('Puzzle');

  function openGame(name) {
    Linking.openURL(`https://play.google.com/store/search?q=${encodeURIComponent(name)}`);
  }

  return (
    <Screen>
      <Text style={styles.heading}>Relaxing Games</Text>
      <Text style={styles.subtitle}>Choose a category and browse suggested games in the Play Store.</Text>
      <View style={styles.categories}>
        {Object.keys(games).map(option => (
          <Pressable key={option} style={[styles.category, category === option && styles.activeCategory]} onPress={() => setCategory(option)}>
            <Text style={[styles.categoryText, category === option && styles.activeCategoryText]}>{option}</Text>
          </Pressable>
        ))}
      </View>
      {games[category].map(game => (
        <SectionCard key={game} title={game} description={`${category} game • Tap to search the Play Store`} onPress={() => openGame(game)} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 6 },
  subtitle: { color: Theme.muted, lineHeight: 20, marginBottom: 16 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 },
  category: { borderWidth: 1, borderColor: Theme.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, marginRight: 6, marginBottom: 6, backgroundColor: Theme.surface },
  activeCategory: { backgroundColor: Theme.primary, borderColor: Theme.primary },
  categoryText: { color: Theme.text }, activeCategoryText: { color: '#FFFFFF', fontWeight: '700' },
});
