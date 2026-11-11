import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Screen from '../components/Screen';
import CozyHero from '../components/CozyHero';
import { CozyText as Text } from '../components/CozyText';
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
    AsyncStorage.getItem('moodRecords')
      .then(value => {
        const savedRecords = JSON.parse(value || '[]');
        if (!Array.isArray(savedRecords)) throw new Error('Mood history data is not a list.');
        if (active) setRecords(savedRecords);
      })
      .catch(error => {
        if (active) Alert.alert('Could not load mood history', error.message || 'Please try again.');
      });
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
  const dayKeys = new Set(records.map(record => new Date(record.date).toDateString()));
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (dayKeys.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return (
    <Screen>
      <CozyHero
        eyebrow="YOUR JOURNEY"
        title="Mood History"
        description="Notice patterns gently, one day at a time."
        art="🌿"
        colors={['#E6F1E8', '#E9EDF7']}
      />
      <View style={styles.streak}><Text style={styles.streakText}>🌱 {streak} day check-in streak</Text></View>
      <View style={styles.summaryRow}><View style={[styles.summaryCard, styles.summaryMint]}><Text style={styles.summaryValue}>{filtered.length}</Text><Text style={styles.summaryLabel}>Entries</Text></View><View style={[styles.summaryCard, styles.summaryLavender]}><Text style={styles.summaryValue}>{average}</Text><Text style={styles.summaryLabel}>Avg intensity</Text></View><View style={[styles.summaryCard, styles.summaryPeach]}><Text style={styles.summaryValue}>{commonMood}</Text><Text style={styles.summaryLabel}>Most common</Text></View></View>
      <Text style={styles.sectionLabel}>Summary</Text>
      <View style={styles.wrap}>{['Day', 'Week', 'All'].map(option => <Pressable accessibilityRole="button" accessibilityState={{ selected: period === option }} key={option} onPress={() => setPeriod(option)} style={[styles.option, period === option && styles.activeOption]}><Text style={[styles.optionText, period === option && styles.activeOptionText]}>{option === 'Day' ? 'Daily' : option === 'Week' ? 'Weekly' : 'All time'}</Text></Pressable>)}</View>
      <Pressable accessibilityRole="button" accessibilityLabel="Filter mood history by date" style={styles.dateButton} onPress={() => setShowDatePicker(true)}><Text style={styles.dateText}>{selectedDate ? selectedDate.toLocaleDateString() : 'Filter by date'}</Text></Pressable>
      {selectedDate ? <Pressable accessibilityRole="button" onPress={() => setSelectedDate(null)}><Text style={styles.clearDate}>Clear date filter</Text></Pressable> : null}
      {showDatePicker ? <DateTimePicker value={selectedDate || new Date()} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(event, value) => { setShowDatePicker(false); if (value && event.type !== 'dismissed') setSelectedDate(value); }} /> : null}
      <Text style={styles.sectionLabel}>Emotion</Text>
      <View style={styles.wrap}>{emotions.map(option => <Pressable accessibilityRole="button" accessibilityState={{ selected: emotion === option }} key={option} onPress={() => setEmotion(option)} style={[styles.option, emotion === option && styles.activeOption]}><Text style={[styles.optionText, emotion === option && styles.activeOptionText]}>{option}</Text></Pressable>)}</View>
      <Text style={styles.sectionLabel}>Mood intensity trend</Text>
      <View style={styles.chart}>{trend.length ? trend.map(record => <View key={record.id} style={styles.barColumn}><Text style={styles.barValue}>{record.intensity}</Text><View style={[styles.bar, { height: 18 + (Number(record.intensity) / maxIntensity) * 82 }]} /><Text style={styles.barDate}>{new Date(record.date).toLocaleDateString([], { weekday: 'short' })}</Text></View>) : <Text style={styles.empty}>No trend data for these filters.</Text>}</View>
      <Text style={styles.sectionLabel}>Entries</Text>
      {!filtered.length ? <Text style={styles.empty}>No mood entries match these filters.</Text> :
        filtered.map(record => <View key={record.id} style={styles.item}><Text style={styles.itemTitle}>{record.mood} - Intensity {record.intensity}/10</Text><Text style={styles.itemMeta}>{new Date(record.date).toLocaleString()}</Text>{record.note ? <Text style={styles.itemNote}>{record.note}</Text> : null}</View>)}
    </Screen>
  );
}
const styles = StyleSheet.create({
  streak: { backgroundColor: '#E8F2E9', borderRadius: 18, padding: 14, marginBottom: 14 },
  streakText: { color: '#2C6E49', fontWeight: '700' },
  sectionLabel: { color: Theme.text, fontSize: 15, fontWeight: '800', marginTop: 18, marginBottom: 9 },
  summaryRow: { flexDirection: 'row', gap: 8 },
  summaryCard: { flex: 1, minHeight: 82, justifyContent: 'center', borderRadius: 18, padding: 9 },
  summaryMint: { backgroundColor: '#E7F1E9' }, summaryLavender: { backgroundColor: '#EEE8F5' }, summaryPeach: { backgroundColor: '#F8EDE0' },
  summaryValue: { color: Theme.primaryDark, fontSize: 17, fontWeight: '800', textAlign: 'center' },
  summaryLabel: { color: Theme.muted, fontSize: 11, textAlign: 'center', marginTop: 4 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  option: { minHeight: 38, justifyContent: 'center', borderWidth: 1, borderColor: Theme.border, borderRadius: 18, paddingHorizontal: 13, marginRight: 6, marginBottom: 6, backgroundColor: 'rgba(255,255,255,0.72)' },
  activeOption: { backgroundColor: Theme.primary, borderColor: Theme.primary },
  optionText: { color: Theme.text }, activeOptionText: { color: '#FFFFFF', fontWeight: '700' },
  dateButton: { borderWidth: 1, borderColor: Theme.border, borderRadius: 16, padding: 14, backgroundColor: 'rgba(255,255,255,0.82)' },
  dateText: { color: Theme.text }, clearDate: { color: Theme.primary, fontWeight: '700', marginTop: 8 },
  chart: { height: 150, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.76)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: 10 },
  barColumn: { alignItems: 'center', justifyContent: 'flex-end', minWidth: 30 },
  bar: { width: 18, borderRadius: 5, backgroundColor: Theme.primary },
  barValue: { color: Theme.text, fontSize: 11, fontWeight: '700' }, barDate: { color: Theme.muted, fontSize: 10, marginTop: 4 },
  empty: { color: Theme.muted, lineHeight: 22 },
  item: { backgroundColor: 'rgba(255,255,255,0.82)', borderColor: 'rgba(255,255,255,0.9)', borderWidth: 1, borderRadius: 20, padding: 16, marginBottom: 10 },
  itemTitle: { color: Theme.text, fontWeight: '700' }, itemMeta: { color: Theme.muted, fontSize: 12, marginTop: 2 }, itemNote: { color: Theme.text, lineHeight: 20, marginTop: 8 },
});