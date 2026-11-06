import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
import { Theme } from '../styles/theme';

export default function ProfileScreen({ navigation }) {
  return (
    <Screen>
      <Text style={styles.heading}>Your Space</Text>
      <Text style={styles.subtitle}>Manage your personal well-being activities.</Text>
      <SectionCard title="Mood History" description="Review saved mood check-ins." onPress={() => navigation.navigate('Mood History')} />
      <SectionCard title="Personal Diary" description="Your private notes and reflections." onPress={() => navigation.navigate('Personal Diary')} />
      <SectionCard title="Support Directory" description="View support information." onPress={() => navigation.navigate('Support Directory')} />
      <Text style={styles.note}>Your records are stored locally on this device in this starter version.</Text>
    </Screen>
  );
}
const styles = StyleSheet.create({
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 6 },
  subtitle: { color: Theme.muted, marginBottom: 18 },
  note: { color: Theme.muted, lineHeight: 20, marginTop: 10 },
});