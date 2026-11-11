import React, { useRef, useState } from 'react';
import { Animated, Alert, StyleSheet, Platform, Pressable, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { MoodFace, SoftLandscape } from '../components/CozyArt';
import { CozyText as Text } from '../components/CozyText';
import TextInput from '../components/CozyInput';
import { Theme } from '../styles/theme';

const moods = [
  ['Happy', '#F7E5AC'],
  ['Calm', '#DCEBDA'],
  ['Neutral', '#E5E9E7'],
  ['Sad', '#DCE6F1'],
  ['Anxious', '#EAE1F1'],
  ['Angry', '#F3D9D3'],
  ['Tired', '#E5E1EE'],
  ['Distressed', '#F3DDE3'],
];

const kindMessages = {
  Happy: 'Let yourself enjoy this moment. What’s helping you feel this way?',
  Calm: 'There’s no rush. Notice what helped you find a little calm.',
  Neutral: 'Neutral is a perfectly good place to be. What would feel helpful now?',
  Sad: 'It’s okay to feel this way. You don’t have to carry it all at once.',
  Anxious: 'You’re here in this moment. Let’s take one small, gentle breath.',
  Angry: 'Your feelings deserve space. A pause can help you choose what comes next.',
  Tired: 'Rest is allowed. You can take things one small step at a time.',
  Distressed: 'You don’t have to figure everything out right now. Let’s take one slow breath together.',
};

function IntensitySlider({ value, onChange }) {
  const [track, setTrack] = useState({ x: 0, width: 0 });
  const trackRef = useRef(null);
  const measureTrack = () => {
    trackRef.current?.measureInWindow((x, y, width) => setTrack({ x, width }));
  };
  const updateValue = pageX => {
    if (!track.width) return;
    const position = Math.max(0, Math.min(1, (pageX - track.x) / track.width));
    onChange(Math.round(1 + position * 9));
  };
  return (
    <Pressable
      accessibilityRole="adjustable"
      accessibilityLabel="Mood intensity"
      accessibilityValue={{ min: 1, max: 10, now: value, text: `${value} out of 10` }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={event => onChange(Math.max(1, Math.min(10, value + (event.nativeEvent.actionName === 'increment' ? 1 : -1))))}
      style={styles.sliderTouchArea}
      onLayout={measureTrack}
      onPress={event => updateValue(event.nativeEvent.pageX)}
      onTouchMove={event => updateValue(event.nativeEvent.pageX)}
    >
      <View ref={trackRef} onLayout={measureTrack} style={styles.sliderTrack}>
        <View style={[styles.sliderSegment, { backgroundColor: '#A8C6A7' }]} />
        <View style={[styles.sliderSegment, { backgroundColor: '#E8D39D' }]} />
        <View style={[styles.sliderSegment, { backgroundColor: '#E8B4A7' }]} />
        <View style={[styles.sliderThumbPosition, { left: `${((value - 1) / 9) * 100}%` }]}>
          <View style={styles.sliderThumb} />
        </View>
      </View>
    </Pressable>
  );
}

export default function MoodScreen({ navigation }) {
  const [selected, setSelected] = useState('');
  const [note, setNote] = useState('');
  const [intensity, setIntensity] = useState('5');
  const [recordedAt, setRecordedAt] = useState(new Date());
  const [picker, setPicker] = useState(null);
  const [savedMoment, setSavedMoment] = useState(false);
  const moodScales = useRef(moods.map(() => new Animated.Value(1))).current;
  const successMotion = useRef(new Animated.Value(0)).current;

  function chooseMood(mood, index) {
    setSelected(mood);
    setSavedMoment(false);
    Animated.parallel(moodScales.map((scale, scaleIndex) => Animated.spring(scale, {
      toValue: scaleIndex === index ? 1.1 : 1,
      useNativeDriver: Platform.OS !== 'web',
      speed: 22,
      bounciness: 7,
    }))).start();
  }

  async function saveMood() {
    if (!selected) return Alert.alert('Choose a mood', 'Please select how you feel first.');
    try {
      const moodIntensity = Math.min(10, Math.max(1, Number(intensity) || 5));
      const stored = await AsyncStorage.getItem('moodRecords');
      const existing = JSON.parse(stored || '[]');
      if (!Array.isArray(existing)) throw new Error('Your saved mood check-ins are not in the expected format.');
      const record = { id: Date.now().toString(), mood: selected, intensity: moodIntensity, note: note.trim(), date: recordedAt.toISOString() };
      await AsyncStorage.setItem('moodRecords', JSON.stringify([record, ...existing]));
      setIntensity(5);
      setNote('');
      setRecordedAt(new Date());
      setSelected('');
      setSavedMoment(true);
      successMotion.setValue(0);
      Animated.spring(successMotion, {
        toValue: 1,
        useNativeDriver: Platform.OS !== 'web',
        speed: 14,
        bounciness: 9,
      }).start();
    } catch (error) {
      Alert.alert('Could not save your check-in', error.message || 'Please try again.');
    }
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
      <View style={styles.welcomeCard}>
        <SoftLandscape style={styles.moodLandscape} />
        <Text style={styles.eyebrow}>A MOMENT FOR YOU</Text>
        <Text style={styles.heading}>How are you feeling today?</Text>
        <Text style={styles.helper}>There’s no right or wrong way to feel. Choose what feels closest.</Text>
      </View>
      <View style={styles.moodGrid}>
        {moods.map(([mood, color], index) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selected === mood }}
            key={mood}
            onPress={() => chooseMood(mood, index)}
            style={({ pressed }) => [styles.mood, { backgroundColor: color }, selected === mood && styles.selected, pressed && styles.pressed]}
          >
            <Animated.View style={[styles.moodContents, { transform: [{ scale: moodScales[index] }] }]}>
              <MoodFace mood={mood} color={color} />
              <Text style={[styles.moodText, selected === mood && styles.selectedText]}>{mood}</Text>
            </Animated.View>
          </Pressable>
        ))}
      </View>
      {selected ? (
        <View style={styles.kindCard}>
          <Text style={styles.kindEyebrow}>A GENTLE NOTE</Text>
          <Text style={styles.kindMessage}>{kindMessages[selected]}</Text>
          {selected === 'Sad' || selected === 'Anxious' || selected === 'Distressed' || selected === 'Angry' ? (
            <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Relaxation Toolkit')}>
              <Text style={styles.breatheLink}>Take a gentle breathing pause  ›</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
      <View style={styles.intensityHeading}>
        <Text style={styles.label}>How strong does it feel?</Text>
        <Text style={styles.intensityValue}>{intensity}/10</Text>
      </View>
      <Text style={styles.intensityHint}>Gentle                                       Very strong</Text>
      <IntensitySlider value={intensity} onChange={setIntensity} />
      <Text style={styles.label}>Optional note</Text>
      <TextInput value={note} onChangeText={setNote} placeholder="What might have influenced this mood?" placeholderTextColor="#8A958E" multiline style={[styles.input, styles.multiline]} />
      <Text style={styles.label}>Date and time</Text>
      <Pressable accessibilityRole="button" onPress={() => setPicker('date')} style={styles.dateButton}><Text style={styles.dateText}>Date: {recordedAt.toLocaleDateString()}</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={() => setPicker('time')} style={styles.dateButton}><Text style={styles.dateText}>Time: {recordedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text></Pressable>
      {picker ? (
        <DateTimePicker
          value={recordedAt}
          mode={picker}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={updateDateTime}
        />
      ) : null}
      {savedMoment ? (
        <Animated.View style={[styles.savedCard, { opacity: successMotion, transform: [{ scale: successMotion }, { translateY: successMotion.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }]}>
          <Text style={styles.savedFlower}>🌼</Text>
          <View style={styles.savedCopy}>
            <Text style={styles.savedTitle}>Thank you for checking in.</Text>
            <Text style={styles.savedDescription}>Noticing how you feel is a lovely way to care for yourself.</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Dismiss saved check-in" onPress={() => setSavedMoment(false)} style={styles.dismissSaved}>
            <Text style={styles.dismissText}>×</Text>
          </Pressable>
        </Animated.View>
      ) : null}
      <PrimaryButton title="Save Mood Check-in" onPress={saveMood} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  welcomeCard: { minHeight: 168, backgroundColor: '#E8EDF3', borderRadius: 24, padding: 18, overflow: 'hidden', justifyContent: 'center', marginBottom: 20 },
  moodLandscape: { height: 85, opacity: 0.8 },
  eyebrow: { color: Theme.primary, fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 6 },
  helper: { color: Theme.muted, lineHeight: 20, maxWidth: '90%' },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', columnGap: 7 },
  mood: { width: '31%', minHeight: 104, borderColor: 'rgba(255,255,255,0.8)', borderWidth: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 10, elevation: 1, shadowColor: '#6E7170', shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  moodContents: { alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.96 }] },
  moodText: { color: Theme.text, fontWeight: '600' },
  selected: { borderColor: Theme.primary, borderWidth: 2, elevation: 3 },
  selectedText: { color: Theme.primaryDark, fontWeight: '800' },
  kindCard: { backgroundColor: '#F0EAF5', borderRadius: 18, padding: 15, marginTop: 2, marginBottom: 5 },
  kindEyebrow: { color: Theme.primary, fontSize: 9, fontWeight: '800', letterSpacing: 1.3, marginBottom: 6 },
  kindMessage: { color: Theme.text, lineHeight: 21 },
  breatheLink: { color: Theme.primaryDark, fontWeight: '800', marginTop: 9 },
  intensityHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 },
  label: { color: Theme.text, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  intensityValue: { color: Theme.primaryDark, fontWeight: '800', fontSize: 17 },
  intensityHint: { color: Theme.muted, fontSize: 10, marginTop: 1, marginBottom: 2 },
  sliderTouchArea: { height: 38, justifyContent: 'center', marginBottom: 10 },
  sliderTrack: { height: 11, flexDirection: 'row', borderRadius: 8, backgroundColor: '#E8B4A7', position: 'relative', marginHorizontal: 8 },
  sliderSegment: { flex: 1, height: 11 },
  sliderThumbPosition: { position: 'absolute', top: -8, marginLeft: -13 },
  sliderThumb: { width: 27, height: 27, borderRadius: 14, backgroundColor: '#FFFEFA', borderWidth: 3, borderColor: Theme.primary, elevation: 3, shadowColor: '#4C6656', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  input: { backgroundColor: '#F0F0EB', borderWidth: 0, borderRadius: 19, padding: 15, color: Theme.text },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  dateButton: { backgroundColor: Theme.surface, borderColor: Theme.border, borderWidth: 1, borderRadius: 17, padding: 13, marginBottom: 8 },
  dateText: { color: Theme.text },
  savedCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E5F0E3', borderRadius: 21, padding: 15, marginTop: 13, marginBottom: 8 },
  savedFlower: { fontSize: 29, marginRight: 11 },
  savedCopy: { flex: 1 },
  savedTitle: { color: Theme.primaryDark, fontWeight: '800' },
  savedDescription: { color: Theme.muted, fontSize: 11, lineHeight: 16, marginTop: 3 },
  dismissSaved: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  dismissText: { color: Theme.muted, fontSize: 23, lineHeight: 25 },
});