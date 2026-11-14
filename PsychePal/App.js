import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito/800ExtraBold';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PrimaryButton from './src/components/PrimaryButton';
import CozyText from './src/components/CozyText';
import { CloudPal } from './src/components/CozyArt';
import AppSettingsContext from './src/context/AppSettingsContext';
import { translate } from './src/i18n/translations';
import { LoginScreen, RegisterScreen } from './src/screens/AuthScreens';
import { finishPendingLegacyCleanup, listLocalAccounts } from './src/data/localAccounts';
import { getDatabase, setActiveAccountId } from './src/data/localStore';
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
import CounsellingScreen from './src/screens/CounsellingScreen';
import GamesScreen from './src/screens/GamesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ONBOARDING_KEY = 'onboardingComplete';
const APP_SETTINGS_KEY = 'appSettings';
const DEFAULT_APP_SETTINGS = { language: 'en', darkMode: false, emergencyMode: false };
const tabIcons = { Home: '⌂', Mood: '☼', Chat: '☁', Resources: '✿', Profile: '♡', Settings: '⚙' };

function parseAppSettings(value) {
  const parsed = JSON.parse(value);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Saved app settings have an unexpected format.');
  }
  return {
    language: ['en', 'si', 'ta'].includes(parsed.language) ? parsed.language : 'en',
    darkMode: parsed.darkMode === true,
    emergencyMode: parsed.emergencyMode === true,
  };
}

function getPalette(darkMode) {
  return darkMode
    ? {
      primary: '#9FC8AA',
      primaryDark: '#C3D9CA',
      background: '#151D19',
      surface: '#202A24',
      text: '#E5ECE7',
      muted: '#AEBBB2',
      border: '#3A4941',
    }
    : Theme;
}

