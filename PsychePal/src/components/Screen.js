import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Theme } from '../styles/theme';

export default function Screen({ children }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {children}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Theme.background },
  content: { padding: 18, paddingBottom: 36 },
});