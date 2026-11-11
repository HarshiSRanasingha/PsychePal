import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CozyText from './CozyText';
import { SoftLandscape } from './CozyArt';
import { Theme } from '../styles/theme';

export default function CozyHero({ eyebrow, title, description, art, colors = ['#F7E5E8', '#E7EDF6'], landscape = false }) {
  return (
    <View style={styles.hero}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={styles.copy}>
        {eyebrow ? <CozyText style={styles.eyebrow}>{eyebrow}</CozyText> : null}
        <CozyText style={styles.title}>{title}</CozyText>
        {description ? <CozyText style={styles.description}>{description}</CozyText> : null}
      </View>
      {art ? <View accessibilityElementsHidden style={styles.art}><CozyText style={styles.artText}>{art}</CozyText></View> : null}
      {landscape ? <SoftLandscape style={styles.landscape} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { minHeight: 150, justifyContent: 'center', overflow: 'hidden', borderRadius: 25, padding: 19, marginBottom: 17, borderWidth: 1, borderColor: 'rgba(255,255,255,0.82)' },
  copy: { zIndex: 1, maxWidth: '83%' },
  eyebrow: { color: Theme.primary, fontSize: 9, fontWeight: '800', letterSpacing: 1.4, marginBottom: 8 },
  title: { color: Theme.text, fontSize: 23, lineHeight: 28, fontWeight: '800' },
  description: { color: Theme.muted, fontSize: 13, lineHeight: 19, marginTop: 6 },
  art: { width: 76, height: 76, position: 'absolute', right: 12, top: 16, alignItems: 'center', justifyContent: 'center', borderRadius: 38, backgroundColor: 'rgba(255,255,255,0.35)' },
  artText: { fontSize: 37 },
  landscape: { height: 95 },
});
