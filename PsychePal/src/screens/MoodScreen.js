import React, { useRef, useState } from 'react';
import { Animated, Alert, StyleSheet, Platform, Pressable, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { MoodFace, SoftLandscape } from '../components/CozyArt';
import { CozyText as Text } from '../components/CozyText';
import TextInput from '../components/CozyInput';
import { Theme } from '../styles/theme';
import { useAppSettings } from '../context/AppSettingsContext';

const moods = [
  ['Happy', '#FEF3C7', '#FDE68A'],
  ['Calm', '#D1FAE5', '#A7F3D0'],
  ['Neutral', '#F3F4F6', '#E5E7EB'],
  ['Sad', '#DBEAFE', '#BFDBFE'],
  ['Anxious', '#E9D5FF', '#D8B4FE'],
  ['Angry', '#FBCFE8', '#F9A8D4'],
  ['Tired', '#F3E8FF', '#DDD6FE'],
  ['Distressed', '#FED7AA', '#FDBA74'],
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

function IntensitySlider({ value, onChange, moodColors }) {
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
        <LinearGradient
          pointerEvents="none"
          colors={moodColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.sliderThumbPosition, { left: `${((value - 1) / 9) * 100}%` }]}>
          <View style={styles.sliderThumb} />
        </View>
      </View>
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>Gentle</Text>
        <Text style={styles.sliderLabel}>Very strong</Text>
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
  const { darkMode } = useAppSettings();
  const selectedMood = moods.find(mood => mood[0] === selected);
  const moodColors = selectedMood ? [selectedMood[1], selectedMood[2]] : ['#CFE5D5', '#8FB49A'];
  const heroColors = darkMode ? ['#402B3D', '#30283B'] : ['#FFF4E8', '#EAF3EC'];

  function chooseMood(mood, index) {
    setSelected(mood);
    setSavedMoment(false);
    Animated.parallel(moodScales.map((scale, scaleIndex) => Animated.spring(scale, {
      toValue: scaleIndex === index ? 1.06 : 1,
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
      <LinearGradient
        colors={heroColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerCard}
      >
        <SoftLandscape style={styles.headerLandscape} />
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>A MOMENT FOR YOU</Text>
          <Text style={styles.heading}>How are you feeling today?</Text>
          <Text style={styles.helper}>There’s no right or wrong way to feel. Choose what feels closest.</Text>
        </View>
      </LinearGradient>

      <View style={styles.moodGrid}>
        {moods.map(([mood, color, selectedColor], index) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selected === mood }}
            key={mood}
            onPress={() => chooseMood(mood, index)}
            style={({ pressed }) => [
              styles.moodCard,
              { backgroundColor: selected === mood ? selectedColor : color },
              selected === mood && [styles.selectedMood, { borderColor: selectedColor }],
              selected && selected !== mood && styles.unselectedMood,
              pressed && styles.pressedMood
            ]}
          >
            <Animated.View style={[styles.moodInner, { transform: [{ scale: moodScales[index] }] }]}>
              <MoodFace mood={mood} color={selected === mood ? selectedColor : color} />
              <Text style={[styles.moodLabel, selected === mood && styles.selectedLabel]}>{mood}</Text>
            </Animated.View>
          </Pressable>
        ))}
      </View>

      {selected ? (
        <View style={styles.gentleNote}>
          <Text style={styles.noteLabel}>A GENTLE NOTE</Text>
          <Text style={styles.noteText}>{kindMessages[selected]}</Text>
          {selected === 'Sad' || selected === 'Anxious' || selected === 'Distressed' || selected === 'Angry' ? (
            <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Relaxation Toolkit')}>
              <Text style={styles.breatheLink}>→ Take a gentle breathing pause</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <View style={styles.intensitySection}>
        <View style={styles.intensityHeader}>
          <Text style={styles.sectionLabel}>How strong does it feel?</Text>
          <Text style={styles.intensityValue}>{intensity}/10</Text>
        </View>
        <IntensitySlider value={parseInt(intensity, 10)} onChange={setIntensity} moodColors={moodColors} />
      </View>

      <View style={styles.noteSection}>
        <Text style={styles.sectionLabel}>Add a note (optional)</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="What's on your mind?"
          placeholderTextColor="#B4B9B7"
          multiline
          style={[styles.input, styles.noteInput]}
        />
      </View>

      <View style={styles.dateTimeSection}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setPicker('date')}
          style={styles.dateTimeButton}
        >
          <Text style={styles.dateTimeIcon}>📅</Text>
          <View style={styles.dateTimeContent}>
            <Text style={styles.dateTimeLabel}>Date</Text>
            <Text style={styles.dateTimeValue}>{recordedAt.toLocaleDateString()}</Text>
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => setPicker('time')}
          style={styles.dateTimeButton}
        >
          <Text style={styles.dateTimeIcon}>⏰</Text>
          <View style={styles.dateTimeContent}>
            <Text style={styles.dateTimeLabel}>Time</Text>
            <Text style={styles.dateTimeValue}>{recordedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
        </Pressable>
      </View>

      {picker ? (
        <DateTimePicker
          value={recordedAt}
          mode={picker}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={updateDateTime}
        />
      ) : null}

      {savedMoment ? (
        <Animated.View style={[styles.successCard, { opacity: successMotion, transform: [{ scale: successMotion }, { translateY: successMotion.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }]}>
          <Text style={styles.successEmoji}>🌼</Text>
          <View style={styles.successContent}>
            <Text style={styles.successTitle}>Check-in saved</Text>
            <Text style={styles.successDescription}>Noticing how you feel is a lovely way to care for yourself.</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Dismiss" onPress={() => setSavedMoment(false)} style={styles.dismissButton}>
            <Text style={styles.dismissIcon}>✕</Text>
          </Pressable>
        </Animated.View>
      ) : null}

      <View style={styles.saveButtonWrap}>
        <PrimaryButton title="Save Check-in" onPress={saveMood} />
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  headerCard: {
    minHeight: 180,
    overflow: 'hidden',
    justifyContent: 'center',
    borderRadius: 25,
    padding: 21,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.82)',
    elevation: 2,
    shadowColor: '#78947F',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
  },
  headerLandscape: { height: 92, opacity: 0.5 },
  headerCopy: { zIndex: 1, maxWidth: '89%' },
  eyebrow: { color: Theme.primary, fontSize: 9, fontWeight: '800', letterSpacing: 1.4, marginBottom: 9 },
  heading: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
    color: Theme.text,
    marginBottom: 7,
  },
  helper: {
    fontSize: 14,
    color: Theme.muted,
    lineHeight: 20,
  },

  // Mood Grid
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 10,
    alignSelf: 'center',
    width: '100%',
  },
  moodCard: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  moodInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodLabel: {
    color: Theme.text,
    fontWeight: '600',
    fontSize: 13,
    marginTop: 6,
  },
  selectedMood: {
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    transform: [{ scale: 1.02 }],
  },
  unselectedMood: { opacity: 0.62 },
  pressedMood: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  selectedLabel: {
    color: Theme.primaryDark,
    fontWeight: '700',
  },

  // Gentle Note
  gentleNote: {
    backgroundColor: '#F1F6F2',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(110,146,125,0.15)',
  },
  noteLabel: {
    color: Theme.primary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  noteText: {
    color: Theme.text,
    fontSize: 14,
    lineHeight: 21,
  },
  breatheLink: {
    color: Theme.primaryDark,
    fontWeight: '700',
    fontSize: 13,
    marginTop: 12,
  },

  // Intensity Section
  intensitySection: {
    backgroundColor: '#FFFEFA',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    padding: 16,
    marginBottom: 28,
    elevation: 1,
    shadowColor: '#788078',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  intensityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    color: Theme.text,
    fontWeight: '700',
    fontSize: 14,
  },
  intensityValue: {
    color: Theme.primaryDark,
    fontWeight: '800',
    fontSize: 16,
  },

  // Slider
  sliderTouchArea: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  sliderTrack: {
    height: 10,
    borderRadius: 10,
    position: 'relative',
    overflow: 'visible',
  },
  sliderThumbPosition: {
    position: 'absolute',
    top: -15,
    marginLeft: -16,
  },
  sliderThumb: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Theme.primary,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabel: {
    color: Theme.muted,
    fontSize: 11,
    fontWeight: '500',
  },

  // Note Section
  noteSection: {
    backgroundColor: '#FFFEFA',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    padding: 16,
    marginBottom: 28,
    elevation: 1,
    shadowColor: '#788078',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
    color: Theme.text,
    fontSize: 14,
    fontWeight: '500',
  },
  noteInput: {
    minHeight: 110,
    textAlignVertical: 'top',
  },

  // DateTime Section
  dateTimeSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  dateTimeIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  dateTimeContent: {
    flex: 1,
  },
  dateTimeLabel: {
    color: Theme.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  dateTimeValue: {
    color: Theme.text,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },

  // Success Card
  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  successEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  successContent: {
    flex: 1,
  },
  successTitle: {
    color: Theme.primaryDark,
    fontWeight: '700',
    fontSize: 14,
  },
  successDescription: {
    color: Theme.muted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3,
  },
  dismissButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissIcon: {
    color: Theme.muted,
    fontSize: 18,
    fontWeight: '600',
  },
  saveButtonWrap: { width: '100%', maxWidth: 420, alignSelf: 'center' },
});