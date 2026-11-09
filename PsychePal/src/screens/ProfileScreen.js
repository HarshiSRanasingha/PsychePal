import React, { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
import { Theme } from '../styles/theme';

const SETTINGS_KEY = 'profileSettings';
const APP_DATA_KEYS = [
  'moodRecords',
  'reflectionNotes',
  'diaryEntries',
  'gratitudeEntries',
  'personalGoals',
  SETTINGS_KEY,
];

const DEFAULT_SETTINGS = {
  preferredName: '',
  showDailyMotivation: true,
  showSelfCare: true,
};

function parseSettings(value) {
  if (!value) return DEFAULT_SETTINGS;
  const parsed = JSON.parse(value);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Saved profile settings have an unexpected format.');
  }
  return {
    ...DEFAULT_SETTINGS,
    ...parsed,
    preferredName: typeof parsed.preferredName === 'string' ? parsed.preferredName : '',
    showDailyMotivation: parsed.showDailyMotivation !== false,
    showSelfCare: parsed.showSelfCare !== false,
  };
}

export default function ProfileScreen({ navigation }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [nameInput, setNameInput] = useState('');
  const [saving, setSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(SETTINGS_KEY);
      const loaded = parseSettings(saved);
      setSettings(loaded);
      setNameInput(loaded.preferredName);
    } catch (error) {
      Alert.alert('Could not load settings', error.message || 'Please try again.');
    }
  }, []);

  useFocusEffect(useCallback(() => { loadSettings(); }, [loadSettings]));

  async function saveSettings(updated) {
    setSaving(true);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      setSettings(updated);
      setNameInput(updated.preferredName);
    } catch (error) {
      Alert.alert('Could not save settings', error.message || 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function changePreference(key, value) {
    const updated = { ...settings, [key]: value };
    saveSettings(updated);
  }

  function clearStoredData() {
    Alert.alert(
      'Clear stored data?',
      'This permanently deletes your mood history, reflections, diary entries, gratitude notes, goals, and profile preferences from this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear data',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(APP_DATA_KEYS);
              setSettings(DEFAULT_SETTINGS);
              setNameInput('');
              Alert.alert('Stored data cleared', 'Your PsychePal data has been removed from this device.');
            } catch (error) {
              Alert.alert('Could not clear data', error.message || 'Please try again.');
            }
          },
        },
      ],
    );
  }

  return (
    <Screen>
      <Text style={styles.heading}>Profile & Settings</Text>
      <Text style={styles.subtitle}>Personalize your space and manage your on-device data.</Text>

      <Text style={styles.sectionHeading}>User profile</Text>
      <View style={styles.card}>
        <Text style={styles.fieldLabel}>What should PsychePal call you?</Text>
        <TextInput
          accessibilityLabel="Preferred name"
          value={nameInput}
          onChangeText={setNameInput}
          placeholder="Your preferred name"
          maxLength={40}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={() => saveSettings({ ...settings, preferredName: nameInput.trim() })}
          style={styles.input}
        />
        <Pressable
          accessibilityRole="button"
          disabled={saving}
          onPress={() => saveSettings({ ...settings, preferredName: nameInput.trim() })}
          style={[styles.saveButton, saving && styles.disabled]}
        >
          <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Profile'}</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionHeading}>Personal preferences</Text>
      <View style={styles.card}>
        <View style={styles.preferenceRow}>
          <View style={styles.preferenceCopy}>
            <Text style={styles.fieldLabel}>Daily motivation</Text>
            <Text style={styles.helper}>Show a daily quote on the Home screen.</Text>
          </View>
          <Switch
            accessibilityLabel="Show daily motivation"
            value={settings.showDailyMotivation}
            onValueChange={value => changePreference('showDailyMotivation', value)}
            trackColor={{ false: Theme.border, true: Theme.accent }}
            thumbColor={settings.showDailyMotivation ? Theme.primary : '#F4F3F4'}
          />
        </View>
        <View style={[styles.preferenceRow, styles.lastPreference]}>
          <View style={styles.preferenceCopy}>
            <Text style={styles.fieldLabel}>Daily self-care</Text>
            <Text style={styles.helper}>Show a self-care suggestion on the Home screen.</Text>
          </View>
          <Switch
            accessibilityLabel="Show daily self-care"
            value={settings.showSelfCare}
            onValueChange={value => changePreference('showSelfCare', value)}
            trackColor={{ false: Theme.border, true: Theme.accent }}
            thumbColor={settings.showSelfCare ? Theme.primary : '#F4F3F4'}
          />
        </View>
      </View>

      <Text style={styles.sectionHeading}>Your activities</Text>
      <SectionCard title="Mood History" description="Review saved mood check-ins." onPress={() => navigation.navigate('Mood History')} />
      <SectionCard title="Personal Diary" description="Your entries, gratitude notes, and goals." onPress={() => navigation.navigate('Personal Diary')} />
      <SectionCard title="Support Directory" description="Browse counselors, support services, and contact information." onPress={() => navigation.navigate('Support Directory')} />
      <SectionCard title="Relaxing Games" description="Browse puzzle, word, and relaxing game suggestions." onPress={() => navigation.navigate('Relaxing Games')} />

      <Text style={styles.sectionHeading}>App information</Text>
      <View style={styles.card}>
        <Text style={styles.appName}>PsychePal</Text>
        <Text style={styles.helper}>Version 1.0.0</Text>
        <Text style={styles.appDescription}>
          A personal well-being companion for mood check-ins, reflection, journaling, and finding support.
        </Text>
        <Text style={styles.appDescription}>
          Your profile and activity records are stored locally on this device. They are not synced to an account.
        </Text>
      </View>

      <Text style={styles.sectionHeading}>Data and privacy</Text>
      <View style={styles.card}>
        <Text style={styles.appDescription}>
          Clear stored data permanently removes your mood history, reflections, diary entries, gratitude notes, goals, and profile preferences from this device.
        </Text>
        <Pressable accessibilityRole="button" onPress={clearStoredData} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear Stored Data</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 6 },
  subtitle: { color: Theme.muted, lineHeight: 21, marginBottom: 10 },
  sectionHeading: { color: Theme.text, fontSize: 17, fontWeight: '800', marginTop: 16, marginBottom: 10 },
  card: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 14, padding: 15, marginBottom: 12 },
  fieldLabel: { color: Theme.primaryDark, fontWeight: '700', marginBottom: 6 },
  input: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 10, padding: 11, color: Theme.text },
  saveButton: { backgroundColor: Theme.primary, borderRadius: 10, padding: 12, marginTop: 10, alignItems: 'center' },
  saveButtonText: { color: '#FFFFFF', fontWeight: '700' },
  disabled: { opacity: 0.6 },
  preferenceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: Theme.border },
  lastPreference: { borderBottomWidth: 0, paddingTop: 12 },
  preferenceCopy: { flex: 1, paddingRight: 10 },
  helper: { color: Theme.muted, lineHeight: 19 },
  appName: { color: Theme.primaryDark, fontSize: 17, fontWeight: '800', marginBottom: 3 },
  appDescription: { color: Theme.text, lineHeight: 20, marginTop: 8 },
  clearButton: { alignSelf: 'flex-start', borderWidth: 1, borderColor: '#A94442', borderRadius: 10, paddingHorizontal: 13, paddingVertical: 10, marginTop: 13 },
  clearButtonText: { color: '#A94442', fontWeight: '700' },
});
