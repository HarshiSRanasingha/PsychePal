import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Theme } from '../styles/theme';

export default function PrimaryButton({ title, onPress, secondary = false }) {
  return (
    <Pressable onPress={onPress} style={[styles.button, secondary && styles.secondary]}>
      <Text style={[styles.label, secondary && styles.secondaryLabel]}>{title}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: { backgroundColor: Theme.primary, padding: 14, borderRadius: 14, marginVertical: 6, alignItems: 'center' },
  secondary: { backgroundColor: Theme.lavender },
  label: { color: '#FFFFFF', fontWeight: '700' },
  secondaryLabel: { color: Theme.primaryDark },
});