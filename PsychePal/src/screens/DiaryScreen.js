import React, { useCallback, useState } from 'react';
import { Text, TextInput, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { Theme } from '../styles/theme';

export default function DiaryScreen() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [entries, setEntries] = useState([]);

  const load = useCallback(async () => {
    setEntries(JSON.parse((await AsyncStorage.getItem('diaryEntries')) || '[]'));
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function save() {
    if (!title.trim() || !body.trim()) return Alert.alert('Missing information', 'Add a title and diary entry.');
    const updated = [{ id: Date.now().toString(), title: title.trim(), body: body.trim(), date: new Date().toISOString() }, ...entries];
    await AsyncStorage.setItem('diaryEntries', JSON.stringify(updated));
    setEntries(updated); setTitle(''); setBody('');
  }
  async function remove(id) {
    const updated = entries.filter(e => e.id !== id);
    await AsyncStorage.setItem('diaryEntries', JSON.stringify(updated));
    setEntries(updated);
  }

  return (
    <Screen>
      <Text style={styles.heading}>Personal Diary</Text>
      <TextInput value={title} onChangeText={setTitle} placeholder="Entry title" style={styles.input} />
      <TextInput value={body} onChangeText={setBody} placeholder="Write your thoughts..." multiline style={[styles.input, styles.multiline]} />
      <PrimaryButton title="Save Entry" onPress={save} />
      <Text style={styles.subheading}>Saved Entries</Text>
      {entries.map(e => (
        <Text key={e.id} onPress={() => Alert.alert(e.title, e.body, [{ text: 'Close' }, { text: 'Delete', style: 'destructive', onPress: () => remove(e.id) }])} style={styles.entry}>
          {e.title}{'\n'}{new Date(e.date).toLocaleString()}{'\n'}Tap to read or delete
        </Text>
      ))}
      {!entries.length ? <Text style={styles.empty}>Your saved entries will appear here.</Text> : null}
    </Screen>
  );
}
const styles = StyleSheet.create({
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 14 },
  subheading: { fontSize: 17, fontWeight: '700', color: Theme.text, marginTop: 22, marginBottom: 10 },
  input: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 12, padding: 12, marginBottom: 10 },
  multiline: { minHeight: 110, textAlignVertical: 'top' },
  entry: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 12, padding: 14, marginBottom: 10, color: Theme.text, lineHeight: 21 },
  empty: { color: Theme.muted },
});