import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { CloudPal } from '../components/CozyArt';
import { CozyText as Text } from '../components/CozyText';
import TextInput from '../components/CozyInput';
import { Theme } from '../styles/theme';
import responses from '../data/chatbotResponses.json';

const conversationStyles = [
  ['Friendly', 'friendly'],
  ['Calm', 'calm'],
  ['Serious', 'serious'],
  ['Funny', 'funny'],
  ['Lovely', 'lovely'],
];

const suggestedQuestions = [
  'I feel stressed today.',
  'How can I feel calmer?',
  'I am worried about my future.',
  'I want to understand an angry feeling.',
  'Help me reflect on my strengths.',
];

const personalityGreetings = {
  friendly: "👋 Hey! So glad you're here. I'm all ears!",
  serious: "I'm here to listen attentively. Let's think through things carefully.",
  funny: "😂 Life's too short to be serious all the time! What's up?",
  lovely: "🌸 Sending you a big warm hug. You're not alone. Tell me everything.",
  calm: "Take your time. I'm here to listen and help you find the next calm step.",
};

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [conversationStyle, setConversationStyle] = useState('friendly');
  const [conversation, setConversation] = useState([
    { id: 'welcome', role: 'bot', text: 'Hi, I’m PsychePal. What would you like to reflect on today?' },
  ]);

  function addStyle(responseText) {
    if (conversationStyle === 'motivating') return `You can take this one step at a time. ${responseText}`;
    if (conversationStyle === 'reflective') return `${responseText} Before responding, what has felt most important in this situation?`;
    if (conversationStyle === 'friendly') return `I'm here with you. ${responseText}`;
    if (conversationStyle === 'serious') return `Let's approach this calmly and clearly. ${responseText}`;
    if (conversationStyle === 'funny') return `Life can feel wonderfully awkward sometimes. ${responseText}`;
    if (conversationStyle === 'lovely') return `Sending a little warmth your way. ${responseText}`;
    return responseText;
  }

  function changeStyle(style) {
    setConversationStyle(style);
    setConversation([{ id: `greeting-${style}`, role: 'bot', text: personalityGreetings[style] }]);
    setMessage('');
  }

  function send() {
    const text = message.trim().toLowerCase();
    if (!text) return;
    const match = responses.find(item => item.keywords.some(word => text.includes(word)));
    const fallback = 'Thank you for sharing that. Would it help to describe what happened and what you need right now?';
    const botReply = addStyle(match ? match.response : fallback);
    setConversation(messages => [
      ...messages,
      { id: `user-${Date.now()}`, role: 'user', text: message.trim() },
      { id: `bot-${Date.now() + 1}`, role: 'bot', text: botReply },
    ]);
    setMessage('');
  }

  return (
    <Screen>
      <View style={styles.chatHero}>
        <View style={styles.avatarWrap}><CloudPal size={66} /></View>
        <View style={styles.heroCopy}>
          <Text style={styles.heading}>A little chat</Text>
          <Text style={styles.heroSubtitle}>A kind space to gather your thoughts.</Text>
        </View>
      </View>
      <Text style={styles.disclaimer}>PsychePal uses predefined replies. It isn’t a real AI or a professional counselor.</Text>
      <Text style={styles.label}>Conversation style</Text>
      <View style={styles.styles}>
        {conversationStyles.map(([label, value]) => (
          <Pressable key={value} style={[styles.styleButton, conversationStyle === value && styles.activeStyle]} onPress={() => changeStyle(value)}>
            <Text style={[styles.styleText, conversationStyle === value && styles.activeStyleText]}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.history} accessibilityLabel="Conversation history">
        {conversation.map(item => (
          <View key={item.id} style={[styles.messageRow, item.role === 'user' && styles.userRow]}>
            {item.role === 'bot' ? <View style={styles.miniAvatar}><CloudPal size={31} /></View> : null}
            <View style={[styles.message, item.role === 'user' ? styles.userMessage : styles.botMessage]}>
              <Text style={[styles.messageText, item.role === 'user' && styles.userMessageText]}>{item.text}</Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={styles.label}>If you’re not sure where to start</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionScroll} contentContainerStyle={styles.suggestions}>
        {suggestedQuestions.map(question => (
          <Pressable accessibilityRole="button" key={question} style={styles.suggestion} onPress={() => setMessage(question)}>
            <Text style={styles.suggestionText}>{question}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <TextInput value={message} onChangeText={setMessage} placeholder="Type a thought or feeling..." style={styles.input} multiline />
      <PrimaryButton title="Send" onPress={send} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  chatHero: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8EDF3', borderRadius: 23, padding: 14, marginBottom: 12, overflow: 'hidden' },
  avatarWrap: { width: 75, height: 66, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DDE8E5', borderRadius: 20, marginRight: 13 },
  heroCopy: { flex: 1 },
  heading: { fontSize: 23, fontWeight: '800', color: Theme.text },
  heroSubtitle: { color: Theme.muted, lineHeight: 19, marginTop: 4, fontSize: 12 },
  disclaimer: { color: Theme.muted, lineHeight: 19, fontSize: 12, marginBottom: 17 },
  label: { color: Theme.text, fontWeight: '700', marginBottom: 8 },
  styles: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  styleButton: { flex: 1, alignItems: 'center', borderWidth: 1, borderColor: Theme.border, borderRadius: 10, paddingVertical: 9, marginRight: 6 },
  activeStyle: { backgroundColor: '#729A87', borderColor: '#729A87' },
  styleText: { color: Theme.text, fontWeight: '700' },
  activeStyleText: { color: '#FFFFFF' },
  history: { marginTop: 5, marginBottom: 13, padding: 14, borderRadius: 23, backgroundColor: 'rgba(238,234,244,0.68)' },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10 },
  userRow: { justifyContent: 'flex-end' },
  miniAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#DDE8E5', alignItems: 'center', justifyContent: 'center', marginRight: 7, overflow: 'hidden' },
  message: { maxWidth: '83%', borderRadius: 19, paddingHorizontal: 14, paddingVertical: 11 },
  userMessage: { backgroundColor: '#F3DFD7', borderBottomRightRadius: 6 },
  botMessage: { backgroundColor: '#E3EFE6', borderBottomLeftRadius: 6 },
  messageText: { color: Theme.text, lineHeight: 20 },
  userMessageText: { color: '#634F49' },
  suggestionScroll: { flexGrow: 0, marginBottom: 12, marginHorizontal: -18 },
  suggestions: { paddingHorizontal: 18, paddingVertical: 2 },
  suggestion: { alignSelf: 'flex-start', backgroundColor: '#F2EAF4', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', borderRadius: 20, paddingHorizontal: 13, paddingVertical: 10, marginRight: 8, maxWidth: 230 },
  suggestionText: { color: Theme.primaryDark },
  input: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: '#E6DFD8', borderRadius: 19, padding: 14, minHeight: 70, textAlignVertical: 'top' },
});