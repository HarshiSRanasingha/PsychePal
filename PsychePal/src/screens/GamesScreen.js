import React, { useState } from 'react';
import { Alert, Linking, Platform, Pressable, StyleSheet, View } from 'react-native';
import Screen from '../components/Screen';
import CozyHero from '../components/CozyHero';
import SectionCard from '../components/SectionCard';
import { CozyText as Text } from '../components/CozyText';
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
    const url = Platform.OS === 'ios'
      ? `https://apps.apple.com/search?term=${encodeURIComponent(name)}`
      : `https://play.google.com/store/search?q=${encodeURIComponent(name)}`;
    Linking.openURL(url).catch(error => {
      Alert.alert('Could not open game store', error.message || 'Please try again.');
    });
  }

  return (
    <Screen>
      <CozyHero
        eyebrow="A PLAYFUL PAUSE"
        title="Relaxing games"
        description={`Browse gentle ${Platform.OS === 'ios' ? 'App Store' : 'Play Store'} suggestions for a little break.`}
        art="🧩"
        colors={['#F8EBD6', '#E4F0E7']}
      />
      <View style={styles.categories}>
        {Object.keys(games).map(option => (
          <Pressable key={option} accessibilityRole="button" accessibilityState={{ selected: category === option }} style={[styles.category, category === option && styles.activeCategory]} onPress={() => setCategory(option)}>
            <Text style={[styles.categoryText, category === option && styles.activeCategoryText]}>{option}</Text>
          </Pressable>
        ))}
      </View>
      {games[category].map(game => (
        <SectionCard key={game} title={game} description={`${category} game • Tap to search the store`} onPress={() => openGame(game)} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  categories: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 },
  category: { borderWidth: 1, borderColor: Theme.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9, marginRight: 6, marginBottom: 6, backgroundColor: 'rgba(255,255,255,0.78)' },
  activeCategory: { backgroundColor: Theme.primary, borderColor: Theme.primary },
  categoryText: { color: Theme.text }, activeCategoryText: { color: '#FFFFFF', fontWeight: '700' },
});
