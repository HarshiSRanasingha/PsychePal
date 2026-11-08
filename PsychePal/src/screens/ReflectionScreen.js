import React, { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { Theme } from '../styles/theme';

const reflectionSections = [
  {
    id: 'cbt',
    title: 'CBT Thought Reflection',
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
    prompts: [
      ['What energizes or drains you?', 'Notice patterns in your daily experiences...'],
      ['What reaction would you like to understand better?', 'Describe a recent emotional response...'],
      ['What do you need more of right now?', 'Consider rest, connection, clarity, or support...'],
    ],
  },
  {
    id: 'personality',
    title: 'Personality Reflection',
    prompts: [
      ['How do you usually respond under pressure?', 'Describe your common reactions without judgment...'],
      ['How do others experience you?', 'Consider feedback and moments when you connect well...'],
      ['What traits feel most like you?', 'Name qualities you want to understand or develop...'],
    ],
  },
  {
    id: 'strengths',
    title: 'Strengths and Weaknesses',
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
      evidence: evidence.trim(),
      extraAnswer: extraAnswer.trim(),
      section: reflectionSections.find(section => section.id === sectionId)?.title || 'Self-Discovery',
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
    setEvidence('');
    setExtraAnswer('');
  }

  const field = (label, value, setter, hint) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={setter} placeholder={hint} multiline style={styles.input} />
    </>
  );
  return (
    <Screen>
      <Text style={styles.heading}>Self-Discovery and Reflection</Text>
      <Text style={styles.help}>Explore patterns, values, strengths, and thoughts privately. Reflection prompts are educational and are not personality assessments or therapy.</Text>
      <View style={styles.sections}>
        {reflectionSections.map(section => (
          <Pressable key={section.id} style={[styles.sectionButton, sectionId === section.id && styles.activeSection]} onPress={() => { setSectionId(section.id); clearReflection(); }}>
            <Text style={[styles.sectionButtonText, sectionId === section.id && styles.activeSectionText]}>{section.title}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.guidanceHeading}>{reflectionSections.find(section => section.id === sectionId)?.title}</Text>
      {sectionId === 'cbt' ? (
        <>
          {field('1. What happened?', situation, setSituation, 'Describe the situation...')}
          {field('2. What thought came to mind?', thought, setThought, 'Write the automatic thought...')}
          {field('3. What did you feel?', feeling, setFeeling, 'Name the emotion and intensity...')}
          {field('4. What evidence supports or challenges it?', evidence, setEvidence, 'Consider facts and alternative interpretations...')}
          {field('5. Is there a more balanced thought?', alternative, setAlternative, 'Write a kinder, realistic perspective...')}
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
      <PrimaryButton title="Save Reflection Note" onPress={saveReflection} />
      <PrimaryButton title="Clear Reflection" secondary onPress={clearReflection} />
      <Text style={styles.subheading}>Personal Reflection Notes</Text>
      {notes.map(note => (
        <Text
          key={note.id}
          style={styles.note}
          onPress={() => Alert.alert(
            new Date(note.date).toLocaleString(),
            [note.section && `Type: ${note.section}`, note.situation && `Situation: ${note.situation}`, note.thought && `Thought: ${note.thought}`, note.feeling && `Feeling: ${note.feeling}`, note.evidence && `Evidence: ${note.evidence}`, note.alternative && `Balanced perspective: ${note.alternative}`].filter(Boolean).join('\n\n'),
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
  sections: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  sectionButton: { borderWidth: 1, borderColor: Theme.border, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, marginRight: 6, marginBottom: 6 },
  activeSection: { backgroundColor: Theme.primary, borderColor: Theme.primary },
  sectionButtonText: { color: Theme.text, fontSize: 12, fontWeight: '700' },
  activeSectionText: { color: '#FFFFFF' },
  guidanceHeading: { color: Theme.primaryDark, fontSize: 18, fontWeight: '800', marginTop: 10 },
  subheading: { fontSize: 18, fontWeight: '800', color: Theme.text, marginTop: 24, marginBottom: 10 },
  note: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 12, padding: 14, marginBottom: 10, color: Theme.text, lineHeight: 21 },
  empty: { color: Theme.muted },
});