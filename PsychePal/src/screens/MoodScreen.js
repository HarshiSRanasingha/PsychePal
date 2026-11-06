import React, { useState } from 'react';
import { Text, TextInput, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { Theme } from '../styles/theme';

const moods = ['Happy', 'Calm', 'Neutral', 'Sad', 'Anxious', 'Angry', 'Tired'];

export default function MoodScreen() {
  const [selected, setSelected] = useState('');
  const [note, setNote] = useState('');
  const [intensity, setIntensity] = useState('5');

  async function saveMood() {
    if (!selected) return Alert.alert('Choose a mood', 'Please select how you feel first.');
    const existing = JSON.parse((await AsyncStorage.getItem('moodRecords')) || '[]');
    const record = { id: Date.now().toString(), mood: selected, intensity: Number(intensity) || 5, note, date: new Date().toISOString() };
    await AsyncStorage.setItem('moodRecords', JSON.stringify([record, ...existing]));
    setNote('');
    Alert.alert('Saved', 'Your mood check-in has been saved on this device.');
  }

  return (
    <Screen>
      <Text style={styles.heading}>How are you feeling today?</Text>
      <Text style={styles.helper}>Choose the mood that feels closest to your experience.</Text>
      {moods.map(m => (
        <Text key={m} onPress={() => setSelected(m)} style={[styles.mood, selected === m && styles.selected]}>{selected === m ? '✓  ' : ''}{m}</Text>
      ))}
      <Text style={styles.label}>Intensity (1–10)</Text>
      <TextInput value={intensity} onChangeText={setIntensity} keyboardType="number-pad" style={styles.input} />
      <Text style={styles.label}>Optional note</Text>
      <TextInput value={note} onChangeText={setNote} placeholder="What might have influenced this mood?" multiline style={[styles.input, styles.multiline]} />
      <PrimaryButton title="Save Mood Check-in" onPress={saveMood} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 8 },
  helper: { color: Theme.muted, marginBottom: 16, lineHeight: 20 },
  mood: { backgroundColor: Theme.surface, borderColor: Theme.border, borderWidth: 1, borderRadius: 12, padding: 13, marginBottom: 8, color: Theme.text },
  selected: { backgroundColor: Theme.lavender, borderColor: Theme.primary, color: Theme.primaryDark, fontWeight: '700' },
  label: { color: Theme.text, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: Theme.surface, borderColor: Theme.border, borderWidth: 1, borderRadius: 12, padding: 12, color: Theme.text },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
});