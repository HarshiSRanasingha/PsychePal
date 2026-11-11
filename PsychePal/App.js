import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito/800ExtraBold';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PrimaryButton from './src/components/PrimaryButton';
import CozyText from './src/components/CozyText';
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
const tabIcons = { Home: '⌂', Mood: '☼', Chat: '☁', Resources: '✿', Profile: '♡' };

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: Theme.surface },
        headerTintColor: Theme.primary,
        tabBarActiveTintColor: Theme.primary,
        tabBarInactiveTintColor: Theme.muted,
        tabBarStyle: { backgroundColor: Theme.surface, borderTopColor: Theme.border, height: 64, paddingTop: 7, paddingBottom: 8 },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', fontFamily: 'Nunito_700Bold' },
        headerTitleStyle: { fontWeight: '800', fontFamily: 'Nunito_800ExtraBold', color: Theme.text },
        tabBarIcon: ({ color, focused }) => (
          <Text style={{ color, fontSize: focused ? 20 : 19, lineHeight: 22 }}>{tabIcons[route.name]}</Text>
        ),
      })}
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
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fade]);

  return (
    <PastelBackground>
      <View style={styles.splash}>
        <Animated.View style={[styles.brand, { opacity: fade }]}>
          <View style={styles.logo}>
            <View style={styles.logoInner} />
          </View>
          <CozyText style={styles.appName}>PsychePal</CozyText>
          <CozyText style={styles.tagline}>A little space for your mind</CozyText>
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
          <CozyText style={styles.welcomeTitle}>Welcome to PsychePal</CozyText>
          <CozyText style={styles.welcomeDescription}>
            A private, offline-first space to check in with your mood, reflect on your thoughts, and find support for everyday well-being.
          </CozyText>
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
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (!fontsLoaded && !fontError) return undefined;
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
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (fontError) {
      Alert.alert('Could not load the display font', fontError.message || 'PsychePal will use your device font instead.');
    }
  }, [fontError]);

  async function completeWelcome() {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      Alert.alert('Could not save preference', error.message || 'The welcome screen may appear again next time.');
    }
    setShowWelcome(false);
  }

  if (showSplash || (!fontsLoaded && !fontError)) {
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
          headerStyle: { backgroundColor: Theme.background },
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