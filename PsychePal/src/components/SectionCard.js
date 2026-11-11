import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { CozyText as Text } from './CozyText';
import { Theme } from '../styles/theme';
import { useAppSettings } from '../context/AppSettingsContext';
import { adaptStyle } from '../styles/darkMode';

export default function SectionCard({ title, description, onPress }) {
  const { darkMode } = useAppSettings();
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={({ pressed }) => [adaptStyle(styles.card, darkMode), pressed && onPress && styles.pressed]}
    >
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: Theme.surface, borderRadius: 19, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', elevation: 1, shadowColor: '#788078', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } },
  pressed: { opacity: 0.82 },
  title: { color: Theme.primaryDark, fontSize: 16, fontWeight: '700', marginBottom: 5 },
  description: { color: Theme.muted, lineHeight: 20 },
});