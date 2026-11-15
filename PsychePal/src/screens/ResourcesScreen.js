import React, { useCallback, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Screen from '../components/Screen';
import { CozyText as Text } from '../components/CozyText';
import TextInput from '../components/CozyInput';
import * as LocalStore from '../data/localStore';
import existingResources from '../data/psychologyResources.json';
import { Theme } from '../styles/theme';

const { languages, topics, parseReadResources } = require('../data/readingLibrary');
const READ_KEY = 'readResources';
const colors = ['#F3EAF7', '#EAF3EC', '#FCF1E6', '#E9F1F8', '#F9EAEA'];
const labels = {
  en: { language: '1. Choose a language', category: '2. Choose a category', articles: '3. Pick something to read', search: 'Search resources...', empty: 'No matching resources found.', reads: '5 short reads', read: '✓ Read', open: 'Open short read', mark: 'Mark as read', marked: '✓ Marked as read', saving: 'Saving...', close: 'Close', hint: 'Select a language to see its reading categories.', disclaimer: 'For general education, not a substitute for professional care. Translations have not been professionally reviewed. If there is immediate danger, contact local emergency services.' },
  si: { language: '1. භාෂාවක් තෝරන්න', category: '2. මාතෘකාවක් තෝරන්න', articles: '3. කියවීමට ලිපියක් තෝරන්න', search: 'සම්පත් සොයන්න...', empty: 'ගැළපෙන සම්පත් හමු නොවීය.', reads: 'කෙටි ලිපි 5ක්', read: '✓ කියවා ඇත', open: 'කියවන්න', mark: 'කියවූ බව සලකුණු කරන්න', marked: '✓ කියවා ඇත', saving: 'සුරකිමින්...', close: 'වසන්න', hint: 'මාතෘකා බැලීමට භාෂාවක් තෝරන්න.', disclaimer: 'සාමාන්‍ය දැනුවත් කිරීම සඳහා පමණි; වෘත්තීය ප්‍රතිකාර සඳහා ආදේශකයක් නොවේ. පරිවර්තන වෘත්තීය සමාලෝචනයකට ලක් කර නැත. ක්ෂණික අනතුරකදී හදිසි සේවා අමතන්න.' },
  ta: { language: '1. மொழியைத் தேர்வுசெய்க', category: '2. தலைப்பைத் தேர்வுசெய்க', articles: '3. வாசிக்க ஒன்றைத் தேர்வுசெய்க', search: 'வளங்களைத் தேடுங்கள்...', empty: 'பொருந்தும் வளங்கள் இல்லை.', reads: '5 சிறிய வாசிப்புகள்', read: '✓ வாசித்தது', open: 'வாசிக்கவும்', mark: 'வாசித்ததாகக் குறிக்கவும்', marked: '✓ வாசித்ததாகக் குறிக்கப்பட்டது', saving: 'சேமிக்கிறது...', close: 'மூடு', hint: 'தலைப்புகளைப் பார்க்க ஒரு மொழியைத் தேர்ந்தெடுங்கள்.', disclaimer: 'பொதுக் கல்விக்காக மட்டுமே; தொழில்முறை சிகிச்சைக்கு மாற்றல்ல. மொழிபெயர்ப்புகள் தொழில்முறை மதிப்பாய்வு செய்யப்படவில்லை. உடனடி ஆபத்தில் உள்ளூர் அவசர சேவையைத் தொடர்புகொள்ளுங்கள்.' },
};

export default function ResourcesScreen() {
  const [language, setLanguage] = useState(null);
  const [category, setCategory] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [readIds, setReadIds] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useFocusEffect(useCallback(() => {
    let active = true;
    async function loadProgress() {
      try {
        const saved = await LocalStore.getItem(READ_KEY);
        const parsed = parseReadResources(saved);
        if (active) {
          setReadIds(parsed);
          setLoaded(true);
        }
      } catch (error) {
        if (active) Alert.alert('Could not load reading progress', error.message || 'Please try again.');
      }
    }
    loadProgress();
    return () => { active = false; };
  }, []));

  const languageIndex = languages.findIndex(option => option.code === language);
  const text = labels[language || 'en'];
  const allArticles = languageIndex < 0 ? [] : topics.flatMap(topic =>
    topic.articles.map(([titles, bodies], index) => ({
      id: `${language}:${topic.id}:${index}`,
      category: topic.id,
      categoryName: topic.names[languageIndex],
      title: titles[languageIndex],
      details: `${topic.intro[languageIndex]}\n\n${bodies[languageIndex]}`,
    })));
  if (language === 'en') {
    allArticles.push(...existingResources.map(item => ({
      id: `en:existing:${item.id}`,
      category: 'more',
      categoryName: item.category,
      title: item.title,
      details: `${item.description}\n\n${item.details}`,
    })));
  }
  const search = query.trim().toLocaleLowerCase();
  const articles = category || search ? allArticles.filter(article =>
    (!category || article.category === category)
    && `${article.title} ${article.categoryName} ${article.details}`.toLocaleLowerCase().includes(search)) : [];

  async function markAsRead() {
    if (!selectedArticle || !loaded || saving || readIds.includes(selectedArticle.id)) return;
    const updated = [...readIds, selectedArticle.id];
    setSaving(true);
    try {
      await LocalStore.setItem(READ_KEY, JSON.stringify(updated));
      setReadIds(updated);
    } catch (error) {
      Alert.alert('Could not save reading progress', error.message || 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <View style={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>GROW AT YOUR OWN PACE</Text>
          <Text style={styles.heading}>A little reading nook</Text>
          <Text style={styles.subtitle}>Choose a language, explore a topic, and take a moment to read.</Text>
          <Text style={styles.heroDecoration}>✿</Text>
        </View>
        <Text style={styles.sectionTitle}>{text.language}</Text>
        <View style={styles.languageRow}>
          {languages.map(option => (
            <Pressable key={option.code} accessibilityRole="button" accessibilityState={{ selected: language === option.code }}
              onPress={() => { setLanguage(option.code); setCategory(null); setQuery(''); }}
              style={[styles.language, language === option.code && styles.selected]}>
              <Text style={[styles.languageText, language === option.code && styles.selectedText]}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
        {language ? (
          <>
            <TextInput accessibilityLabel={text.search} value={query} onChangeText={setQuery} placeholder={text.search} style={styles.search} />
            <Text style={styles.sectionTitle}>{text.category}</Text>
            <View style={styles.grid}>
              {topics.map((topic, index) => (
                <Pressable key={topic.id} accessibilityRole="button" accessibilityState={{ selected: category === topic.id }}
                  onPress={() => setCategory(category === topic.id ? null : topic.id)}
                  style={[styles.topic, { backgroundColor: colors[index % colors.length] }, category === topic.id && styles.selectedTopic]}>
                  <Text style={styles.topicIcon}>{['✿', '☼', '☁', '☾', '♡'][index % 5]}</Text>
                  <Text style={styles.topicName}>{topic.names[languageIndex]}</Text>
                  <Text style={styles.topicCount}>{text.reads}</Text>
                </Pressable>
              ))}
              {language === 'en' ? (
                <Pressable accessibilityRole="button" accessibilityState={{ selected: category === 'more' }}
                  onPress={() => setCategory(category === 'more' ? null : 'more')} style={[styles.topic, styles.moreTopic, category === 'more' && styles.selectedTopic]}>
                  <Text style={styles.topicIcon}>✦</Text>
                  <Text style={styles.topicName}>More reading</Text>
                  <Text style={styles.topicCount}>{existingResources.length} existing resources</Text>
                </Pressable>
              ) : null}
            </View>
          </>
        ) : <Text style={styles.hint}>{text.hint}</Text>}
        {category || search ? (
          <>
            <Text style={styles.sectionTitle}>{text.articles}</Text>
            {articles.map(article => (
              <Pressable key={article.id} accessibilityRole="button" onPress={() => setSelectedArticle(article)} style={styles.article}>
                <View style={styles.articleCopy}>
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <Text style={styles.articleStatus}>{readIds.includes(article.id) ? text.read : text.open}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </Pressable>
            ))}
            {!articles.length ? <Text style={styles.hint}>{text.empty}</Text> : null}
          </>
        ) : null}
        <Text style={styles.disclaimer}>{text.disclaimer}</Text>
        <Modal visible={!!selectedArticle} animationType="slide" transparent onRequestClose={() => setSelectedArticle(null)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.reader}>
              <ScrollView contentContainerStyle={styles.readerContent}>
                <Text style={styles.readerTitle}>{selectedArticle?.title}</Text>
                <Text style={styles.readerBody}>{selectedArticle?.details}</Text>
                <Pressable accessibilityRole="button" disabled={!loaded || saving || readIds.includes(selectedArticle?.id)}
                  onPress={markAsRead} style={[styles.markButton, (!loaded || saving || readIds.includes(selectedArticle?.id)) && styles.disabled]}>
                  <Text style={styles.markText}>{readIds.includes(selectedArticle?.id) ? text.marked : saving ? text.saving : text.mark}</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={() => setSelectedArticle(null)} style={styles.closeButton}>
                  <Text style={styles.closeText}>{text.close}</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { width: '100%', maxWidth: 900, alignSelf: 'center' },
  hero: { minHeight: 160, justifyContent: 'center', backgroundColor: '#E8EDF3', overflow: 'hidden', borderRadius: 26, padding: 22, marginBottom: 20 },
  eyebrow: { color: Theme.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginBottom: 8 },
  heading: { fontSize: 25, fontWeight: '800', color: Theme.text, marginBottom: 6 },
  subtitle: { color: Theme.muted, lineHeight: 21, maxWidth: '84%' },
  heroDecoration: { position: 'absolute', fontSize: 110, right: -2, bottom: -34, color: 'rgba(255,255,255,0.42)' },
  sectionTitle: { color: Theme.text, fontSize: 17, fontWeight: '800', marginTop: 16, marginBottom: 12 },
  languageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  language: { backgroundColor: Theme.surface, borderRadius: 18, borderWidth: 1, borderColor: Theme.border, paddingVertical: 11, paddingHorizontal: 16 },
  selected: { backgroundColor: Theme.primaryDark, borderColor: Theme.primaryDark },
  languageText: { color: Theme.text, fontWeight: '700' },
  selectedText: { color: '#FFFFFF' },
  search: { backgroundColor: Theme.surface, borderRadius: 16, borderWidth: 1, borderColor: Theme.border, padding: 14, marginTop: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  topic: { width: '48%', minHeight: 130, borderWidth: 2, borderColor: 'transparent', borderRadius: 21, padding: 15, marginBottom: 12 },
  moreTopic: { backgroundColor: '#EAF3EC' },
  selectedTopic: { borderColor: Theme.primary },
  topicIcon: { color: Theme.primaryDark, fontSize: 27, marginBottom: 5 },
  topicName: { color: Theme.text, fontSize: 15, fontWeight: '800', lineHeight: 21 },
  topicCount: { color: Theme.muted, fontSize: 12, marginTop: 5 },
  article: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.surface, borderRadius: 18, padding: 16, marginBottom: 9 },
  articleCopy: { flex: 1 },
  articleTitle: { color: Theme.text, fontSize: 15, fontWeight: '800', lineHeight: 22 },
  articleStatus: { color: Theme.primaryDark, marginTop: 5, fontSize: 12, fontWeight: '700' },
  arrow: { color: Theme.primary, fontSize: 27, marginLeft: 10 },
  hint: { color: Theme.muted, lineHeight: 21, marginTop: 15 },
  disclaimer: { color: Theme.muted, fontSize: 12, lineHeight: 18, marginTop: 20 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(30,40,35,0.45)', justifyContent: 'center', padding: 18 },
  reader: { maxHeight: '85%', width: '100%', maxWidth: 650, alignSelf: 'center', backgroundColor: '#FFFEFA', borderRadius: 25 },
  readerContent: { padding: 24 },
  readerTitle: { color: '#34433D', fontSize: 23, lineHeight: 31, fontWeight: '800', marginBottom: 18 },
  readerBody: { color: '#34433D', fontSize: 16, lineHeight: 26 },
  markButton: { backgroundColor: '#648C75', borderRadius: 18, padding: 15, alignItems: 'center', marginTop: 24 },
  markText: { color: '#FFFFFF', fontWeight: '800' },
  disabled: { opacity: 0.6 },
  closeButton: { alignItems: 'center', padding: 14 },
  closeText: { color: '#547260', fontWeight: '800' },
});
