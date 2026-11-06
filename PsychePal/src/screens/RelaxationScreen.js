import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
import { Theme } from '../styles/theme';

const exercises = [
  ['Box Breathing', 'Breathe in for 4 counts, hold for 4, breathe out for 4, and pause for 4. Repeat gently.'],
  ['5-4-3-2-1 Grounding', 'Notice 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste.'],
  ['Gentle Mindfulness', 'Sit comfortably and notice your breathing. When your attention wanders, gently bring it back.'],
  ['4-7-8 Breathing', 'If comfortable, breathe in for 4, hold for 7, and breathe out slowly for 8. Stop if you feel dizzy or uncomfortable.'],
];
export default function RelaxationScreen() {
  const [selected, setSelected] = useState(null);
  return (
    <Screen>
      <Text style={styles.heading}>Relaxation Toolkit</Text>
      <Text style={styles.subtitle}>Choose an exercise and follow the guidance at a comfortable pace.</Text>
      {exercises.map(([title, description]) => <SectionCard key={title} title={title} description={selected === title ? description : 'Tap to view instructions.'} onPress={() => setSelected(selected === title ? null : title)} />)}
      <Text style={styles.note}>These are general self-care exercises. Do not force your breathing; stop if uncomfortable.</Text>
    </Screen>
  );
}
const styles = StyleSheet.create({
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 6 },
  subtitle: { color: Theme.muted, lineHeight: 20, marginBottom: 16 },
  note: { color: Theme.muted, lineHeight: 19, marginTop: 8, fontSize: 12 },
});