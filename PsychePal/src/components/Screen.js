import React, { cloneElement } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import PastelBackground from './PastelBackground';
import { useAppSettings } from '../context/AppSettingsContext';
import { adaptStyle } from '../styles/darkMode';

function adaptChildren(children, darkMode) {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    const props = {};
    if (child.props.style) props.style = adaptStyle(child.props.style, darkMode);
    if (child.props.children !== undefined) {
      props.children = adaptChildren(child.props.children, darkMode);
    }
    return cloneElement(child, props);
  });
}

export default function Screen({ children }) {
  const { darkMode } = useAppSettings();
  return (
    <PastelBackground>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        >
          {adaptChildren(children, darkMode)}
        </ScrollView>
      </KeyboardAvoidingView>
    </PastelBackground>
  );
}
const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  screen: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 18, paddingBottom: 36 },
});