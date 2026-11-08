import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { Theme } from '../styles/theme';

export default function ReflectionScreen() {
  const [situation, setSituation] = useState('');
  const [thought, setThought] = useState('');
  const [feeling, setFeeling] = useState('');
  const [alternative, setAlternative] = useState('');
  const [notes, setNotes] = useState([]);

  const loadNotes = useCallback(async () => {
    const saved = await AsyncStorage.getItem('reflectionNotes');
    setNotes(saved ? JSON.parse(saved) : []);
  }, []);

  useFocusEffect(useCallback(() => { loadNotes(); }, [loadNotes]));

  async function saveReflection() {
    if (![situation, thought, feeling, alternative].some(value => value.trim())) {
      Alert.alert('Nothing to save', 'Write something in the reflection fields first.');
      return;
    }
    const entry = {
      id: Date.now().toString(),
      situation: situation.trim(),
      thought: thought.trim(),
      feeling: feeling.trim(),
      alternative: alternative.trim(),
      date: new Date().toISOString(),
    };
    const updated = [entry, ...notes];
    await AsyncStorage.setItem('reflectionNotes', JSON.stringify(updated));
    setNotes(updated);
    clearReflection();
    Alert.alert('Reflection saved', 'Your personal reflection note has been saved on this device.');
  }

  async function removeNote(id) {
    const updated = notes.filter(note => note.id !== id);
    await AsyncStorage.setItem('reflectionNotes', JSON.stringify(updated));
    setNotes(updated);
  }

  function clearReflection() {
    setSituation('');
    setThought('');
    setFeeling('');
    setAlternative('');
  }

  const field = (label, value, setter, hint) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={setter} placeholder={hint} multiline style={styles.input} />
    </>
  );
  return (
    <Screen>
      <Text style={styles.heading}>Thought Reflection</Text>
      <Text style={styles.help}>A self-reflection activity. You can write privately in the fields below.</Text>
      {field('1. What happened?', situation, setSituation, 'Describe the situation...')}
      {field('2. What thought came to mind?', thought, setThought, 'Write the thought...')}
      {field('3. What did you feel?', feeling, setFeeling, 'Name the emotion...')}
      {field('4. Is there another way to look at it?', alternative, setAlternative, 'Consider another perspective...')}
      <PrimaryButton title="Save Reflection Note" onPress={saveReflection} />
      <PrimaryButton title="Clear Reflection" secondary onPress={clearReflection} />
      <Text style={styles.subheading}>Personal Reflection Notes</Text>
      {notes.map(note => (
        <Text
          key={note.id}
          style={styles.note}
          onPress={() => Alert.alert(
            new Date(note.date).toLocaleString(),
            [note.situation && `Situation: ${note.situation}`, note.thought && `Thought: ${note.thought}`, note.feeling && `Feeling: ${note.feeling}`, note.alternative && `Another perspective: ${note.alternative}`].filter(Boolean).join('\n\n'),
            [{ text: 'Close' }, { text: 'Delete', style: 'destructive', onPress: () => removeNote(note.id) }],
          )}
        >
          {note.thought || note.feeling || note.situation || 'Reflection note'}{'\n'}
          {new Date(note.date).toLocaleString()}{'\n'}
          Tap to read or delete
        </Text>
      ))}
      {!notes.length ? <Text style={styles.empty}>Your saved personal reflection notes will appear here.</Text> : null}
    </Screen>
  );
}
const styles = StyleSheet.create({
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 8 },
  help: { color: Theme.muted, lineHeight: 20, marginBottom: 10 },
  label: { color: Theme.text, fontWeight: '700', marginTop: 10, marginBottom: 6 },
  input: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 12, minHeight: 72, padding: 12, textAlignVertical: 'top' },
  subheading: { fontSize: 18, fontWeight: '800', color: Theme.text, marginTop: 24, marginBottom: 10 },
  note: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 12, padding: 14, marginBottom: 10, color: Theme.text, lineHeight: 21 },
  empty: { color: Theme.muted },
});