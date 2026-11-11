import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../styles/theme';
import { useAppSettings } from '../context/AppSettingsContext';
import { adaptStyle } from '../styles/darkMode';

const resourceArt = {
  'Emotional Awareness': ['🌷', '#F6E5EA'],
  'Stress Management': ['🍃', '#E3EFE5'],
  'Personal Growth': ['🌱', '#E6EFE1'],
  'Well-being': ['☀️', '#F8EDD4'],
  'Self-care': ['🌙', '#EAE5F2'],
  'Psychology Articles': ['☁️', '#E4EDF3'],
  'Mental Wellness Tips': ['🪴', '#E4EFE7'],
  'Anxiety Awareness': ['🦋', '#EAE6F4'],
  'Emotional Intelligence': ['💛', '#F7EBD9'],
};

export function CloudPal({ size = 72 }) {
  return (
    <View
      accessibilityLabel="PsychePal, a friendly smiling cloud"
      style={[styles.cloud, { width: size, height: size * 0.76 }]}
    >
      <View style={[styles.cloudPuff, styles.puffLeft, { width: size * 0.5, height: size * 0.5, borderRadius: size * 0.25 }]} />
      <View style={[styles.cloudPuff, styles.puffCenter, { width: size * 0.64, height: size * 0.64, borderRadius: size * 0.32 }]} />
      <View style={[styles.cloudPuff, styles.puffRight, { width: size * 0.48, height: size * 0.48, borderRadius: size * 0.24 }]} />
      <View style={[styles.cloudBase, { width: size * 0.78, height: size * 0.38, borderRadius: size * 0.2 }]} />
      <View style={[styles.eye, styles.eyeLeft, { left: size * 0.35, top: size * 0.4 }]} />
      <View style={[styles.eye, styles.eyeRight, { left: size * 0.59, top: size * 0.4 }]} />
      <View style={[styles.smile, { left: size * 0.45, top: size * 0.51 }]} />
    </View>
  );
}

export function SoftLandscape({ style }) {
  return (
    <View accessibilityElementsHidden style={[styles.landscape, style]}>
      <View style={styles.sun} />
      <View style={[styles.cloudPuff, styles.skyCloudOne]} />
      <View style={[styles.cloudPuff, styles.skyCloudTwo]} />
      <View style={styles.hillBack} />
      <View style={styles.hillFront} />
      <View style={styles.treeTrunk} />
      <View style={styles.treeTop} />
      <View style={styles.flower} />
    </View>
  );
}

export function MoodFace({ mood, color, size = 48 }) {
  const { darkMode } = useAppSettings();
  const worried = mood === 'Anxious' || mood === 'Distressed';
  const downturned = mood === 'Sad' || mood === 'Angry';
  const sleepy = mood === 'Tired';
  const smiling = mood === 'Happy' || mood === 'Calm';
  return (
    <View style={[adaptStyle(styles.moodFace, darkMode), { width: size, height: size, borderRadius: size / 2, ...adaptStyle({ backgroundColor: color }, darkMode) }]}>
      <View style={styles.faceHighlight} />
      <View style={styles.faceEyes}>
        <View style={[styles.faceEye, sleepy && styles.sleepyEye]} />
        <View style={[styles.faceEye, sleepy && styles.sleepyEye]} />
      </View>
      <View style={styles.faceCheeks}>
        <View style={styles.faceCheek} />
        <View style={styles.faceCheek} />
      </View>
      <View style={[
        styles.faceMouth,
        smiling && styles.smileMouth,
        downturned && styles.sadMouth,
        worried && styles.worriedMouth,
        sleepy && styles.sleepyMouth,
        mood === 'Neutral' && styles.neutralMouth,
      ]} />
    </View>
  );
}

export function ResourceArtwork({ category }) {
  const { darkMode } = useAppSettings();
  const [emoji, backgroundColor] = resourceArt[category] || ['✦', Theme.lavender];
  return (
    <View style={[adaptStyle(styles.resourceArt, darkMode), adaptStyle({ backgroundColor }, darkMode)]}>
      <View style={styles.artOrb} />
      <Text style={styles.resourceEmoji}>{emoji}</Text>
      <View style={styles.artSparkle} />
    </View>
  );
}

