import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PrimaryButton from './src/components/PrimaryButton';
import PastelBackground from './src/components/PastelBackground';
import { Theme } from './src/styles/theme';
import HomeScreen from './src/screens/HomeScreen';
import MoodScreen from './src/screens/MoodScreen';
import ChatScreen from './src/screens/ChatScreen';
import ResourcesScreen from './src/screens/ResourcesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MoodHistoryScreen from './src/screens/MoodHistoryScreen';
import ReflectionScreen from './src/screens/ReflectionScreen';
import RelaxationScreen from './src/screens/RelaxationScreen';
import RecommendationsScreen from './src/screens/RecommendationsScreen';
import DiaryScreen from './src/screens/DiaryScreen';
import SupportScreen from './src/screens/SupportScreen';
import GamesScreen from './src/screens/GamesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ONBOARDING_KEY = 'onboardingComplete';

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Theme.surface },
        headerTintColor: Theme.primary,
        tabBarActiveTintColor: Theme.primary,
        tabBarInactiveTintColor: Theme.muted,
        tabBarStyle: { backgroundColor: Theme.surface, borderTopColor: Theme.border },
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Mood" component={MoodScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Resources" component={ResourcesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function SplashScreen() {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [fade]);

  return (
    <PastelBackground>
      <View style={styles.splash}>
        <Animated.View style={[styles.brand, { opacity: fade }]}>
          <View style={styles.logo}>
            <View style={styles.logoInner} />
          </View>
          <Text style={styles.appName}>PsychePal</Text>
          <Text style={styles.tagline}>A little space for your mind</Text>
        </Animated.View>
      </View>
    </PastelBackground>
  );
}

function WelcomeScreen({ onStart }) {
  return (
    <PastelBackground>
      <View style={styles.welcome}>
        <View style={styles.welcomeContent}>
          <View style={[styles.logo, styles.welcomeLogo]}>
            <View style={styles.logoInner} />
          </View>
          <Text style={styles.welcomeTitle}>Welcome to PsychePal</Text>
          <Text style={styles.welcomeDescription}>
            A private, offline-first space to check in with your mood, reflect on your thoughts, and find support for everyday well-being.
          </Text>
        </View>
        <View style={styles.startButton}>
          <PrimaryButton title="Get Started" onPress={onStart} />
        </View>
      </View>
    </PastelBackground>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (active) setShowWelcome(completed !== 'true');
      } catch (error) {
        if (active) {
          setShowWelcome(true);
          Alert.alert('Could not load preferences', error.message || 'You can still continue using PsychePal.');
        }
      } finally {
        if (active) setShowSplash(false);
      }
    }, 900);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  async function completeWelcome() {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      Alert.alert('Could not save preference', error.message || 'The welcome screen may appear again next time.');
    }
    setShowWelcome(false);
  }

  if (showSplash) {
    return (
      <>
        <StatusBar style="dark" />
        <SplashScreen />
      </>
    );
  }

  if (showWelcome) {
    return (
      <>
        <StatusBar style="dark" />
        <WelcomeScreen onStart={completeWelcome} />
      </>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Theme.surface },
          headerTintColor: Theme.primary,
          contentStyle: { backgroundColor: Theme.background },
        }}
      >
        <Stack.Screen name="PsychePal" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Mood History" component={MoodHistoryScreen} />
        <Stack.Screen name="Thought Reflection" component={ReflectionScreen} />
        <Stack.Screen name="Relaxation Toolkit" component={RelaxationScreen} />
        <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
        <Stack.Screen name="Personal Diary" component={DiaryScreen} />
        <Stack.Screen name="Support Directory" component={SupportScreen} />
        <Stack.Screen name="Relaxing Games" component={GamesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  brand: { alignItems: 'center' },
  logo: { width: 108, height: 108, borderRadius: 54, alignItems: 'center', justifyContent: 'center', backgroundColor: Theme.primary, marginBottom: 22 },
  logoInner: { width: 48, height: 48, borderRadius: 24, borderWidth: 5, borderColor: Theme.surface, transform: [{ rotate: '45deg' }] },
  appName: { color: Theme.primaryDark, fontSize: 32, fontWeight: '800' },
  tagline: { color: Theme.muted, fontSize: 16, marginTop: 8 },
  welcome: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  welcomeContent: { alignItems: 'center' },
  welcomeLogo: { marginBottom: 28 },
  welcomeTitle: { color: Theme.primaryDark, fontSize: 28, fontWeight: '800', textAlign: 'center' },
  welcomeDescription: { color: Theme.muted, fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: 14 },
  startButton: { marginTop: 36 },
});