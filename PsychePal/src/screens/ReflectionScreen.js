import React, { useState } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { Theme } from '../styles/theme';

export default function ReflectionScreen() {
  const [situation, setSituation] = useState('');
  const [thought, setThought] = useState('');
  const [feeling, setFeeling] = useState('');
  const [alternative, setAlternative] = useState('');
  const field = (label, value, setter, hint) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={setter} placeholder={hint} multiline style={styles.input} />
    </>
  );
  return (
    <Screen>
      <Text style={styles.heading}>Thought Reflection</Text>
      <Text style={styles.help}>A self-reflection activity. You can write privately in the fields below.</Text>
      {field('1. What happened?', situation, setSituation, 'Describe the situation...')}
      {field('2. What thought came to mind?', thought, setThought, 'Write the thought...')}
      {field('3. What did you feel?', feeling, setFeeling, 'Name the emotion...')}
      {field('4. Is there another way to look at it?', alternative, setAlternative, 'Consider another perspective...')}
      <PrimaryButton title="Clear Reflection" secondary onPress={() => { setSituation(''); setThought(''); setFeeling(''); setAlternative(''); }} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 8 },
  help: { color: Theme.muted, lineHeight: 20, marginBottom: 10 },
  label: { color: Theme.text, fontWeight: '700', marginTop: 10, marginBottom: 6 },
  input: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 12, minHeight: 72, padding: 12, textAlignVertical: 'top' },
});