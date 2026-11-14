import React, { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import * as LocalStore from '../data/localStore';
import { useFocusEffect } from '@react-navigation/native';
import Screen from '../components/Screen';
import CozyHero from '../components/CozyHero';
import { CozyText as Text } from '../components/CozyText';
import TextInput from '../components/CozyInput';
import { Theme } from '../styles/theme';

const reflectionSections = [
  {
    id: 'cbt',
    title: 'CBT Thought Reflection',
    icon: '☁',
    color: '#EEE8F8',
    prompts: [
      ['1. What happened?', 'Describe the situation...'],
      ['2. What thought came to mind?', 'Write the automatic thought...'],
      ['3. What did you feel?', 'Name the emotion and intensity...'],
      ['4. What evidence supports or challenges it?', 'Consider facts and alternative interpretations...'],
      ['5. Is there a more balanced thought?', 'Write a kinder, realistic perspective...'],
    ],
  },
  {
    id: 'awareness',
    title: 'Self-Aware Questions',
    icon: '☼',
    color: '#E8F2EA',
    prompts: [
      ['What energizes or drains you?', 'Notice patterns in your daily experiences...'],
      ['What reaction would you like to understand better?', 'Describe a recent emotional response...'],
      ['What do you need more of right now?', 'Consider rest, connection, clarity, or support...'],
    ],
  },
  {
    id: 'personality',
    title: 'Personality Reflection',
    icon: '✿',
    color: '#E8F1F7',
    prompts: [
      ['How do you usually respond under pressure?', 'Describe your common reactions without judgment...'],
      ['How do others experience you?', 'Consider feedback and moments when you connect well...'],
      ['What traits feel most like you?', 'Name qualities you want to understand or develop...'],
    ],
  },
  {
    id: 'strengths',
    title: 'Strengths and Weaknesses',
    icon: '✦',
    color: '#FAEAE4',
    prompts: [
      ['What strengths are you proud of?', 'Think of skills others have noticed or you use often...'],
      ['Where would you like support or growth?', 'Describe a challenge as a specific area to practice...'],
      ['What is one realistic next step?', 'Choose a small action that builds on your strengths...'],
    ],
  },
];

export default function ReflectionScreen() {
  const [sectionId, setSectionId] = useState('cbt');
  const [situation, setSituation] = useState('');
  const [thought, setThought] = useState('');
  const [feeling, setFeeling] = useState('');
  const [alternative, setAlternative] = useState('');
  const [evidence, setEvidence] = useState('');
  const [extraAnswer, setExtraAnswer] = useState('');
  const [notes, setNotes] = useState([]);
  const [focusedField, setFocusedField] = useState(null);

  const loadNotes = useCallback(async () => {
    try {
      const saved = await LocalStore.getItem('reflectionNotes');
      const loadedNotes = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(loadedNotes)) throw new Error('Reflection notes data is not a list.');
      setNotes(loadedNotes);
    } catch (error) {
      Alert.alert('Could not load reflection notes', error.message || 'Please try again.');
    }
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
      evidence: evidence.trim(),
      extraAnswer: extraAnswer.trim(),
      section: reflectionSections.find(section => section.id === sectionId)?.title || 'Self-Discovery',
      date: new Date().toISOString(),
    };
    const updated = [entry, ...notes];
    try {
      await LocalStore.setItem('reflectionNotes', JSON.stringify(updated));
      setNotes(updated);
      clearReflection();
      Alert.alert('Reflection saved', 'Your personal reflection note has been saved on this device.');
    } catch (error) {
      Alert.alert('Could not save reflection', error.message || 'Please try again.');
    }
  }

  async function removeNote(id) {
    const updated = notes.filter(note => note.id !== id);
    try {
      await LocalStore.setItem('reflectionNotes', JSON.stringify(updated));
      setNotes(updated);
    } catch (error) {
      Alert.alert('Could not delete reflection', error.message || 'Please try again.');
    }
  }

  function clearReflection() {
    setSituation('');
    setThought('');
    setFeeling('');
    setAlternative('');
    setEvidence('');
    setExtraAnswer('');
  }

  const completedQuestions = [situation, thought, feeling, evidence, alternative].filter(value => value.trim()).length;
  const field = (label, value, setter, hint, index) => (
    <View style={[styles.questionCard, focusedField === label && styles.questionFocused]}>
      <View style={styles.questionHeader}>
        {index ? <View style={styles.stepBadge}><Text style={styles.stepNumber}>{String(index).padStart(2, '0')}</Text></View> : null}
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={setter}
        onFocus={() => setFocusedField(label)}
        onBlur={() => setFocusedField(null)}
        placeholder={hint}
        multiline
        style={[styles.input, focusedField === label && styles.inputFocused]}
      />
    </View>
  );
  return (
    <Screen>
      <View style={styles.content}>
        <CozyHero
          eyebrow="GENTLE SELF-DISCOVERY"
          title="A Space to Understand Yourself"
          description="Explore your thoughts, recognize your strengths, and develop a kinder relationship with yourself."
          art="🪷"
          colors={['#EEE8F7', '#E3EEF2']}
        />
        <Text style={styles.help}>These prompts are for personal reflection and are not a personality assessment or therapy.</Text>
        <View style={styles.sections}>
          {reflectionSections.map(section => (
            <Pressable key={section.id} accessibilityRole="button" accessibilityState={{ selected: sectionId === section.id }} style={({ pressed, hovered }) => [styles.sectionButton, { backgroundColor: section.color }, sectionId === section.id && styles.activeSection, (pressed || hovered) && styles.sectionHover]} onPress={() => { setSectionId(section.id); clearReflection(); }}>
              <Text style={[styles.sectionIcon, sectionId === section.id && styles.activeSectionText]}>{section.icon}</Text>
              <Text style={[styles.sectionButtonText, sectionId === section.id && styles.activeSectionText]}>{section.title}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.guidanceHeading}>{reflectionSections.find(section => section.id === sectionId)?.title}</Text>
        {sectionId === 'cbt' ? (
          <View style={styles.progressCard}>
            <Text style={styles.progressText}>{completedQuestions} of 5 questions completed</Text>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${completedQuestions * 20}%` }]} /></View>
          </View>
        ) : null}
        {sectionId === 'cbt' ? (
          <>
            {field('What happened?', situation, setSituation, 'Describe the situation...', 1)}
            {field('What thought came to mind?', thought, setThought, 'Write the automatic thought...', 2)}
            {field('What did you feel?', feeling, setFeeling, 'Name the emotion and intensity...', 3)}
            {field('What evidence supports or challenges it?', evidence, setEvidence, 'Consider facts and alternative interpretations...', 4)}
            {field('Is there a more balanced thought?', alternative, setAlternative, 'Write a kinder, realistic perspective...', 5)}
          </>
        ) : sectionId === 'awareness' ? (
          <>
            {field('What energizes or drains you?', situation, setSituation, 'Notice patterns in your daily experiences...')}
            {field('What reaction would you like to understand better?', thought, setThought, 'Describe a recent emotional response...')}
            {field('What do you need more of right now?', feeling, setFeeling, 'Consider rest, connection, clarity, or support...')}
          </>
        ) : sectionId === 'personality' ? (
          <>
            {field('How do you usually respond under pressure?', situation, setSituation, 'Describe your common reactions without judgment...')}
            {field('How do others experience you?', thought, setThought, 'Consider feedback and moments when you connect well...')}
            {field('What traits feel most like you?', feeling, setFeeling, 'Name qualities you want to understand or develop...')}
          </>
        ) : (
          <>
            {field('What strengths are you proud of?', situation, setSituation, 'Think of skills others have noticed or you use often...')}
            {field('Where would you like support or growth?', thought, setThought, 'Describe a challenge as an area to practice...')}
            {field('What is one realistic next step?', feeling, setFeeling, 'Choose a small action that builds on your strengths...')}
          </>
        )}
        <Pressable accessibilityRole="button" onPress={saveReflection} style={({ pressed, hovered }) => [styles.saveButton, (pressed || hovered) && styles.sectionHover]}>
          <Text style={styles.saveButtonText}>Save Reflection Note</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={clearReflection} style={({ pressed, hovered }) => [styles.clearButton, (pressed || hovered) && styles.sectionHover]}>
          <Text style={styles.clearButtonText}>Clear Reflection</Text>
        </Pressable>
        <Text style={styles.subheading}>Personal Reflection Notes</Text>
        {notes.map(note => (
          <Pressable
            key={note.id}
            accessibilityRole="button"
            accessibilityLabel={`Reflection note from ${new Date(note.date).toLocaleString()}. Tap to read or delete.`}
            style={styles.note}
            onPress={() => Alert.alert(
              new Date(note.date).toLocaleString(),
              [note.section && `Type: ${note.section}`, note.situation && `Situation: ${note.situation}`, note.thought && `Thought: ${note.thought}`, note.feeling && `Feeling: ${note.feeling}`, note.evidence && `Evidence: ${note.evidence}`, note.alternative && `Balanced perspective: ${note.alternative}`].filter(Boolean).join('\n\n'),
              [{ text: 'Close' }, { text: 'Delete', style: 'destructive', onPress: () => removeNote(note.id) }],
            )}
          >
            <Text style={styles.noteTitle}>{note.thought || note.feeling || note.situation || 'Reflection note'}</Text>
            <Text style={styles.noteDate}>{new Date(note.date).toLocaleString()}</Text>
            <Text style={styles.noteHint}>Tap to read or delete</Text>
          </Pressable>
        ))}
        {!notes.length ? <Text style={styles.empty}>Your saved personal reflection notes will appear here.</Text> : null}
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  content: { width: '100%', maxWidth: 900, alignSelf: 'center' },
  help: { color: Theme.muted, lineHeight: 20, marginBottom: 10 },
  questionCard: { backgroundColor: '#FFFEFA', borderWidth: 1, borderColor: '#E8DFEF', borderRadius: 20, padding: 16, marginTop: 10 },
  questionFocused: { borderColor: Theme.primary },
  questionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  stepBadge: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEE8F8', marginRight: 10 },
  stepNumber: { color: '#785BA8', fontWeight: '800', fontSize: 12 },
  label: { color: Theme.text, fontWeight: '800', flexShrink: 1, lineHeight: 21 },
  input: { backgroundColor: '#FBF8F2', color: Theme.text, borderWidth: 1, borderColor: Theme.border, borderRadius: 14, minHeight: 105, padding: 14, textAlignVertical: 'top' },
  inputFocused: { borderColor: Theme.primary },
  sections: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6, gap: 8 },
  sectionButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Theme.border, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 4 },
  activeSection: { backgroundColor: Theme.primaryDark, borderColor: Theme.primaryDark },
  sectionHover: { opacity: 0.85 },
  sectionIcon: { color: Theme.primaryDark, fontSize: 18, marginRight: 7 },
  sectionButtonText: { color: Theme.text, fontSize: 12, fontWeight: '700' },
  activeSectionText: { color: '#FFFFFF' },
  guidanceHeading: { color: Theme.primaryDark, fontSize: 19, fontWeight: '800', marginTop: 14, marginBottom: 8 },
  progressCard: { marginVertical: 6 },
  progressText: { color: Theme.muted, fontSize: 12, fontWeight: '700', marginBottom: 8 },
  progressTrack: { height: 7, borderRadius: 4, backgroundColor: '#E9E4EF', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: Theme.primary },
  saveButton: { backgroundColor: Theme.primaryDark, borderRadius: 18, padding: 15, alignItems: 'center', marginTop: 16 },
  saveButtonText: { color: '#FFFFFF', fontWeight: '700' },
  clearButton: { backgroundColor: Theme.lavender, borderRadius: 18, padding: 15, alignItems: 'center', marginTop: 8 },
  clearButtonText: { color: Theme.primaryDark, fontWeight: '700' },
  subheading: { fontSize: 18, fontWeight: '800', color: Theme.text, marginTop: 24, marginBottom: 10 },
  note: { backgroundColor: 'rgba(255,255,255,0.82)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: 16, marginBottom: 10 },
  noteTitle: { color: Theme.text, fontWeight: '700', lineHeight: 21 },
  noteDate: { color: Theme.muted, fontSize: 12, marginTop: 5 },
  noteHint: { color: Theme.primary, fontSize: 12, fontWeight: '700', marginTop: 8 },
  empty: { color: Theme.muted },
});