import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, Alert } from 'react-native';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { Theme } from '../styles/theme';
import responses from '../data/chatbotResponses.json';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('Hi, I’m PsychePal. What would you like to reflect on today?');

  function send() {
    const text = message.trim().toLowerCase();
    if (!text) return;
    const match = responses.find(item => item.keywords.some(word => text.includes(word)));
    setReply(match ? match.response : 'Thank you for sharing that. Would it help to describe what happened and what you need right now?');
    setMessage('');
  }

  return (
    <Screen>
      <Text style={styles.heading}>PsychePal Chat 💜</Text>
      <Text style={styles.disclaimer}>A simple, predefined support companion. It is not a real AI or a professional counselor.</Text>
      <View style={styles.reply}><Text style={styles.replyText}>{reply}</Text></View>
      <TextInput value={message} onChangeText={setMessage} placeholder="Type a thought or feeling..." style={styles.input} multiline />
      <PrimaryButton title="Send" onPress={send} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text, marginBottom: 10 },
  disclaimer: { color: Theme.muted, lineHeight: 20, marginBottom: 18 },
  reply: { backgroundColor: Theme.lavender, padding: 16, borderRadius: 16, marginBottom: 16 },
  replyText: { color: Theme.primaryDark, lineHeight: 22 },
  input: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 12, padding: 12, minHeight: 70, textAlignVertical: 'top' },
});