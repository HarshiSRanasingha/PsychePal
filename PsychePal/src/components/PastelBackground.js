import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme } from '../styles/theme';

export default function PastelBackground({ children }) {
  return (
    <View style={styles.container}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[styles.blob, styles.lavender]} />
        <View style={[styles.blob, styles.peach]} />
        <View style={[styles.blob, styles.mint]} />
        <View style={[styles.blob, styles.blue]} />
        <View style={[styles.blob, styles.pink]} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.background, overflow: 'hidden' },
  blob: { position: 'absolute', borderRadius: 999 },
  lavender: { width: 270, height: 270, top: -150, left: -100, backgroundColor: '#E9E1F2' },
  peach: { width: 250, height: 250, top: 70, right: -155, backgroundColor: '#F6E5D8' },
  mint: { width: 280, height: 280, top: 300, left: -175, backgroundColor: '#DDECE4' },
  blue: { width: 300, height: 300, top: 520, right: -185, backgroundColor: '#DFEAF4' },
  pink: { width: 230, height: 230, top: 800, left: 90, backgroundColor: '#F4E2E8' },
});
