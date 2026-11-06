import React from 'react';
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

export default function App() {
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