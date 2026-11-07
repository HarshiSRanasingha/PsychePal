import React, { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, Text, StyleSheet, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Screen from '../components/Screen';
import { Theme } from '../styles/theme';

const emotions = ['All', 'Happy', 'Calm', 'Neutral', 'Sad', 'Anxious', 'Angry', 'Tired'];

export default function MoodHistoryScreen() {
  const [records, setRecords] = useState([]);
  const [period, setPeriod] = useState('All');
  const [emotion, setEmotion] = useState('All');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useFocusEffect(useCallback(() => {
    let active = true;
    AsyncStorage.getItem('moodRecords').then(value => { if (active) setRecords(JSON.parse(value || '[]')); });
    return () => { active = false; };
  }, []));

  const filtered = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    if (period === 'Week') start.setDate(start.getDate() - 6);
    return records.filter(record => {
      const date = new Date(record.date);
      const periodMatch = period === 'Day' ? date >= start : period === 'Week' ? date >= start : true;
      return periodMatch && (emotion === 'All' || record.mood === emotion) && (!selectedDate || date.toDateString() === selectedDate.toDateString());
    });
  }, [records, period, emotion, selectedDate]);

  const average = filtered.length ? (filtered.reduce((sum, record) => sum + Number(record.intensity || 0), 0) / filtered.length).toFixed(1) : '0.0';
  const counts = filtered.reduce((result, record) => ({ ...result, [record.mood]: (result[record.mood] || 0) + 1 }), {});
  const commonMood = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
  const trend = filtered.slice().sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7);
  const maxIntensity = Math.max(...trend.map(record => Number(record.intensity) || 0), 1);

  return (
    <Screen>
      <Text style={styles.heading}>Mood History</Text>
      <View style={styles.summaryRow}><View style={styles.summaryCard}><Text style={styles.summaryValue}>{filtered.length}</Text><Text style={styles.summaryLabel}>Entries</Text></View><View style={styles.summaryCard}><Text style={styles.summaryValue}>{average}</Text><Text style={styles.summaryLabel}>Avg intensity</Text></View><View style={styles.summaryCard}><Text style={styles.summaryValue}>{commonMood}</Text><Text style={styles.summaryLabel}>Most common</Text></View></View>
      <Text style={styles.sectionLabel}>Summary</Text>
      <View style={styles.wrap}>{['Day', 'Week', 'All'].map(option => <Pressable key={option} onPress={() => setPeriod(option)} style={[styles.option, period === option && styles.activeOption]}><Text style={[styles.optionText, period === option && styles.activeOptionText]}>{option === 'Day' ? 'Daily' : option === 'Week' ? 'Weekly' : 'All time'}</Text></Pressable>)}</View>
      <Pressable style={styles.dateButton} onPress={() => setShowDatePicker(true)}><Text style={styles.dateText}>{selectedDate ? selectedDate.toLocaleDateString() : 'Filter by date'}</Text></Pressable>
      {selectedDate ? <Text style={styles.clearDate} onPress={() => setSelectedDate(null)}>Clear date filter</Text> : null}
      {showDatePicker ? <DateTimePicker value={selectedDate || new Date()} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(event, value) => { setShowDatePicker(false); if (value && event.type !== 'dismissed') setSelectedDate(value); }} /> : null}
      <Text style={styles.sectionLabel}>Emotion</Text>
      <View style={styles.wrap}>{emotions.map(option => <Pressable key={option} onPress={() => setEmotion(option)} style={[styles.option, emotion === option && styles.activeOption]}><Text style={[styles.optionText, emotion === option && styles.activeOptionText]}>{option}</Text></Pressable>)}</View>
      <Text style={styles.sectionLabel}>Mood intensity trend</Text>
      <View style={styles.chart}>{trend.length ? trend.map(record => <View key={record.id} style={styles.barColumn}><Text style={styles.barValue}>{record.intensity}</Text><View style={[styles.bar, { height: 18 + (Number(record.intensity) / maxIntensity) * 82 }]} /><Text style={styles.barDate}>{new Date(record.date).toLocaleDateString([], { weekday: 'short' })}</Text></View>) : <Text style={styles.empty}>No trend data for these filters.</Text>}</View>
      <Text style={styles.sectionLabel}>Entries</Text>
      {!filtered.length ? <Text style={styles.empty}>No mood entries match these filters.</Text> :
        filtered.map(record => <View key={record.id} style={styles.item}><Text style={styles.itemTitle}>{record.mood} - Intensity {record.intensity}/10</Text><Text style={styles.itemMeta}>{new Date(record.date).toLocaleString()}</Text>{record.note ? <Text style={styles.itemNote}>{record.note}</Text> : null}</View>)}
    </Screen>
  );
}
const styles = StyleSheet.create({
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 16 },
  sectionLabel: { color: Theme.text, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  summaryRow: { flexDirection: 'row', gap: 8 },
  summaryCard: { flex: 1, minHeight: 82, justifyContent: 'center', backgroundColor: Theme.surface, borderColor: Theme.border, borderWidth: 1, borderRadius: 12, padding: 10 },
  summaryValue: { color: Theme.primaryDark, fontSize: 17, fontWeight: '800', textAlign: 'center' },
  summaryLabel: { color: Theme.muted, fontSize: 11, textAlign: 'center', marginTop: 4 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  option: { minHeight: 34, justifyContent: 'center', borderWidth: 1, borderColor: Theme.border, borderRadius: 8, paddingHorizontal: 10, marginRight: 6, marginBottom: 6 },
  activeOption: { backgroundColor: Theme.primary, borderColor: Theme.primary },
  optionText: { color: Theme.text }, activeOptionText: { color: '#FFFFFF', fontWeight: '700' },
  dateButton: { borderWidth: 1, borderColor: Theme.border, borderRadius: 10, padding: 12, backgroundColor: Theme.surface },
  dateText: { color: Theme.text }, clearDate: { color: Theme.primary, fontWeight: '700', marginTop: 8 },
  chart: { height: 150, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 12, padding: 10 },
  barColumn: { alignItems: 'center', justifyContent: 'flex-end', minWidth: 30 },
  bar: { width: 18, borderRadius: 5, backgroundColor: Theme.primary },
  barValue: { color: Theme.text, fontSize: 11, fontWeight: '700' }, barDate: { color: Theme.muted, fontSize: 10, marginTop: 4 },
  empty: { color: Theme.muted, lineHeight: 22 },
  item: { backgroundColor: Theme.surface, borderColor: Theme.border, borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 10 },
  itemTitle: { color: Theme.text, fontWeight: '700' }, itemMeta: { color: Theme.muted, fontSize: 12, marginTop: 2 }, itemNote: { color: Theme.text, lineHeight: 20, marginTop: 8 },
});