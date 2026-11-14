import React, { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as LocalStore from '../data/localStore';
import Screen from '../components/Screen';
import { SoftLandscape } from '../components/CozyArt';
import { CozyText as Text } from '../components/CozyText';
import { useAppSettings } from '../context/AppSettingsContext';
import quotes from '../data/dailyQuotes.json';
import { Theme } from '../styles/theme';

const selfCareSuggestions = [
  'Take a five-minute pause and notice three things around you.',
  'Drink a glass of water and stretch your shoulders.',
  'Write down one thing that feels manageable today.',
  'Step outside or look through a window for a few minutes.',
  'Send a kind message to someone you trust.',
  'Choose one small task and complete it without rushing.',
  'Put your phone aside for ten quiet minutes.',
];

const exploreItems = [
  { title: 'Mood History', description: 'Review your previous mood check-ins.', icon: '▥', background: '#F3FAF5', accent: '#D5EFE0', iconColor: '#278657' },
  { title: 'Thought Reflection', description: 'Explore self-awareness, personality, strengths, and thoughts.', icon: '☁', background: '#F4F8FF', accent: '#D9E8FC', iconColor: '#266FB8' },
  { title: 'Relaxation Toolkit', description: 'Try a breathing or grounding exercise.', icon: '❧', background: '#FFFAF1', accent: '#FFEAC1', iconColor: '#A86708' },
  { title: 'Recommendations', description: 'Browse books, music, and movie suggestions.', icon: '♥', background: '#FFF5F8', accent: '#FADDEB', iconColor: '#B83F78' },
  { title: 'Personal Diary', description: 'Write and manage private journal entries.', icon: '▤', background: '#F9F6FF', accent: '#E9DFFC', iconColor: '#7852B5' },
  { title: 'Support Directory', description: 'Find relevant support contact information.', icon: '☎', background: '#FFF7F1', accent: '#FFE4D1', iconColor: '#B55A1B' },
];

export default function HomeScreen({ navigation }) {
  const { width, fontScale } = useWindowDimensions();
  const { darkMode } = useAppSettings();
  const [todayMood, setTodayMood] = useState(null);
  const [profileSettings, setProfileSettings] = useState({ preferredName: '', showDailyMotivation: true, showSelfCare: true });
  const today = new Date();
  const dayIndex = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
  const quote = quotes[dayIndex % quotes.length];
  const selfCare = selfCareSuggestions[dayIndex % selfCareSuggestions.length];
  const moodActivities = {
    Distressed: [['Chat', 'Talk it through in a safe space'], ['Relaxation Toolkit', 'Try a calming grounding exercise'], ['Recommendations', 'Find gentle music and media']],
    Happy: [['Recommendations', 'Keep the good feeling going'], ['Personal Diary', 'Capture what is going well'], ['Chat', 'Share a positive moment']],
    Neutral: [['Recommendations', 'Explore books, movies, and music'], ['Thought Reflection', 'Check in with what you need'], ['Relaxation Toolkit', 'Take a mindful pause']],
    Sad: [['Recommendations', 'Find comfort through music and books'], ['Chat', 'Talk through difficult feelings'], ['Thought Reflection', 'Notice thoughts with kindness']],
    Tired: [['Recommendations', 'Choose low-energy entertainment'], ['Relaxation Toolkit', 'Use a short rest timer'], ['Personal Diary', 'Write down tomorrow’s priorities']],
    Angry: [['Relaxation Toolkit', 'Pause and regulate with breathing'], ['Personal Diary', 'Write before you respond'], ['Chat', 'Reflect on what triggered the feeling']],
    Anxious: [['Relaxation Toolkit', 'Try 4-7-8 breathing or grounding'], ['Thought Reflection', 'Separate facts from worried thoughts'], ['Chat', 'Talk through the next safe step']],
    Calm: [['Thought Reflection', 'Explore what helped you feel settled'], ['Personal Diary', 'Save a gratitude note'], ['Recommendations', 'Choose something uplifting']],
  };
  const suggestedActivities = todayMood ? moodActivities[todayMood.mood] || [] : [];

  useFocusEffect(useCallback(() => {
    let active = true;
    async function loadHomeData() {
      try {
        const moodValue = await LocalStore.getItem('moodRecords');
        if (active) {
          const records = JSON.parse(moodValue || '[]');
          const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
          const latestToday = records.find(record => new Date(record.date).getTime() >= startOfDay);
          setTodayMood(latestToday || null);
        }
      } catch (error) {
        if (active) Alert.alert('Could not load mood check-in', error.message || 'Please try again.');
      }

      try {
        const settingsValue = await LocalStore.getItem('profileSettings');
        if (!active) return;
        const settings = settingsValue ? JSON.parse(settingsValue) : {};
        if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
          throw new Error('Saved profile settings have an unexpected format.');
        }
        setProfileSettings({
          preferredName: typeof settings.preferredName === 'string' ? settings.preferredName : '',
          showDailyMotivation: settings.showDailyMotivation !== false,
          showSelfCare: settings.showSelfCare !== false,
        });
      } catch (error) {
        if (active) Alert.alert('Could not load profile preferences', error.message || 'Please try again.');
      }
    }
    loadHomeData();
    return () => { active = false; };
  }, []));

  return (
    <Screen>
      <Text style={styles.eyebrow}>A LITTLE SPACE FOR YOU</Text>
      <Text style={styles.heading}>{profileSettings.preferredName ? `Hello, ${profileSettings.preferredName} ✨` : 'Hello, friend ✨'}</Text>
      <Text style={styles.subtitle}>Take a breath. You can start wherever you are.</Text>

      {profileSettings.showDailyMotivation ? (
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>A THOUGHT FOR TODAY</Text>
          <Text style={styles.quote}>“{quote.text}”</Text>
          <Text style={styles.quoteSignoff}>A gentle reminder for you</Text>
          <SoftLandscape style={styles.landscape} />
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('Mood')}
        style={({ pressed }) => [styles.moodCard, pressed && styles.pressed]}
      >
        <View style={styles.moodCopy}>
          <Text style={styles.cardEyebrow}>CHECK IN WITH YOURSELF</Text>
          <Text style={styles.moodTitle}>How are you feeling?</Text>
          <Text style={styles.moodDescription}>
            {todayMood ? `Today you felt ${todayMood.mood.toLowerCase()}. Check in again anytime.` : 'There’s no right answer. Just notice what’s here.'}
          </Text>
          <Text style={styles.moodLink}> {todayMood ? 'Check in again  ›' : 'Take a gentle check-in  ›'}</Text>
        </View>
        <View style={styles.moodSun}><Text style={styles.moodSunText}>{todayMood ? '🌷' : '☁️'}</Text></View>
        {todayMood ? (
          <Text style={styles.moodSummary}>{todayMood.mood} · intensity {todayMood.intensity}/10</Text>
        ) : null}
      </Pressable>

      <Text style={styles.sectionHeading}>A little care, right now</Text>
      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Relaxation Toolkit')}
          style={({ pressed }) => [styles.actionCard, styles.breathingCard, pressed && styles.pressed]}
        >
          <Text style={styles.actionIcon}>☁︎</Text>
          <Text style={styles.actionTitle}>Take a breath</Text>
          <Text style={styles.actionDescription}>A small pause for you</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Personal Diary')}
          style={({ pressed }) => [styles.actionCard, styles.diaryCard, pressed && styles.pressed]}
        >
          <Text style={styles.actionIcon}>✎</Text>
          <Text style={styles.actionTitle}>Write it out</Text>
          <Text style={styles.actionDescription}>A page just for you</Text>
        </Pressable>
      </View>

      {suggestedActivities.length ? (
        <View style={styles.activityCard}>
          <Text style={styles.cardEyebrow}>A FEW IDEAS FOR YOU</Text>
          {suggestedActivities.map(([screen, description]) => (
            <Pressable key={`${screen}-${description}`} onPress={() => navigation.navigate(screen)} style={styles.activity}>
              <Text style={styles.activityTitle}>{screen} <Text style={styles.activityArrow}>›</Text></Text>
              <Text style={styles.activityDescription}>{description}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {profileSettings.showSelfCare ? (
        <View style={styles.selfCareCard}>
          <Text style={styles.selfCareIcon}>✿</Text>
          <View style={styles.selfCareCopy}>
            <Text style={styles.cardEyebrow}>A LITTLE SELF-CARE</Text>
            <Text style={styles.suggestion}>{selfCare}</Text>
          </View>
        </View>
      ) : null}

      <Text style={styles.sectionHeading}>Explore your space</Text>
      <View style={styles.exploreGrid}>
        {exploreItems.map(item => (
          <Pressable
            key={item.title}
            accessibilityRole="button"
            accessibilityLabel={`${item.title}. ${item.description}`}
            onPress={() => navigation.navigate(item.title)}
            style={({ pressed }) => [
              styles.exploreCard,
              width >= 900 ? styles.exploreCardWide : styles.exploreCardNarrow,
              { backgroundColor: item.background, borderColor: item.accent, minHeight: 200 * Math.max(fontScale, 1) },
              pressed && styles.pressed,
            ]}
          >
            <View pointerEvents="none" style={[styles.exploreOrb, { backgroundColor: item.accent }]} />
            <View pointerEvents="none" style={styles.exploreDots}>
              {[0, 1, 2, 3, 4, 5].map(dot => (
                <View key={dot} style={[styles.exploreDot, { backgroundColor: item.accent }]} />
              ))}
            </View>
            <View style={[styles.exploreIconBox, { backgroundColor: item.accent }]}>
              <Text style={[styles.exploreIcon, { color: darkMode ? '#E5ECE7' : item.iconColor }]}>{item.icon}</Text>
            </View>
            <Text style={styles.exploreTitle}>{item.title}</Text>
            <Text style={styles.exploreDescription}>{item.description}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  eyebrow: { color: Theme.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.8, marginTop: 6 },
  heading: { color: Theme.text, fontSize: 27, fontWeight: '800', marginTop: 8 },
  subtitle: { color: Theme.muted, lineHeight: 21, marginTop: 6, marginBottom: 18 },
  heroCard: { minHeight: 238, overflow: 'hidden', backgroundColor: '#F6E8D9', borderRadius: 28, padding: 21, marginBottom: 17, borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)', elevation: 3, shadowColor: '#A88F78', shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 7 } },
  heroEyebrow: { color: '#806D5B', fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 10 },
  quote: { color: '#4C5145', fontSize: 19, lineHeight: 26, fontWeight: '700', maxWidth: '90%' },
  quoteSignoff: { color: '#806D5B', fontSize: 12, marginTop: 8 },
  landscape: { height: 110 },
  moodCard: { minHeight: 158, position: 'relative', overflow: 'hidden', backgroundColor: '#E4EFE7', borderRadius: 25, padding: 19, marginBottom: 9, borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)', elevation: 2, shadowColor: '#78947F', shadowOpacity: 0.1, shadowRadius: 14, shadowOffset: { width: 0, height: 5 } },
  moodCopy: { maxWidth: '78%', zIndex: 1 },
  cardEyebrow: { color: Theme.primary, fontSize: 9, fontWeight: '800', letterSpacing: 1.3, marginBottom: 8 },
  moodTitle: { color: Theme.text, fontSize: 20, lineHeight: 25, fontWeight: '800' },
  moodDescription: { color: '#62746A', lineHeight: 19, fontSize: 12, marginTop: 5 },
  moodLink: { color: Theme.primaryDark, fontWeight: '800', fontSize: 12, marginTop: 10 },
  moodSun: { width: 83, height: 83, position: 'absolute', right: -9, top: 21, alignItems: 'center', justifyContent: 'center', borderRadius: 42, backgroundColor: '#F6E6BC' },
  moodSunText: { fontSize: 33 },
  moodSummary: { color: Theme.primaryDark, fontWeight: '700', fontSize: 12, marginTop: 10 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.985 }] },
  sectionHeading: { color: Theme.text, fontSize: 18, fontWeight: '800', marginTop: 18, marginBottom: 11 },
  exploreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  exploreCard: { aspectRatio: 1, borderRadius: 22, borderWidth: 1, padding: 14, overflow: 'hidden' },
  exploreCardWide: { width: '23.5%' },
  exploreCardNarrow: { width: '47%' },
  exploreOrb: { position: 'absolute', width: 120, height: 120, borderRadius: 60, right: -55, bottom: -55, opacity: 0.75 },
  exploreDots: { position: 'absolute', top: 16, right: 15, width: 26, flexDirection: 'row', flexWrap: 'wrap', gap: 5, opacity: 0.9 },
  exploreDot: { width: 5, height: 5, borderRadius: 3 },
  exploreIconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  exploreIcon: { fontSize: 27, lineHeight: 32, fontWeight: '700' },
  exploreTitle: { color: Theme.text, fontSize: 14, fontWeight: '800', lineHeight: 20, marginBottom: 6 },
  exploreDescription: { color: Theme.muted, fontSize: 12, lineHeight: 17 },
  actionRow: { flexDirection: 'row', gap: 11 },
  actionCard: { flex: 1, minHeight: 132, justifyContent: 'center', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)', elevation: 2, shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  breathingCard: { backgroundColor: '#E7EAF4', shadowColor: '#8588A5' },
  diaryCard: { backgroundColor: '#F7E8E2', shadowColor: '#AE867E' },
  actionIcon: { color: Theme.primaryDark, fontSize: 24, marginBottom: 10 },
  actionTitle: { color: Theme.text, fontWeight: '800', fontSize: 15 },
  actionDescription: { color: Theme.muted, fontSize: 11, marginTop: 5, lineHeight: 16 },
  activityCard: { padding: 17, backgroundColor: '#F0EAF5', borderRadius: 22, marginTop: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)' },
  activity: { borderTopWidth: 1, borderTopColor: 'rgba(85,101,109,0.12)', paddingVertical: 11 },
  activityTitle: { color: Theme.primaryDark, fontWeight: '800', marginBottom: 3 },
  activityArrow: { color: Theme.primary, fontSize: 20 },
  activityDescription: { color: Theme.muted, fontSize: 12 },
  selfCareCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7EEDA', padding: 16, borderRadius: 21, marginTop: 17 },
  selfCareIcon: { fontSize: 27, color: '#AF8A55', marginRight: 13 },
  selfCareCopy: { flex: 1 },
  suggestion: { color: Theme.text, lineHeight: 20, fontSize: 13 },
});