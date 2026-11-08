import React, { useCallback, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
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

export default function HomeScreen({ navigation }) {
  const [todayMood, setTodayMood] = useState(null);
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
    AsyncStorage.getItem('moodRecords').then(value => {
      if (!active) return;
      const records = JSON.parse(value || '[]');
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      const latestToday = records.find(record => new Date(record.date).getTime() >= startOfDay);
      setTodayMood(latestToday || null);
    });
    return () => { active = false; };
  }, []));

  const items = [
    ['Mood History', 'Review your previous mood check-ins.'],
    ['Thought Reflection', 'Explore self-awareness, personality, strengths, and thoughts.'],
    ['Relaxation Toolkit', 'Try a breathing or grounding exercise.'],
    ['Recommendations', 'Browse books, music, and movie suggestions.'],
    ['Personal Diary', 'Write and manage private journal entries.'],
    ['Support Directory', 'Find relevant support contact information.'],
  ];

  return (
    <Screen>
      <Text style={styles.hello}>Hello</Text>
      <Text style={styles.heading}>Welcome to PsychePal</Text>
      <Text style={styles.subtitle}>A little space to understand yourself, care for yourself, and grow.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Daily motivation</Text>
        <Text style={styles.quote}>"{quote.text}"</Text>
      </View>

      <View style={[styles.card, styles.moodCard]}>
        <Text style={styles.label}>Today's mood</Text>
        {todayMood ? (
          <Text style={styles.summaryText}>{todayMood.mood} - intensity {todayMood.intensity}/10</Text>
        ) : (
          <Text style={styles.summaryText}>No check-in yet today.</Text>
        )}
        <Text style={styles.linkText} onPress={() => navigation.navigate('Mood')}>Open mood check-in</Text>
      </View>
      {suggestedActivities.length ? (
        <View style={styles.card}>
          <Text style={styles.label}>Suggested for this mood</Text>
          {suggestedActivities.map(([screen, description]) => (
            <View key={`${screen}-${description}`} style={styles.activity}>
              <Text style={styles.activityTitle} onPress={() => navigation.navigate(screen)}>{screen}</Text>
              <Text style={styles.activityDescription}>{description}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.label}>Daily self-care</Text>
        <Text style={styles.suggestion}>{selfCare}</Text>
      </View>

      <Text style={styles.sectionHeading}>Quick access</Text>
      {items.map(([title, description]) => (
        <SectionCard key={title} title={title} description={description} onPress={() => navigation.navigate(title)} />
      ))}
    </Screen>
  );
}
const styles = StyleSheet.create({
  hello: { color: Theme.primary, fontSize: 16, fontWeight: '700', marginTop: 8 },
  heading: { color: Theme.text, fontSize: 25, fontWeight: '800', marginTop: 4 },
  subtitle: { color: Theme.muted, lineHeight: 21, marginTop: 8, marginBottom: 18 },
  card: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 14, padding: 16, marginBottom: 12 },
  moodCard: { backgroundColor: Theme.lavender },
  label: { color: Theme.primaryDark, fontWeight: '700', marginBottom: 8 },
  quote: { color: Theme.text, fontSize: 17, lineHeight: 24, fontStyle: 'italic' },
  summaryText: { color: Theme.text, fontSize: 17, fontWeight: '700' },
  linkText: { color: Theme.primary, fontWeight: '700', marginTop: 10 },
  suggestion: { color: Theme.text, lineHeight: 22 },
  sectionHeading: { color: Theme.text, fontSize: 18, fontWeight: '800', marginTop: 10, marginBottom: 12 },
  activity: { borderTopWidth: 1, borderTopColor: Theme.border, paddingVertical: 10 },
  activityTitle: { color: Theme.primaryDark, fontWeight: '800', marginBottom: 3 },
  activityDescription: { color: Theme.muted, fontSize: 13 },
});