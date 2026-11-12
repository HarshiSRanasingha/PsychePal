import React, { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import * as LocalStore from '../data/localStore';
import { useFocusEffect } from '@react-navigation/native';
import Screen from '../components/Screen';
import CozyHero from '../components/CozyHero';
import PrimaryButton from '../components/PrimaryButton';
import { CozyText as Text } from '../components/CozyText';
import TextInput from '../components/CozyInput';
import { Theme } from '../styles/theme';

const ENTRIES_KEY = 'diaryEntries';
const GRATITUDE_KEY = 'gratitudeEntries';
const GOALS_KEY = 'personalGoals';

function readList(value, label) {
  const parsed = JSON.parse(value || '[]');
  if (!Array.isArray(parsed)) throw new Error(`${label} data is not a list.`);
  return parsed;
}

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function formatDate(value) {
  return new Date(value).toLocaleString();
}

export default function DiaryScreen() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [gratitude, setGratitude] = useState('');
  const [gratitudes, setGratitudes] = useState([]);
  const [goals, setGoals] = useState([]);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');

  const load = useCallback(async () => {
    try {
      const [savedEntries, savedGratitudes, savedGoals] = await Promise.all([
        LocalStore.getItem(ENTRIES_KEY),
        LocalStore.getItem(GRATITUDE_KEY),
        LocalStore.getItem(GOALS_KEY),
      ]);
      const loadedEntries = readList(savedEntries, 'Diary');
      const loadedGratitudes = readList(savedGratitudes, 'Gratitude journal');
      const loadedGoals = readList(savedGoals, 'Goals');
      setEntries(loadedEntries);
      setGratitudes(loadedGratitudes);
      setGoals(loadedGoals);
      const todayGratitude = loadedGratitudes.find(item => item.date === todayKey());
      setGratitude(todayGratitude ? todayGratitude.text : '');
    } catch (error) {
      Alert.alert('Could not load journal', error.message || 'Please try again.');
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function saveEntry() {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Missing information', 'Add a title and diary entry.');
      return;
    }
    const existing = entries.find(entry => entry.id === editingId);
    const updatedEntry = {
      id: existing ? existing.id : Date.now().toString(),
      title: title.trim(),
      body: body.trim(),
      date: existing ? existing.date : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = existing
      ? entries.map(entry => (entry.id === editingId ? updatedEntry : entry))
      : [updatedEntry, ...entries];
    try {
      await LocalStore.setItem(ENTRIES_KEY, JSON.stringify(updated));
      setEntries(updated);
      clearEntryForm();
    } catch (error) {
      Alert.alert('Could not save entry', error.message || 'Please try again.');
    }
  }

  function clearEntryForm() {
    setTitle('');
    setBody('');
    setEditingId(null);
  }

  function editEntry(entry) {
    setEditingId(entry.id);
    setTitle(entry.title);
    setBody(entry.body);
  }

  async function removeEntry(id) {
    const updated = entries.filter(entry => entry.id !== id);
    try {
      await LocalStore.setItem(ENTRIES_KEY, JSON.stringify(updated));
      setEntries(updated);
      if (editingId === id) clearEntryForm();
    } catch (error) {
      Alert.alert('Could not delete entry', error.message || 'Please try again.');
    }
  }

  function confirmRemoveEntry(entry) {
    Alert.alert('Delete entry?', `“${entry.title}” will be permanently removed.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeEntry(entry.id) },
    ]);
  }

  async function saveGratitude() {
    if (!gratitude.trim()) {
      Alert.alert('Nothing to save', 'Write down something you are grateful for today.');
      return;
    }
    const date = todayKey();
    const updated = [
      { date, text: gratitude.trim(), updatedAt: new Date().toISOString() },
      ...gratitudes.filter(item => item.date !== date),
    ];
    try {
      await LocalStore.setItem(GRATITUDE_KEY, JSON.stringify(updated));
      setGratitudes(updated);
      Alert.alert('Gratitude saved', 'Today’s gratitude note is saved on this device.');
    } catch (error) {
      Alert.alert('Could not save gratitude', error.message || 'Please try again.');
    }
  }

  async function addGoal() {
    const target = Number(goalTarget);
    if (!goalTitle.trim() || !Number.isInteger(target) || target < 1) {
      Alert.alert('Check your goal', 'Add a goal and a target of at least 1.');
      return;
    }
    const updated = [{
      id: Date.now().toString(),
      title: goalTitle.trim(),
      target,
      progress: 0,
      createdAt: new Date().toISOString(),
    }, ...goals];
    try {
      await LocalStore.setItem(GOALS_KEY, JSON.stringify(updated));
      setGoals(updated);
      setGoalTitle('');
      setGoalTarget('');
    } catch (error) {
      Alert.alert('Could not save goal', error.message || 'Please try again.');
    }
  }

  async function changeGoalProgress(goal, amount) {
    const updated = goals.map(item => {
      if (item.id !== goal.id) return item;
      const progress = Number(item.progress) || 0;
      const target = Number(item.target) || 1;
      return { ...item, progress: Math.max(0, Math.min(target, progress + amount)) };
    });
    try {
      await LocalStore.setItem(GOALS_KEY, JSON.stringify(updated));
      setGoals(updated);
    } catch (error) {
      Alert.alert('Could not update progress', error.message || 'Please try again.');
    }
  }

  async function removeGoal(id) {
    const updated = goals.filter(goal => goal.id !== id);
    try {
      await LocalStore.setItem(GOALS_KEY, JSON.stringify(updated));
      setGoals(updated);
    } catch (error) {
      Alert.alert('Could not delete goal', error.message || 'Please try again.');
    }
  }

  function confirmRemoveGoal(goal) {
    Alert.alert('Delete goal?', `“${goal.title}” and its progress will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeGoal(goal.id) },
    ]);
  }

  return (
    <Screen>
      <CozyHero
        eyebrow="A SPACE JUST FOR YOU"
        title="Your personal journal"
        description="Reflect, notice what matters, and celebrate every small step."
        art="📔"
        colors={['#F9EADF', '#F3E7F1']}
      />

      <Text style={styles.subheading}>{editingId ? 'Edit diary entry' : 'Create a diary entry'}</Text>
      <TextInput value={title} onChangeText={setTitle} placeholder="Entry title" style={styles.input} />
      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder="Write your thoughts..."
        multiline
        style={[styles.input, styles.multiline]}
      />
      <PrimaryButton title={editingId ? 'Save Changes' : 'Save Entry'} onPress={saveEntry} />
      {editingId ? <PrimaryButton title="Cancel Editing" onPress={clearEntryForm} secondary /> : null}

      <Text style={styles.subheading}>Daily gratitude</Text>
      <Text style={styles.helper}>What is one thing you appreciate today?</Text>
      <TextInput
        value={gratitude}
        onChangeText={setGratitude}
        placeholder="Today, I’m grateful for..."
        multiline
        style={[styles.input, styles.multiline, styles.gratitudeInput]}
      />
      <PrimaryButton title="Save Today's Gratitude" onPress={saveGratitude} />
      {gratitudes.map(item => (
        <View key={item.date} style={styles.card}>
          <Text style={styles.cardDate}>{new Date(`${item.date}T00:00:00`).toLocaleDateString()}</Text>
          <Text style={styles.cardText}>{item.text}</Text>
        </View>
      ))}
      {!gratitudes.length ? <Text style={styles.empty}>Your gratitude notes will appear here.</Text> : null}

      <Text style={styles.subheading}>Personal goals</Text>
      <Text style={styles.helper}>Set a goal and a target number of steps to track.</Text>
      <TextInput value={goalTitle} onChangeText={setGoalTitle} placeholder="What would you like to work toward?" style={styles.input} />
      <TextInput
        value={goalTarget}
        onChangeText={setGoalTarget}
        placeholder="Target steps (for example, 5)"
        keyboardType="number-pad"
        style={styles.input}
      />
      <PrimaryButton title="Add Goal" onPress={addGoal} />
      {goals.map(goal => {
        const progress = Number(goal.progress) || 0;
        const target = Number(goal.target) || 1;
        const complete = progress >= target;
        return (
          <View key={goal.id} style={styles.card}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.cardText}>
              {complete ? 'Goal complete!' : `${progress} of ${target} steps`}
            </Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.min(100, (progress / target) * 100)}%` }]} />
            </View>
            <View style={styles.goalActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Log progress for ${goal.title}`}
                disabled={complete}
                onPress={() => changeGoalProgress(goal, 1)}
                style={[styles.actionButton, complete && styles.disabledButton]}
              >
                <Text style={styles.actionText}>{complete ? 'Completed' : 'Log progress +1'}</Text>
              </Pressable>
              {progress > 0 ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Undo progress for ${goal.title}`}
                  onPress={() => changeGoalProgress(goal, -1)}
                  style={styles.textButton}
                >
                  <Text style={styles.textButtonLabel}>Undo</Text>
                </Pressable>
              ) : null}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Delete ${goal.title}`}
                onPress={() => confirmRemoveGoal(goal)}
                style={styles.textButton}
              >
                <Text style={styles.deleteLabel}>Delete</Text>
              </Pressable>
            </View>
          </View>
        );
      })}
      {!goals.length ? <Text style={styles.empty}>Add a personal goal to start tracking your progress.</Text> : null}

      <Text style={styles.subheading}>Saved entries</Text>
      {entries.map(entry => (
        <View key={entry.id} style={styles.card}>
          <Text style={styles.entryTitle}>{entry.title}</Text>
          <Text style={styles.cardDate}>{formatDate(entry.date)}</Text>
          <Text style={styles.cardText}>{entry.body}</Text>
          <View style={styles.entryActions}>
            <Pressable accessibilityRole="button" onPress={() => editEntry(entry)} style={styles.textButton}>
              <Text style={styles.textButtonLabel}>Edit</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => confirmRemoveEntry(entry)} style={styles.textButton}>
              <Text style={styles.deleteLabel}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ))}
      {!entries.length ? <Text style={styles.empty}>Your saved entries will appear here.</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  subheading: { fontSize: 18, fontWeight: '800', color: Theme.text, marginTop: 22, marginBottom: 10 },
  helper: { color: Theme.muted, marginBottom: 9, lineHeight: 20 },
  input: { backgroundColor: 'rgba(255,255,255,0.82)', borderWidth: 1, borderColor: Theme.border, borderRadius: 18, padding: 14, marginBottom: 10, color: Theme.text },
  multiline: { minHeight: 110, textAlignVertical: 'top' },
  gratitudeInput: { minHeight: 80 },
  card: { backgroundColor: 'rgba(255,255,255,0.8)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: 16, marginBottom: 12 },
  entryTitle: { color: Theme.text, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  goalTitle: { color: Theme.primaryDark, fontSize: 16, fontWeight: '700', marginBottom: 5 },
  cardDate: { color: Theme.muted, fontSize: 12, marginBottom: 8 },
  cardText: { color: Theme.text, lineHeight: 21 },
  entryActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  goalActions: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 10 },
  textButton: { paddingVertical: 8, paddingHorizontal: 10 },
  textButtonLabel: { color: Theme.primary, fontWeight: '700' },
  deleteLabel: { color: '#A94442', fontWeight: '700' },
  actionButton: { backgroundColor: Theme.lavender, paddingVertical: 9, paddingHorizontal: 12, borderRadius: 10 },
  actionText: { color: Theme.primaryDark, fontWeight: '700' },
  disabledButton: { opacity: 0.6 },
  progressTrack: { height: 8, backgroundColor: Theme.lavender, borderRadius: 5, marginTop: 11, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Theme.success, borderRadius: 5 },
  empty: { color: Theme.muted, marginBottom: 4 },
});
