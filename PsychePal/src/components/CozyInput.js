import React from 'react';
import { TextInput as NativeTextInput, StyleSheet } from 'react-native';
import * as Font from 'expo-font';

export default function CozyInput({ style, ...props }) {
  const flattenedStyle = StyleSheet.flatten(style) || {};
  const fontFamily = flattenedStyle.fontFamily
    || (Font.isLoaded('Nunito_400Regular') ? 'Nunito_400Regular' : undefined);

  return (
    <NativeTextInput
      {...props}
      style={[style, fontFamily ? { fontFamily } : null]}
    />
  );
}
