import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { Theme } from '../styles/theme';
import responses from '../data/chatbotResponses.json';

const conversationStyles = [
  ['Calm', 'calm'],
  ['Motivating', 'motivating'],
  ['Reflective', 'reflective'],
];

const suggestedQuestions = [
  'I feel stressed today.',
  'How can I feel calmer?',
  'I am worried about my future.',
  'I want to understand an angry feeling.',
  'Help me reflect on my strengths.',
];

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('Hi, I’m PsychePal. What would you like to reflect on today?');
  const [conversationStyle, setConversationStyle] = useState('calm');

  function addStyle(responseText) {
    if (conversationStyle === 'motivating') return `You can take this one step at a time. ${responseText}`;
    if (conversationStyle === 'reflective') return `${responseText} Before responding, what has felt most important in this situation?`;
    return responseText;
  }

  function send() {
    const text = message.trim().toLowerCase();
    if (!text) return;
    const match = responses.find(item => item.keywords.some(word => text.includes(word)));
    const fallback = 'Thank you for sharing that. Would it help to describe what happened and what you need right now?';
    setReply(addStyle(match ? match.response : fallback));
    setMessage('');
  }

  return (
    <Screen>
      <Text style={styles.heading}>PsychePal Chat 💜</Text>
      <Text style={styles.disclaimer}>A simple, predefined support companion. It is not a real AI or a professional counselor.</Text>
      <Text style={styles.label}>Conversation style</Text>
      <View style={styles.styles}>
        {conversationStyles.map(([label, value]) => (
          <Pressable key={value} style={[styles.styleButton, conversationStyle === value && styles.activeStyle]} onPress={() => setConversationStyle(value)}>
            <Text style={[styles.styleText, conversationStyle === value && styles.activeStyleText]}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.reply}><Text style={styles.replyText}>{reply}</Text></View>
      <Text style={styles.label}>Suggested questions</Text>
      <View style={styles.suggestions}>
        {suggestedQuestions.map(question => (
          <Pressable key={question} style={styles.suggestion} onPress={() => setMessage(question)}>
            <Text style={styles.suggestionText}>{question}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput value={message} onChangeText={setMessage} placeholder="Type a thought or feeling..." style={styles.input} multiline />
      <PrimaryButton title="Send" onPress={send} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 10 },
  disclaimer: { color: Theme.muted, lineHeight: 20, marginBottom: 18 },
  label: { color: Theme.text, fontWeight: '700', marginBottom: 8 },
  styles: { flexDirection: 'row', marginBottom: 16 },
  styleButton: { flex: 1, alignItems: 'center', borderWidth: 1, borderColor: Theme.border, borderRadius: 10, paddingVertical: 9, marginRight: 6 },
  activeStyle: { backgroundColor: Theme.primary, borderColor: Theme.primary },
  styleText: { color: Theme.text, fontWeight: '700' },
  activeStyleText: { color: '#FFFFFF' },
  reply: { backgroundColor: Theme.lavender, padding: 16, borderRadius: 16, marginBottom: 16 },
  replyText: { color: Theme.primaryDark, lineHeight: 22 },
  suggestions: { marginBottom: 12 },
  suggestion: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 10, padding: 10, marginBottom: 7 },
  suggestionText: { color: Theme.primaryDark },
  input: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 12, padding: 12, minHeight: 70, textAlignVertical: 'top' },
});