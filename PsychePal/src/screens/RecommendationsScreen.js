import React, { useMemo, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import Screen from '../components/Screen';
import CozyHero from '../components/CozyHero';
import { CozyText as Text } from '../components/CozyText';
import TextInput from '../components/CozyInput';
import recommendationCatalog from '../data/recommendationCatalog.json';
import socialLinks from '../data/socialLinks.json';
import { Theme } from '../styles/theme';

function makeRecommendations(type) {
  return Object.entries(recommendationCatalog[type]).flatMap(([category, entries]) =>
    entries.map((entry, index) => {
      const isGame = type === 'Web Games';
      const title = isGame ? entry[0] : entry;
      return {
        id: `${type}-${category}-${index}`,
        title,
        category,
        language: isGame ? 'Web' : 'Not specified',
        description: isGame ? 'Play this game on its website.' : `A ${category.toLowerCase()} ${type === 'Music' ? 'listening' : type === 'Books' ? 'reading' : 'film'} suggestion.`,
        details: isGame
          ? 'The game opens on a third-party website and requires an internet connection.'
          : 'This is a suggestion saved on your device. PsychePal does not provide the book, music, or film itself.',
        ...(isGame ? { url: entry[1] } : {}),
      };
    }),
  );
}

const catalogs = {
  Books: makeRecommendations('Books'),
  Music: makeRecommendations('Music'),
  Films: makeRecommendations('Films'),
  'Web Games': makeRecommendations('Web Games'),
};
const types = [...Object.keys(catalogs), 'Social Media'];

async function openWebsite(url) {
  try {
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert('Unable to open website', error.message || 'Please check your connection and try again.');
  }
}

export default function RecommendationsScreen() {
  const [selectedType, setSelectedType] = useState('Music');
  const [category, setCategory] = useState('All');
  const [language, setLanguage] = useState('All');
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const items = catalogs[selectedType] || [];
  const categories = ['All', ...new Set(items.map(item => item.category))];
  const languages = ['All', ...new Set(items.map(item => item.language))];

  const filteredItems = useMemo(() => {
    const searchTerm = query.trim().toLocaleLowerCase();
    return items.filter(item => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesLanguage = language === 'All' || item.language === language;
      const searchableText = `${item.title} ${item.language} ${item.category} ${item.description} ${item.details}`.toLocaleLowerCase();
      return matchesCategory && matchesLanguage && searchableText.includes(searchTerm);
    });
  }, [items, category, language, query]);

  function chooseType(type) {
    setSelectedType(type);
    setCategory('All');
    setLanguage('All');
    setQuery('');
    setExpandedId(null);
  }

  function renderFilter(value, selectedValue, onSelect) {
    const selected = selectedValue === value;
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        key={value}
        onPress={() => onSelect(value)}
        style={[styles.chip, selected && styles.activeChip]}
      >
        <Text style={[styles.chipText, selected && styles.activeChipText]}>{value}</Text>
      </Pressable>
    );
  }

  return (
    <Screen>
      <CozyHero
        eyebrow="A LITTLE INSPIRATION"
        title="Find something you love"
        description="Browse recommendations offline. Web games and social platforms open online."
        art="🦋"
        colors={['#F7E5D9', '#E9E6F3']}
      />
      <View style={styles.types}>
        {types.map(type => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selectedType === type }}
            key={type}
            style={[styles.typeCard, selectedType === type && styles.activeType]}
            onPress={() => chooseType(type)}
          >
            <Text style={[styles.typeTitle, selectedType === type && styles.activeTypeText]}>{type}</Text>
            <Text style={[styles.typeDescription, selectedType === type && styles.activeTypeText]}>
              {type === 'Social Media' ? `${socialLinks.length} website links` : `${catalogs[type].length} offline recommendations`}
            </Text>
          </Pressable>
        ))}
      </View>
      {selectedType === 'Social Media' ? (
        <View>
          <Text style={styles.offlineNote}>These buttons open third-party websites and require an internet connection.</Text>
          {socialLinks.map(link => (
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`Open ${link.title}`}
              key={link.title}
              onPress={() => openWebsite(link.url)}
              style={styles.websiteButton}
            >
              <Text style={styles.websiteText}>{link.title}  ›</Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <>
          {selectedType === 'Web Games' ? <Text style={styles.offlineNote}>Game listings are available offline; playing requires an internet connection. Some games may require an account or payment.</Text> : null}
          <TextInput
            accessibilityLabel="Search recommendations"
            value={query}
            onChangeText={setQuery}
            placeholder={`Search ${selectedType.toLowerCase()}...`}
            style={styles.input}
          />
          <Text style={styles.label}>Filter by category</Text>
          <View style={styles.filters}>
            {categories.map(value => renderFilter(value, category, setCategory))}
          </View>
          {languages.length > 2 ? (
            <>
              <Text style={styles.label}>Filter by language or style</Text>
              <View style={styles.filters}>
                {languages.map(value => renderFilter(value, language, setLanguage))}
              </View>
            </>
          ) : null}
          <Text style={styles.sectionHeading}>
            {filteredItems.length} {filteredItems.length === 1 ? 'recommendation' : 'recommendations'}
          </Text>
          {filteredItems.map(item => {
            const expanded = expandedId === item.id;
            return (
              <View key={item.id} style={styles.resultCard}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                  accessibilityLabel={`${expanded ? 'Hide' : 'View'} details for ${item.title}`}
                  onPress={() => setExpandedId(expanded ? null : item.id)}
                  style={({ pressed }) => pressed && styles.pressed}
                >
                  <Text style={styles.category}>{item.category}{item.language !== 'Not specified' && item.language !== 'Web' ? ` · ${item.language}` : ''}</Text>
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.readMore}>{expanded ? 'Hide details  ‹' : 'View details  ›'}</Text>
                  {expanded ? <Text style={styles.details}>{item.details}</Text> : null}
                </Pressable>
                {item.url ? (
                  <Pressable
                    accessibilityRole="link"
                    accessibilityLabel={`Play ${item.title}`}
                    onPress={() => openWebsite(item.url)}
                    style={styles.websiteButton}
                  >
                    <Text style={styles.websiteText}>Play online  ›</Text>
                  </Pressable>
                ) : null}
              </View>
            );
          })}
          {!filteredItems.length ? <Text style={styles.empty}>No matching recommendations found.</Text> : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeCard: { flex: 1, minWidth: '30%', minHeight: 75, justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.78)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', borderRadius: 18, padding: 12 },
  activeType: { backgroundColor: Theme.primary, borderColor: Theme.primary },
  typeTitle: { color: Theme.primaryDark, fontSize: 16, fontWeight: '800', marginBottom: 4 },
  typeDescription: { color: Theme.muted, fontSize: 10, lineHeight: 15 },
  activeTypeText: { color: '#FFFFFF' },
  input: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 16, padding: 13, marginBottom: 13 },
  label: { color: Theme.text, fontWeight: '700', marginBottom: 7 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 9 },
  chip: { borderWidth: 1, borderColor: Theme.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, marginRight: 6, marginBottom: 6, backgroundColor: 'rgba(255,255,255,0.76)' },
  activeChip: { backgroundColor: Theme.primary, borderColor: Theme.primary },
  chipText: { color: Theme.text, fontSize: 12 },
  activeChipText: { color: '#FFFFFF', fontWeight: '700' },
  sectionHeading: { color: Theme.text, fontSize: 17, fontWeight: '800', marginTop: 6, marginBottom: 9 },
  resultCard: { backgroundColor: Theme.surface, borderRadius: 19, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)' },
  pressed: { opacity: 0.84 },
  category: { color: Theme.primary, fontWeight: '800', fontSize: 10, letterSpacing: 0.5, marginBottom: 5 },
  resultTitle: { color: Theme.text, fontSize: 16, fontWeight: '800', lineHeight: 21 },
  description: { color: Theme.muted, fontSize: 12, lineHeight: 18, marginTop: 5 },
  readMore: { color: Theme.primaryDark, fontWeight: '700', fontSize: 12, marginTop: 8 },
  details: { color: Theme.text, fontSize: 12, lineHeight: 19, marginTop: 8, paddingTop: 9, borderTopWidth: 1, borderTopColor: Theme.border },
  empty: { color: Theme.muted, textAlign: 'center', marginTop: 20 },
  offlineNote: { color: Theme.muted, fontSize: 12, lineHeight: 18, marginBottom: 13 },
  websiteButton: { backgroundColor: Theme.lavender, borderRadius: 14, padding: 12, marginTop: 8 },
  websiteText: { color: Theme.primaryDark, fontWeight: '700' },
});
