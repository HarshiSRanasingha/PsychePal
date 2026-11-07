import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
    <View style={styles.splash}>
      <Animated.View style={[styles.brand, { opacity: fade }]}>
        <View style={styles.logo}>
          <View style={styles.logoInner} />
        </View>
        <Text style={styles.appName}>PsychePal</Text>
        <Text style={styles.tagline}>A little space for your mind</Text>
      </Animated.View>
    </View>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <>
        <StatusBar style="dark" />
        <SplashScreen />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Theme.background },
  brand: { alignItems: 'center' },
  logo: { width: 108, height: 108, borderRadius: 54, alignItems: 'center', justifyContent: 'center', backgroundColor: Theme.primary, marginBottom: 22 },
  logoInner: { width: 48, height: 48, borderRadius: 24, borderWidth: 5, borderColor: Theme.surface, transform: [{ rotate: '45deg' }] },
  appName: { color: Theme.primaryDark, fontSize: 32, fontWeight: '800' },
  tagline: { color: Theme.muted, fontSize: 16, marginTop: 8 },
});