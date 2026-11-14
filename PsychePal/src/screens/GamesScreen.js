import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Screen from '../components/Screen';
import CozyHero from '../components/CozyHero';
import { CozyText as Text } from '../components/CozyText';
import TextInput from '../components/CozyInput';
import { Theme } from '../styles/theme';

const games = {
  Puzzle: ['Monument Valley', 'The Room', 'Lumino City'],
  Relaxing: ["Alto's Odyssey", 'Flower', 'Prune'],
  Word: ['Wordscapes', 'Wordle', 'SpellTower'],
  Strategy: ['Clash of Clans', 'Plants vs Zombies', 'Township'],
};

const categoryDetails = {
  Puzzle: 'Puzzle games can offer a focused, low-pressure activity. Choose a level that feels enjoyable and take a break whenever you need one.',
  Relaxing: 'These suggestions are grouped for a quieter play break. The app does not download, stream, or launch games.',
  Word: 'Word games offer a short language-focused activity. The names are saved as local suggestions and can be browsed offline.',
  Strategy: 'Strategy games are listed as local suggestions. No store lookup or internet connection is needed to view this list.',
};

export default function GamesScreen() {
  const [category, setCategory] = useState('Puzzle');
  const [query, setQuery] = useState('');
  const [expandedGame, setExpandedGame] = useState(null);
  const categories = Object.keys(games);
  const filteredGames = useMemo(
    () => games[category].filter(game => game.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())),
    [category, query],
  );

  function chooseCategory(value) {
    setCategory(value);
    setExpandedGame(null);
  }

  return (
    <Screen>
      <CozyHero
        eyebrow="A PLAYFUL PAUSE"
        title="Relaxing games"
        description="Browse locally saved game suggestions. This catalogue works offline."
        art="🧩"
        colors={['#F8EBD6', '#E4F0E7']}
      />
      <TextInput
        accessibilityLabel="Search game suggestions"
        value={query}
        onChangeText={setQuery}
        placeholder="Search game suggestions..."
        style={styles.input}
      />
      <View style={styles.categories}>
        {categories.map(option => {
          const selected = category === option;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={option}
              style={[styles.category, selected && styles.activeCategory]}
              onPress={() => chooseCategory(option)}
            >
              <Text style={[styles.categoryText, selected && styles.activeCategoryText]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.categoryDescription}>{categoryDetails[category]}</Text>
      {filteredGames.map(game => {
        const expanded = expandedGame === game;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded }}
            key={game}
            style={styles.gameCard}
            onPress={() => setExpandedGame(expanded ? null : game)}
          >
            <Text style={styles.gameTitle}>{game}</Text>
            <Text style={styles.gameMeta}>{category} suggestion · {expanded ? 'Hide details' : 'View details'}  ›</Text>
            {expanded ? <Text style={styles.gameDetails}>{categoryDetails[category]}</Text> : null}
          </Pressable>
        );
      })}
      {!filteredGames.length ? <Text style={styles.empty}>No matching game suggestions found.</Text> : null}
      <Text style={styles.note}>These are suggestions only. PsychePal does not install or open third-party games.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 16, padding: 13, marginBottom: 13 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  category: { borderWidth: 1, borderColor: Theme.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9, marginRight: 6, marginBottom: 6, backgroundColor: 'rgba(255,255,255,0.78)' },
  activeCategory: { backgroundColor: Theme.primary, borderColor: Theme.primary },
  categoryText: { color: Theme.text },
  activeCategoryText: { color: '#FFFFFF', fontWeight: '700' },
  categoryDescription: { color: Theme.muted, fontSize: 12, lineHeight: 18, marginBottom: 12 },
  gameCard: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', borderRadius: 18, padding: 15, marginBottom: 9 },
  gameTitle: { color: Theme.text, fontSize: 15, fontWeight: '800' },
  gameMeta: { color: Theme.primaryDark, fontSize: 11, fontWeight: '700', marginTop: 6 },
  gameDetails: { color: Theme.muted, fontSize: 12, lineHeight: 18, marginTop: 9, paddingTop: 9, borderTopWidth: 1, borderTopColor: Theme.border },
  empty: { color: Theme.muted, textAlign: 'center', marginTop: 20 },
  note: { color: Theme.muted, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 8 },
});