const styles = StyleSheet.create({
  cloud: { alignItems: 'center', justifyContent: 'center' },
  cloudPuff: { position: 'absolute', backgroundColor: '#FFFDF9' },
  puffLeft: { left: '12%', bottom: '14%' },
  puffCenter: { left: '24%', top: 0 },
  puffRight: { right: '10%', bottom: '17%' },
  cloudBase: { position: 'absolute', bottom: '7%', left: '11%', backgroundColor: '#FFFDF9' },
  eye: { width: 4, height: 5, position: 'absolute', borderRadius: 3, backgroundColor: '#52626A' },
  eyeLeft: {},
  eyeRight: {},
  smile: { width: 8, height: 4, borderBottomWidth: 1.5, borderColor: '#C77F7A', borderRadius: 8 },
  landscape: { overflow: 'hidden', position: 'absolute', left: 0, right: 0, bottom: 0, height: 108 },
  sun: { width: 52, height: 52, borderRadius: 26, position: 'absolute', top: 7, right: 35, backgroundColor: '#F6D99A' },
  skyCloudOne: { width: 34, height: 12, borderRadius: 9, top: 30, left: 38 },
  skyCloudTwo: { width: 22, height: 9, borderRadius: 7, top: 17, right: 105 },
  hillBack: { width: '88%', height: 88, borderRadius: 70, position: 'absolute', bottom: -48, left: '-12%', backgroundColor: '#BFD9C4' },
  hillFront: { width: '94%', height: 91, borderRadius: 80, position: 'absolute', bottom: -57, right: '-21%', backgroundColor: '#A8C9B3' },
  treeTrunk: { width: 5, height: 22, position: 'absolute', bottom: 16, left: '72%', backgroundColor: '#B38C71', borderRadius: 3 },
  treeTop: { width: 23, height: 25, position: 'absolute', bottom: 33, left: '68%', backgroundColor: '#8EB19A', borderRadius: 15 },
  flower: { width: 8, height: 8, position: 'absolute', bottom: 23, left: '29%', borderRadius: 4, backgroundColor: '#F3D28D' },
  moodFace: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)' },
  faceHighlight: { width: '48%', height: '22%', position: 'absolute', left: '12%', top: '9%', borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.44)', transform: [{ rotate: '-32deg' }] },
  faceEyes: { width: '38%', position: 'absolute', top: '39%', left: '31%', flexDirection: 'row', justifyContent: 'space-between' },
  faceEye: { width: 3, height: 5, borderRadius: 3, backgroundColor: '#52626A' },
  sleepyEye: { height: 2, width: 6, marginTop: 2 },
  faceCheeks: { width: '63%', position: 'absolute', top: '56%', left: '18.5%', flexDirection: 'row', justifyContent: 'space-between' },
  faceCheek: { width: 7, height: 4, borderRadius: 5, backgroundColor: '#D9938D', opacity: 0.48 },
  faceMouth: { width: 6, height: 4, position: 'absolute', top: '57%', left: '44%', borderRadius: 5, borderBottomWidth: 1.5, borderColor: '#A96867' },
  smileMouth: { height: 6, top: '54%', borderBottomWidth: 2 },
  sadMouth: { top: '64%', transform: [{ rotate: '180deg' }] },
  worriedMouth: { width: 5, height: 6, top: '58%', borderWidth: 1.4, borderBottomWidth: 1.4, borderColor: '#A96867', borderRadius: 5 },
  sleepyMouth: { width: 5, height: 3, top: '58%', borderBottomWidth: 0, backgroundColor: '#A96867' },
  neutralMouth: { height: 0, top: '60%', borderBottomWidth: 1 },
  resourceArt: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  artOrb: { width: 39, height: 39, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.5)', position: 'absolute', right: -5, top: -9 },
  resourceEmoji: { fontSize: 28 },
  artSparkle: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#FFFDF7', position: 'absolute', left: 9, top: 13 },
});
