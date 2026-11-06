import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
import { Theme } from '../styles/theme';

export default function HomeScreen({ navigation }) {
  const items = [
    ['Mood History', 'Review your previous mood check-ins.'],
    ['Thought Reflection', 'Explore a situation, thought, and feeling.'],
    ['Relaxation Toolkit', 'Try a breathing or grounding exercise.'],
    ['Recommendations', 'Browse books, music, and movie suggestions.'],
    ['Personal Diary', 'Write and manage private journal entries.'],
    ['Support Directory', 'Find relevant support contact information.'],
  ];
  return (
    <Screen>
      <Text style={styles.hello}>Hello 👋</Text>
      <Text style={styles.heading}>Welcome to PsychePal</Text>
      <Text style={styles.subtitle}>A little space to understand yourself, care for yourself, and grow.</Text>
      {items.map(([title, description]) => (
        <SectionCard key={title} title={title} description={description} onPress={() => navigation.navigate(title)} />
      ))}
    </Screen>
  );
}
const styles = StyleSheet.create({
  hello: { color: Theme.primary, fontSize: 16, fontWeight: '700', marginTop: 8 },
  heading: { color: Theme.text, fontSize: 25, fontWeight: '800', marginTop: 4 },
  subtitle: { color: Theme.muted, lineHeight: 21, marginTop: 8, marginBottom: 22 },
});