import React from 'react';
import { Text as NativeText, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import { useAppSettings } from '../context/AppSettingsContext';
import { adaptStyle } from '../styles/darkMode';
import { DarkPalette } from '../styles/theme';

const fontByWeight = {
  '400': 'Nunito_400Regular',
  '500': 'Nunito_600SemiBold',
  '600': 'Nunito_600SemiBold',
  '700': 'Nunito_700Bold',
  '800': 'Nunito_800ExtraBold',
  '900': 'Nunito_800ExtraBold',
};

export function CozyText({ style, ...props }) {
  const { darkMode } = useAppSettings();
  const flattenedStyle = StyleSheet.flatten(style) || {};
  const requestedFont = fontByWeight[String(flattenedStyle.fontWeight || '400')];
  const fontFamily = flattenedStyle.fontFamily
    || (requestedFont && Font.isLoaded(requestedFont) ? requestedFont : undefined);

  return (
    <NativeText
      {...props}
      style={[darkMode && !flattenedStyle.color ? { color: DarkPalette.text } : null, adaptStyle(style, darkMode), fontFamily ? { fontFamily } : null]}
    />
  );
}

export default CozyText;
