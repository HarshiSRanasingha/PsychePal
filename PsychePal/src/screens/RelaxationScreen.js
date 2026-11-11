import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, View } from 'react-native';
import Screen from '../components/Screen';
import CozyHero from '../components/CozyHero';
import SectionCard from '../components/SectionCard';
import { CozyText as Text } from '../components/CozyText';
import { Theme } from '../styles/theme';

const exercises = [
  ['4-7-8 Breathing', 'Breathe in for 4, hold for 7, and breathe out slowly for 8.', '478'],
  ['Box Breathing', 'Breathe in for 4, hold for 4, breathe out for 4, and pause for 4.', 'box'],
  ['5-4-3-2-1 Grounding', 'Notice 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste.', 'grounding'],
  ['Mindfulness Exercises', 'Sit comfortably, notice your breathing, and gently return attention when it wanders.', 'mindfulness'],
];

const breathingPatterns = {
  '478': [['Inhale', 4], ['Hold', 7], ['Exhale', 8]],
  box: [['Inhale', 4], ['Hold', 4], ['Exhale', 4], ['Rest', 4]],
};

export default function RelaxationScreen() {
  const [selected, setSelected] = useState(null);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseSeconds, setPhaseSeconds] = useState(4);
  const [guideRunning, setGuideRunning] = useState(false);
  const breathingPulse = useRef(new Animated.Value(1)).current;
  const selectedExercise = exercises.find(([, , id]) => id === selected);
  const breathingPattern = breathingPatterns[selected];

  useEffect(() => {
    if (!timerRunning) return undefined;
    const timer = setInterval(() => {
      setTimerSeconds(seconds => {
        if (seconds > 1) return seconds - 1;
        setTimerRunning(false);
        setTimerCompleted(true);
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerRunning]);

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
    setTimerRunning(false);
    setTimerCompleted(false);
    setTimerMinutes(minutes);
    setTimerSeconds(minutes * 60);
  }

  function toggleTimer() {
    if (timerSeconds === 0) {
      setTimerCompleted(false);
      setTimerSeconds(timerMinutes * 60);
      setTimerRunning(true);
      return;
    }
    setTimerCompleted(false);
    setTimerRunning(running => !running);
  }

  function selectExercise(id) {
    setSelected(selected === id ? null : id);
    setGuideRunning(false);
    setPhaseIndex(0);
    setPhaseSeconds(breathingPatterns[id]?.[0][1] || 0);
  }

  return (
    <Screen>
      <CozyHero
        eyebrow="A SOFTER MOMENT"
        title="Relaxation toolkit"
        description="Take a breath, settle in, and go at your own pace."
        art="☁️"
        colors={['#E6F0EA', '#E6EAF5']}
      />
      {exercises.map(([title, description, id]) => (
        <SectionCard key={id} title={title} description={selected === id ? description : 'Tap to view instructions.'} onPress={() => selectExercise(id)} />
      ))}
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
      <Text style={styles.timerHeading}>Relaxation Timer</Text>
      <View style={styles.minuteChoices}>
        {[1, 5, 10].map(minutes => (
          <Pressable key={minutes} accessibilityRole="button" accessibilityState={{ selected: timerMinutes === minutes }} style={[styles.minuteButton, timerMinutes === minutes && styles.minuteButtonActive]} onPress={() => setMinutes(minutes)}>
            <Text style={[styles.minuteText, timerMinutes === minutes && styles.minuteTextActive]}>{minutes} min</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.timeDisplay}>{Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}</Text>
      {timerCompleted ? <Text style={styles.timerComplete}>Relaxation timer complete. Take a moment to notice how you feel.</Text> : null}
      <Pressable accessibilityRole="button" style={styles.timerButton} onPress={toggleTimer}>
        <Text style={styles.timerButtonText}>{timerRunning ? 'Pause Timer' : timerSeconds === 0 ? 'Restart Timer' : 'Start Timer'}</Text>
      </Pressable>
      <Text style={styles.note}>These are general self-care exercises. Do not force your breathing; stop if uncomfortable.</Text>
    </Screen>
  );
}
const styles = StyleSheet.create({
  guide: { alignItems: 'center', backgroundColor: '#E8EDF3', borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)', borderRadius: 25, padding: 18, marginTop: 10, overflow: 'hidden' },
  breathingStage: { width: 184, height: 184, alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
  breathingOuter: { width: 148, height: 148, borderRadius: 74, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(191,216,198,0.58)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.84)' },
  breathingInner: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6E8D9', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)' },
  guidePhase: { color: Theme.primaryDark, fontSize: 20, fontWeight: '800' },
  guideCount: { color: Theme.muted, marginTop: 4, fontSize: 11 },
  steps: { backgroundColor: 'rgba(255,255,255,0.82)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', borderRadius: 21, padding: 16, marginTop: 10 },
  step: { color: Theme.text, lineHeight: 24 },
  timerHeading: { fontSize: 18, fontWeight: '800', color: Theme.text, marginTop: 24, marginBottom: 10 },
  minuteChoices: { flexDirection: 'row', gap: 8 },
  minuteButton: { flex: 1, borderWidth: 1, borderColor: Theme.border, borderRadius: 18, paddingVertical: 12, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)' },
  minuteButtonActive: { backgroundColor: Theme.primary, borderColor: Theme.primary },
  minuteText: { color: Theme.text, fontWeight: '700' },
  minuteTextActive: { color: '#FFFFFF' },
  timeDisplay: { textAlign: 'center', color: Theme.primaryDark, fontSize: 42, fontWeight: '800', marginVertical: 12 },
  timerButton: { backgroundColor: Theme.primary, borderRadius: 20, padding: 15, alignItems: 'center', marginVertical: 6 },
  timerButtonText: { color: '#FFFFFF', fontWeight: '700' },
  timerComplete: { color: Theme.success, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  note: { color: Theme.muted, lineHeight: 19, marginTop: 8, fontSize: 12 },
});