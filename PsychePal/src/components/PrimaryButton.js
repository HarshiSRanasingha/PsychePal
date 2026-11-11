import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { CozyText as Text } from './CozyText';
import { Theme } from '../styles/theme';
import { useAppSettings } from '../context/AppSettingsContext';
import { adaptStyle } from '../styles/darkMode';

export default function PrimaryButton({ title, onPress, secondary = false }) {
  const { darkMode } = useAppSettings();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [adaptStyle([styles.button, secondary && styles.secondary], darkMode), pressed && styles.pressed]}
    >
      <Text style={adaptStyle([styles.label, secondary && styles.secondaryLabel], darkMode)}>{title}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: { backgroundColor: Theme.primary, padding: 15, borderRadius: 18, marginVertical: 6, alignItems: 'center' },
  secondary: { backgroundColor: Theme.lavender },
  label: { color: '#FFFFFF', fontWeight: '700' },
  secondaryLabel: { color: Theme.primaryDark },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
});