function Tabs() {
  const { darkMode, language } = React.useContext(AppSettingsContext);
  const palette = getPalette(darkMode);
  const t = text => translate(text, language);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: palette.surface },
        headerTintColor: palette.primary,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.muted,
        tabBarStyle: { backgroundColor: palette.surface, borderTopColor: palette.border, height: 64, paddingTop: 7, paddingBottom: 8 },
        tabBarLabelStyle: { fontSize: 9, fontWeight: '700', fontFamily: 'Nunito_700Bold' },
        tabBarLabel: t(route.name),
        headerTitle: t(route.name),
        headerTitleStyle: { fontWeight: '800', fontFamily: 'Nunito_800ExtraBold', color: palette.text },
        tabBarIcon: ({ color, focused }) => (
          <Text
            style={{
              color,
              fontSize: focused ? 22 : 21,
              lineHeight: 24,
              transform: [{ translateY: -2 }],
            }}
          >
            {tabIcons[route.name]}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Mood" component={MoodScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Resources" component={ResourcesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: t('Settings') }} />
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
            <CloudPal size={72} />
            <View style={styles.logoSparkle} />
            <View style={styles.logoDot} />
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
            <CloudPal size={72} />
            <View style={styles.logoSparkle} />
            <View style={styles.logoDot} />
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
  const [appSettings, setAppSettings] = useState(DEFAULT_APP_SETTINGS);
  const [account, setAccount] = useState(null);
  const [hasAccounts, setHasAccounts] = useState(false);
  const [databaseError, setDatabaseError] = useState('');
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
        await getDatabase();
        await finishPendingLegacyCleanup();
        const accounts = await listLocalAccounts();
        if (active) setHasAccounts(accounts.length > 0);
      } catch (error) {
        if (active) setDatabaseError(error.message || 'Could not open the local database.');
      }

      try {
        const savedSettings = await AsyncStorage.getItem(APP_SETTINGS_KEY);
        if (savedSettings && active) setAppSettings(parseAppSettings(savedSettings));
      } catch (error) {
        if (active) {
          Alert.alert('Could not load app settings', error.message || 'PsychePal will use its default settings.');
        }
      }

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

  async function updateAppSetting(key, value) {
    const updated = { ...appSettings, [key]: value };
    try {
      await AsyncStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(updated));
      setAppSettings(updated);
    } catch (error) {
      Alert.alert('Could not save setting', error.message || 'Please try again.');
    }
  }

  function activateAccount(activeAccount, migrationWarning) {
    setActiveAccountId(activeAccount.id);
    setAccount(activeAccount);
    setHasAccounts(true);
    if (migrationWarning) {
      Alert.alert('Profile created', migrationWarning);
    }
  }

  function logout() {
    setActiveAccountId(null);
    setAccount(null);
  }

  async function retryDatabase() {
    setDatabaseError('');
    try {
      await getDatabase();
      await finishPendingLegacyCleanup();
      const accounts = await listLocalAccounts();
      setHasAccounts(accounts.length > 0);
    } catch (error) {
      setDatabaseError(error.message || 'Could not open the local database.');
    }
  }

  const settingsContext = {
    ...appSettings,
    account,
    logout,
    setLanguage: value => updateAppSetting('language', value),
    setDarkMode: value => updateAppSetting('darkMode', value),
    setEmergencyMode: value => updateAppSetting('emergencyMode', value),
  };
  const palette = getPalette(appSettings.darkMode);
  const appTranslation = text => translate(text, appSettings.language);
  const navigationTheme = appSettings.darkMode
    ? {
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        primary: palette.primary,
        background: palette.background,
        card: palette.surface,
        text: palette.text,
        border: palette.border,
      },
    }
    : DefaultTheme;

  if (showSplash || (!fontsLoaded && !fontError)) {
    return (
      <AppSettingsContext.Provider value={settingsContext}>
        <StatusBar style={appSettings.darkMode ? 'light' : 'dark'} />
        <SplashScreen />
      </AppSettingsContext.Provider>
    );
  }

  if (databaseError) {
    return (
      <AppSettingsContext.Provider value={settingsContext}>
        <StatusBar style={appSettings.darkMode ? 'light' : 'dark'} />
        <DatabaseErrorScreen message={databaseError} onRetry={retryDatabase} />
      </AppSettingsContext.Provider>
    );
  }

  if (showWelcome) {
    return (
      <AppSettingsContext.Provider value={settingsContext}>
        <StatusBar style={appSettings.darkMode ? 'light' : 'dark'} />
        <WelcomeScreen onStart={completeWelcome} />
      </AppSettingsContext.Provider>
    );
  }

  return (
    <AppSettingsContext.Provider value={settingsContext}>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style={appSettings.darkMode ? 'light' : 'dark'} />
        <Stack.Navigator
          key={`${account ? `account-${account.id}` : hasAccounts ? 'login' : 'register'}-${appSettings.emergencyMode ? 'emergency' : 'main'}`}
          initialRouteName={account ? undefined : hasAccounts ? 'Login' : 'Register'}
          screenOptions={{
            headerStyle: { backgroundColor: palette.background },
            headerTintColor: palette.primary,
            contentStyle: { backgroundColor: palette.background },
            headerTitleStyle: { color: palette.text, fontFamily: 'Nunito_800ExtraBold', fontWeight: '800' },
          }}
        >
          {!account ? (
            <>
              <Stack.Screen name="Login" options={{ headerShown: false }}>
                {props => <LoginScreen {...props} onAuthenticated={activeAccount => activateAccount(activeAccount)} />}
              </Stack.Screen>
              <Stack.Screen name="Register" options={{ headerShown: false }}>
                {props => <RegisterScreen {...props} onAuthenticated={activateAccount} />}
              </Stack.Screen>
            </>
          ) : appSettings.emergencyMode ? (
            <>
              <Stack.Screen
                name="Emergency Support"
                component={EmergencyScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Support Directory"
                component={SupportScreen}
                options={{ title: appTranslation('Support Directory') }}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="PsychePal" component={Tabs} options={{ headerShown: false }} />
              <Stack.Screen name="Mood History" component={MoodHistoryScreen} />
              <Stack.Screen name="Thought Reflection" component={ReflectionScreen} />
              <Stack.Screen name="Relaxation Toolkit" component={RelaxationScreen} />
              <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
              <Stack.Screen name="Personal Diary" component={DiaryScreen} />
              <Stack.Screen name="Support Directory" component={SupportScreen} />
              <Stack.Screen name="Counselling" component={CounsellingScreen} />
              <Stack.Screen name="Relaxing Games" component={GamesScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AppSettingsContext.Provider>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  databaseError: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  brand: { alignItems: 'center' },
  logo: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.primary,
    borderWidth: 5,
    borderColor: '#E5EFE7',
    marginBottom: 22,
    shadowColor: Theme.primaryDark,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  logoSparkle: {
    position: 'absolute',
    top: 20,
    right: 23,
    width: 9,
    height: 9,
    borderRadius: 2,
    backgroundColor: '#F4D691',
    transform: [{ rotate: '45deg' }],
  },
  logoDot: {
    position: 'absolute',
    left: 21,
    bottom: 25,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#BFD9C4',
  },
  appName: { color: Theme.primaryDark, fontSize: 32, fontWeight: '800' },
  tagline: { color: Theme.muted, fontSize: 16, marginTop: 8 },
  welcome: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  welcomeContent: { alignItems: 'center' },
  welcomeLogo: { marginBottom: 28 },
  welcomeTitle: { color: Theme.primaryDark, fontSize: 28, fontWeight: '800', textAlign: 'center' },
  welcomeDescription: { color: Theme.muted, fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: 14 },
  startButton: { marginTop: 36 },
});

function DatabaseErrorScreen({ message, onRetry }) {
  return (
    <PastelBackground>
      <View style={styles.databaseError}>
        <CozyText style={styles.welcomeTitle}>Could not open local storage</CozyText>
        <CozyText style={styles.welcomeDescription}>{message}</CozyText>
        <PrimaryButton title="Try Again" onPress={onRetry} />
      </View>
    </PastelBackground>
  );
}