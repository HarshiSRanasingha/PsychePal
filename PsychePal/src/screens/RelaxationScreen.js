import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Screen from '../components/Screen';
import CozyHero from '../components/CozyHero';
import { CozyText as Text } from '../components/CozyText';
import { Theme } from '../styles/theme';

const exercises = require('../data/relaxationExercises');

const breathingPatterns = {
  '478': [['Inhale', 4], ['Hold', 7], ['Exhale', 8]],
  box: [['Inhale', 4], ['Hold', 4], ['Exhale', 4], ['Rest', 4]],
};

export default function RelaxationScreen() {
  const { width, fontScale } = useWindowDimensions();
  const singleColumn = width < 360 || (width < 600 && fontScale > 1.4);
  const exerciseWidth = singleColumn ? '100%' : '47%';
  const [selected, setSelected] = useState(null);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseSeconds, setPhaseSeconds] = useState(4);
  const [guideRunning, setGuideRunning] = useState(false);
  const breathingPulse = useRef(new Animated.Value(1)).current;
  const timerPulse = useRef(new Animated.Value(1)).current;
  const timerDeadline = useRef(null);
  const selectedExercise = exercises.find(([, , id]) => id === selected);
  const breathingPattern = breathingPatterns[selected];

  useEffect(() => {
    if (!timerRunning) return undefined;
    const updateTimer = () => {
      const seconds = Math.max(0, Math.ceil((timerDeadline.current - Date.now()) / 1000));
      setTimerSeconds(seconds);
      if (seconds === 0) {
        setTimerRunning(false);
        setTimerCompleted(true);
        timerDeadline.current = null;
      }
    };
    const timer = setInterval(updateTimer, 250);
    return () => clearInterval(timer);
  }, [timerRunning]);

  useEffect(() => {
    if (!timerRunning) return undefined;
    const pulse = Animated.loop(Animated.sequence([
      Animated.timing(timerPulse, { toValue: 1.04, duration: 2500, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(timerPulse, { toValue: 1, duration: 2500, useNativeDriver: Platform.OS !== 'web' }),
    ]));
    pulse.start();
    return () => { pulse.stop(); timerPulse.setValue(1); };
  }, [timerRunning, timerPulse]);

  useEffect(() => {
    if (!guideRunning || !breathingPattern) return undefined;
    const timer = setInterval(() => {
      setPhaseSeconds(seconds => {
        if (seconds > 1) return seconds - 1;
        setPhaseIndex(index => {
          const next = (index + 1) % breathingPattern.length;
          return next;
        });
        return breathingPattern[(phaseIndex + 1) % breathingPattern.length][1];
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [guideRunning, breathingPattern, phaseIndex]);

  useEffect(() => {
    if (!guideRunning || !breathingPattern) return undefined;
    const pulse = Animated.loop(Animated.sequence(breathingPattern.map(([phase, seconds]) => {
      if (phase === 'Inhale') {
        return Animated.timing(breathingPulse, { toValue: 1.22, duration: seconds * 1000, useNativeDriver: Platform.OS !== 'web' });
      }
      if (phase === 'Exhale') {
        return Animated.timing(breathingPulse, { toValue: 0.88, duration: seconds * 1000, useNativeDriver: Platform.OS !== 'web' });
      }
      if (phase === 'Rest') {
        return Animated.timing(breathingPulse, { toValue: 1, duration: seconds * 1000, useNativeDriver: Platform.OS !== 'web' });
      }
      return Animated.delay(seconds * 1000);
    })));
    pulse.start();
    return () => pulse.stop();
  }, [guideRunning, breathingPattern, breathingPulse]);

  function startBreathingGuide() {
    if (!breathingPattern) return;
    setPhaseIndex(0);
    setPhaseSeconds(breathingPattern[0][1]);
    setGuideRunning(true);
  }

  function setMinutes(minutes) {
    timerDeadline.current = null;
    setTimerRunning(false);
    setTimerCompleted(false);
    setTimerMinutes(minutes);
    setTimerSeconds(minutes * 60);
  }

  function toggleTimer() {
    if (timerRunning) {
      setTimerSeconds(Math.max(0, Math.ceil((timerDeadline.current - Date.now()) / 1000)));
      timerDeadline.current = null;
      setTimerRunning(false);
      return;
    }
    const seconds = timerSeconds === 0 ? timerMinutes * 60 : timerSeconds;
    setTimerSeconds(seconds);
    timerDeadline.current = Date.now() + seconds * 1000;
    setTimerCompleted(false);
    setTimerRunning(true);
  }

  function resetTimer() {
    setMinutes(timerMinutes);
  }

  function selectExercise(id) {
    setSelected(selected === id ? null : id);
    setGuideRunning(false);
    setPhaseIndex(0);
    setPhaseSeconds(breathingPatterns[id]?.[0][1] || 0);
  }

  return (
    <Screen>
      <View style={styles.content}>
        <CozyHero
          eyebrow="A SOFTER MOMENT"
          title="Find Your Moment of Calm"
          description="Slow down, breathe deeply, and reconnect with yourself."
          art="🧘"
          colors={['#EEE9F8', '#E1EFE5']}
        />
        <Text style={styles.sectionHeading}>Choose an exercise</Text>
        <View style={styles.exerciseGrid}>
          {exercises.map(([title, description, id, icon, backgroundColor]) => (
            <Pressable key={id} accessibilityRole="button" accessibilityState={{ expanded: selected === id }} onPress={() => selectExercise(id)} style={({ pressed, hovered }) => [styles.exerciseCard, { width: exerciseWidth, backgroundColor }, selected === id && styles.selectedExercise, (pressed || hovered) && styles.cardActive]}>
              <Text style={styles.exerciseIcon}>{icon}</Text>
              <Text style={styles.exerciseTitle}>{title}</Text>
              <Text style={styles.exerciseDescription}>{description}</Text>
              <Text style={styles.exerciseLink}>{selected === id ? 'Close exercise ↑' : 'Explore exercise →'}</Text>
            </Pressable>
          ))}
        </View>
        {selectedExercise ? <View style={styles.instructions}><Text style={styles.instructionTitle}>{selectedExercise[0]}</Text><Text style={styles.instructionDescription}>{selectedExercise[1]}</Text></View> : null}
        {breathingPattern && selectedExercise ? (
          <View style={styles.guide}>
            <View style={styles.breathingStage}>
              <Animated.View style={[styles.breathingOuter, { transform: [{ scale: breathingPulse }] }]}>
                <View style={styles.breathingInner}>
                  <Text style={styles.guidePhase}>{guideRunning ? breathingPattern[phaseIndex][0] : 'Breathe'}</Text>
                  <Text style={styles.guideCount}>{guideRunning ? phaseSeconds : 'at your own pace'}</Text>
                </View>
              </Animated.View>
            </View>
            <Pressable accessibilityRole="button" style={styles.timerButton} onPress={guideRunning ? () => setGuideRunning(false) : startBreathingGuide}>
              <Text style={styles.timerButtonText}>{guideRunning ? 'Pause Guide' : 'Start Breathing Guide'}</Text>
            </Pressable>
          </View>
        ) : null}
        {selected === 'grounding' ? (
          <View style={styles.steps}>
            <Text style={styles.step}>5 things you can see</Text>
            <Text style={styles.step}>4 things you can feel</Text>
            <Text style={styles.step}>3 things you can hear</Text>
            <Text style={styles.step}>2 things you can smell</Text>
            <Text style={styles.step}>1 thing you can taste</Text>
          </View>
        ) : null}
        {selected === 'mindfulness' ? (
          <View style={styles.steps}>
            <Text style={styles.step}>Sit comfortably and soften your gaze.</Text>
            <Text style={styles.step}>Notice the natural rise and fall of your breath.</Text>
            <Text style={styles.step}>When thoughts appear, label them and gently return to breathing.</Text>
          </View>
        ) : null}
        <View style={styles.timerCard}>
          <Text style={styles.timerHeading}>Relaxation Timer</Text>
          <Text style={styles.timerSubtitle}>Set aside a quiet moment just for you.</Text>
          <View style={styles.minuteChoices}>
            {[1, 5, 10].map(minutes => (
              <Pressable key={minutes} accessibilityRole="button" accessibilityState={{ selected: timerMinutes === minutes }} style={[styles.minuteButton, timerMinutes === minutes && styles.minuteButtonActive]} onPress={() => setMinutes(minutes)}>
                <Text style={[styles.minuteText, timerMinutes === minutes && styles.minuteTextActive]}>{minutes} min</Text>
              </Pressable>
            ))}
          </View>
          <Animated.View style={[styles.timerCircle, { transform: [{ scale: timerPulse }] }]}>
            {Array.from({ length: 60 }, (_, index) => {
              const angle = (index / 60) * Math.PI * 2 - Math.PI / 2;
              const remaining = index < (timerSeconds / (timerMinutes * 60)) * 60;
              return <View key={index} style={[styles.progressDot, remaining && styles.progressDotActive, { left: 98 + 91 * Math.cos(angle), top: 98 + 91 * Math.sin(angle) }]} />;
            })}
            <Text style={styles.timeDisplay}>{Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}</Text>
            <Text style={styles.timerCaption}>{timerRunning ? 'Breathe and unwind' : 'Your time to unwind'}</Text>
          </Animated.View>
          {timerCompleted ? <Text style={styles.timerComplete}>Relaxation timer complete. Take a moment to notice how you feel.</Text> : null}
          <View style={styles.timerActions}>
            <Pressable accessibilityRole="button" style={[styles.timerButton, styles.timerAction]} onPress={toggleTimer}>
              <Text style={styles.timerButtonText}>{timerRunning ? 'Pause Timer' : timerSeconds === 0 ? 'Restart Timer' : timerSeconds < timerMinutes * 60 ? 'Resume Timer' : 'Start Timer'}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={[styles.resetButton, styles.timerAction]} onPress={resetTimer}>
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
          </View>
        </View>
        <Text style={styles.note}>These are general self-care exercises. Do not force your breathing; stop if uncomfortable.</Text>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  content: { width: '100%', maxWidth: 900, alignSelf: 'center' },
  sectionHeading: { color: Theme.text, fontSize: 19, fontWeight: '800', marginBottom: 14 },
  exerciseGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  exerciseCard: { minHeight: 190, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', padding: 18 },
  selectedExercise: { borderColor: Theme.primary, borderWidth: 2 },
  cardActive: { opacity: 0.88, transform: [{ scale: 0.99 }] },
  exerciseIcon: { color: Theme.primaryDark, fontSize: 32, lineHeight: 40, marginBottom: 8 },
  exerciseTitle: { color: Theme.text, fontSize: 16, fontWeight: '800', lineHeight: 22 },
  exerciseDescription: { color: Theme.muted, fontSize: 13, lineHeight: 19, marginTop: 6 },
  exerciseLink: { color: Theme.primaryDark, fontSize: 12, fontWeight: '800', marginTop: 14 },
  instructions: { backgroundColor: '#FFFEFA', borderColor: Theme.border, borderWidth: 1, borderRadius: 20, padding: 18, marginTop: 16 },
  instructionTitle: { color: Theme.text, fontSize: 17, fontWeight: '800' },
  instructionDescription: { color: Theme.muted, lineHeight: 21, marginTop: 6 },
  guide: { alignItems: 'center', backgroundColor: '#E8EDF3', borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)', borderRadius: 25, padding: 18, marginTop: 10, overflow: 'hidden' },
  breathingStage: { width: 184, height: 184, alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
  breathingOuter: { width: 148, height: 148, borderRadius: 74, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(191,216,198,0.58)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.84)' },
  breathingInner: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6E8D9', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)' },
  guidePhase: { color: Theme.primaryDark, fontSize: 20, fontWeight: '800' },
  guideCount: { color: Theme.muted, marginTop: 4, fontSize: 11 },
  steps: { backgroundColor: 'rgba(255,255,255,0.82)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', borderRadius: 21, padding: 16, marginTop: 10 },
  step: { color: Theme.text, lineHeight: 24 },
  timerCard: { backgroundColor: '#F1F6F1', borderWidth: 1, borderColor: '#DDEBE0', borderRadius: 25, padding: 20, marginTop: 24, alignItems: 'center' },
  timerHeading: { fontSize: 20, fontWeight: '800', color: Theme.text, textAlign: 'center' },
  timerSubtitle: { color: Theme.muted, lineHeight: 20, textAlign: 'center', marginTop: 4, marginBottom: 16 },
  minuteChoices: { flexDirection: 'row', gap: 8, width: '100%', maxWidth: 400 },
  minuteButton: { flex: 1, borderWidth: 1, borderColor: Theme.border, borderRadius: 18, paddingVertical: 12, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)' },
  minuteButtonActive: { backgroundColor: Theme.primaryDark, borderColor: Theme.primaryDark },
  minuteText: { color: Theme.text, fontWeight: '700' },
  minuteTextActive: { color: '#FFFFFF' },
  timerCircle: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#FFFEFA', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  progressDot: { position: 'absolute', width: 5, height: 5, borderRadius: 3, backgroundColor: '#DCE7DE' },
  progressDotActive: { backgroundColor: '#6E927D' },
  timeDisplay: { textAlign: 'center', color: Theme.primaryDark, fontSize: 42, fontWeight: '800' },
  timerCaption: { color: Theme.muted, fontSize: 12, marginTop: 4 },
  timerButton: { backgroundColor: Theme.primaryDark, borderRadius: 20, padding: 15, alignItems: 'center', marginVertical: 6 },
  timerButtonText: { color: '#FFFFFF', fontWeight: '700' },
  timerActions: { flexDirection: 'row', gap: 10, width: '100%', maxWidth: 400 },
  timerAction: { flex: 1 },
  resetButton: { backgroundColor: '#E1EBE3', borderRadius: 20, padding: 15, alignItems: 'center', marginVertical: 6 },
  resetText: { color: Theme.primaryDark, fontWeight: '700' },
  timerComplete: { color: Theme.success, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  note: { color: Theme.muted, lineHeight: 19, marginTop: 8, fontSize: 12 },
});