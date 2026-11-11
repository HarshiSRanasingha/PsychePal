import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { CozyText as Text } from './CozyText';
import { Theme } from '../styles/theme';

export default function PrimaryButton({ title, onPress, secondary = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, secondary && styles.secondary, pressed && styles.pressed]}
    >
      <Text style={[styles.label, secondary && styles.secondaryLabel]}>{title}</Text>
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