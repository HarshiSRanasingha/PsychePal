import React from 'react';
import { TextInput as NativeTextInput, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import { useAppSettings } from '../context/AppSettingsContext';
import { adaptStyle } from '../styles/darkMode';
import { DarkPalette } from '../styles/theme';

export default function CozyInput({ style, ...props }) {
  const { darkMode } = useAppSettings();
  const flattenedStyle = StyleSheet.flatten(style) || {};
  const fontFamily = flattenedStyle.fontFamily
    || (Font.isLoaded('Nunito_400Regular') ? 'Nunito_400Regular' : undefined);

  return (
    <NativeTextInput
      {...props}
      placeholderTextColor={darkMode ? DarkPalette.muted : props.placeholderTextColor}
      style={[darkMode && { color: DarkPalette.text }, adaptStyle(style, darkMode), fontFamily ? { fontFamily } : null]}
    />
  );
}
