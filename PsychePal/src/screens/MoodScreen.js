import React, { useState } from 'react';
import { Text, TextInput, Alert, StyleSheet, Platform, Pressable, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { Theme } from '../styles/theme';

const moods = [
  ['Happy', '😊', '#FFF3C4'],
  ['Calm', '🌿', '#DDEEDD'],
  ['Neutral', '😐', '#E8EDF0'],
  ['Sad', '😔', '#DDE8F3'],
  ['Anxious', '😟', '#EAE0F5'],
  ['Angry', '😡', '#F7DDD8'],
  ['Tired', '😴', '#E3E1EE'],
  ['Distressed', '😫', '#F5DDE4'],
];

export default function MoodScreen() {
  const [selected, setSelected] = useState('');
  const [note, setNote] = useState('');
  const [intensity, setIntensity] = useState('5');
  const [recordedAt, setRecordedAt] = useState(new Date());
  const [picker, setPicker] = useState(null);

  async function saveMood() {
    if (!selected) return Alert.alert('Choose a mood', 'Please select how you feel first.');
    const moodIntensity = Math.min(10, Math.max(1, Number.parseInt(intensity, 10) || 5));
    const existing = JSON.parse((await AsyncStorage.getItem('moodRecords')) || '[]');
    const record = { id: Date.now().toString(), mood: selected, intensity: moodIntensity, note: note.trim(), date: recordedAt.toISOString() };
    await AsyncStorage.setItem('moodRecords', JSON.stringify([record, ...existing]));
    setIntensity('5');
    setNote('');
    setRecordedAt(new Date());
    Alert.alert('Saved', 'Your mood check-in has been saved on this device.');
  }

  function updateDateTime(event, value) {
    if (event.type === 'dismissed') {
      setPicker(null);
      return;
    }
    if (value) setRecordedAt(previous => {
      const next = new Date(previous);
      if (picker === 'date') {
        next.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
      } else {
        next.setHours(value.getHours(), value.getMinutes(), 0, 0);
      }
      return next;
    });
    if (Platform.OS === 'android') setPicker(null);
  }

  return (
    <Screen>
      <Text style={styles.heading}>How are you feeling today?</Text>
      <Text style={styles.helper}>Choose the mood that feels closest to your experience.</Text>
      <View style={styles.moodGrid}>
        {moods.map(([mood, emoji, color]) => (
          <Pressable key={mood} onPress={() => setSelected(mood)} style={[styles.mood, { backgroundColor: color }, selected === mood && styles.selected]}>
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={[styles.moodText, selected === mood && styles.selectedText]}>{mood}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.label}>Intensity (1–10)</Text>
      <TextInput value={intensity} onChangeText={setIntensity} keyboardType="number-pad" style={styles.input} />
      <Text style={styles.label}>Optional note</Text>
      <TextInput value={note} onChangeText={setNote} placeholder="What might have influenced this mood?" multiline style={[styles.input, styles.multiline]} />
      <Text style={styles.label}>Date and time</Text>
      <Text onPress={() => setPicker('date')} style={styles.dateButton}>Date: {recordedAt.toLocaleDateString()}</Text>
      <Text onPress={() => setPicker('time')} style={styles.dateButton}>Time: {recordedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      {picker ? (
        <DateTimePicker
          value={recordedAt}
          mode={picker}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={updateDateTime}
        />
      ) : null}
      <PrimaryButton title="Save Mood Check-in" onPress={saveMood} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 8 },
  helper: { color: Theme.muted, marginBottom: 16, lineHeight: 20 },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  mood: { width: '30%', minHeight: 94, borderColor: Theme.border, borderWidth: 1, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  emoji: { fontSize: 30, marginBottom: 5 },
  moodText: { color: Theme.text, fontWeight: '600' },
  selected: { borderColor: Theme.primary, borderWidth: 2 },
  selectedText: { color: Theme.primaryDark, fontWeight: '800' },
  label: { color: Theme.text, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: Theme.surface, borderColor: Theme.border, borderWidth: 1, borderRadius: 12, padding: 12, color: Theme.text },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
  dateButton: { backgroundColor: Theme.surface, borderColor: Theme.border, borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 8, color: Theme.text },
});