import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Theme } from '../styles/theme';

export default function SectionCard({ title, description, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: Theme.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Theme.border },
  title: { color: Theme.primaryDark, fontSize: 16, fontWeight: '700', marginBottom: 5 },
  description: { color: Theme.muted, lineHeight: 20 },
});