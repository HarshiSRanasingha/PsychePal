import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme } from '../styles/theme';
import { useAppSettings } from '../context/AppSettingsContext';
import { adaptStyle } from '../styles/darkMode';

export default function PastelBackground({ children }) {
  const { darkMode } = useAppSettings();
  return (
    <View style={adaptStyle(styles.container, darkMode)}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[adaptStyle([styles.blob, styles.lavender], darkMode), darkMode && styles.darkLavender]} />
        <View style={[adaptStyle([styles.blob, styles.peach], darkMode), darkMode && styles.darkPeach]} />
        <View style={[adaptStyle([styles.blob, styles.mint], darkMode), darkMode && styles.darkMint]} />
        <View style={[adaptStyle([styles.blob, styles.blue], darkMode), darkMode && styles.darkBlue]} />
        <View style={[adaptStyle([styles.blob, styles.pink], darkMode), darkMode && styles.darkPink]} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.background, overflow: 'hidden' },
  blob: { position: 'absolute', borderRadius: 999 },
  lavender: { width: 270, height: 270, top: -150, left: -100, backgroundColor: '#E9E1F2', opacity: 0.56 },
  peach: { width: 250, height: 250, top: 70, right: -155, backgroundColor: '#F6E5D8', opacity: 0.62 },
  mint: { width: 280, height: 280, top: 300, left: -175, backgroundColor: '#DDECE4', opacity: 0.58 },
  blue: { width: 300, height: 300, top: 520, right: -185, backgroundColor: '#DFEAF4', opacity: 0.55 },
  pink: { width: 230, height: 230, top: 800, left: 90, backgroundColor: '#F4E2E8', opacity: 0.55 },
  darkLavender: { backgroundColor: '#62335E', opacity: 0.42 },
  darkPeach: { backgroundColor: '#793756', opacity: 0.35 },
  darkMint: { backgroundColor: '#51304F', opacity: 0.45 },
  darkBlue: { backgroundColor: '#493052', opacity: 0.45 },
  darkPink: { backgroundColor: '#78385F', opacity: 0.38 },
});
