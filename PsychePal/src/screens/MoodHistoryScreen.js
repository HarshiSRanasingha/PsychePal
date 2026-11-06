import React, { useCallback, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Screen from '../components/Screen';
import { Theme } from '../styles/theme';

export default function MoodHistoryScreen() {
  const [records, setRecords] = useState([]);
  useFocusEffect(useCallback(() => {
    let active = true;
    AsyncStorage.getItem('moodRecords').then(value => { if (active) setRecords(JSON.parse(value || '[]')); });
    return () => { active = false; };
  }, []));
  return (
    <Screen>
      <Text style={styles.heading}>Mood History</Text>
      {!records.length ? <Text style={styles.empty}>No mood records yet. Add your first check-in from the Mood tab.</Text> :
        records.map(r => <Text key={r.id} style={styles.item}>{r.mood} • Intensity {r.intensity}/10{'\n'}{new Date(r.date).toLocaleString()}{r.note ? `\n${r.note}` : ''}</Text>)}
    </Screen>
  );
}
const styles = StyleSheet.create({
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 16 },
  empty: { color: Theme.muted, lineHeight: 22 },
  item: { backgroundColor: Theme.surface, color: Theme.text, borderColor: Theme.border, borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 10, lineHeight: 21 },
});