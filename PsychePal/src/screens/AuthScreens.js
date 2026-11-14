import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import Screen from '../components/Screen';
import { CozyText as Text } from '../components/CozyText';
import TextInput from '../components/CozyInput';
import { registerLocalAccount, loginLocalAccount } from '../data/localAccounts';
import { Theme } from '../styles/theme';

function AuthHeader({ title, description }) {
  return (
    <View style={styles.header}>
      <View style={styles.logo}><Text style={styles.logoCloud}>☁</Text></View>
      <Text style={styles.brand}>PsychePal</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

function AuthFooter({ onPress, prompt, action }) {
  return (
    <View style={styles.footerRow}>
      <Text style={styles.footerPrompt}>{prompt}</Text>
      <Pressable accessibilityRole="button" onPress={onPress}>
        <Text style={styles.footerAction}>{action}</Text>
      </Pressable>
    </View>
  );
}

export function LoginScreen({ navigation, onAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function submit() {
    if (!email.trim() || !password) {
      setErrorMessage('Enter the email and password used for this device.');
      return;
    }

    setBusy(true);
    setErrorMessage('');
    try {
      const account = await loginLocalAccount({ email, password });
      onAuthenticated(account);
    } catch (error) {
      setErrorMessage(error.message || 'Could not sign in. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <AuthHeader
        title="Welcome back"
        description="Sign in to your private, on-device PsychePal profile."
      />
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          accessibilityLabel="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          style={styles.input}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          accessibilityLabel="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          style={styles.input}
          onSubmitEditing={submit}
        />
        {errorMessage ? <Text accessibilityRole="alert" style={styles.error}>{errorMessage}</Text> : null}
        <PrimaryButton disabled={busy} title={busy ? 'Signing in...' : 'Sign In'} onPress={submit} />
        <AuthFooter
          onPress={() => navigation.navigate('Register')}
          prompt="New to PsychePal?"
          action="Create account"
        />
      </View>
      <Text style={styles.note}>
        Accounts are stored only on this device. There is no online sync or password recovery.
      </Text>
    </Screen>
  );
}

export function RegisterScreen({ navigation, onAuthenticated }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function submit() {
    if (!displayName.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage('Complete every field to create your profile.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Use a password with at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('The passwords do not match.');
      return;
    }

    setBusy(true);
    setErrorMessage('');
    try {
      const result = await registerLocalAccount({ displayName, email, password });
      onAuthenticated(result.account, result.migrationWarning);
    } catch (error) {
      setErrorMessage(error.message || 'Could not create your profile. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <AuthHeader
        title="Create your profile"
        description="Set up an offline profile to keep your reflections on this device."
      />
      <View style={styles.card}>
        <Text style={styles.label}>Your name</Text>
        <TextInput
          accessibilityLabel="Your name"
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Name"
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          maxLength={60}
          style={styles.input}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          accessibilityLabel="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          style={styles.input}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          accessibilityLabel="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="At least 8 characters"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          style={styles.input}
        />
        <Text style={styles.label}>Confirm password</Text>
        <TextInput
          accessibilityLabel="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Enter your password again"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          style={styles.input}
          onSubmitEditing={submit}
        />
        {errorMessage ? <Text accessibilityRole="alert" style={styles.error}>{errorMessage}</Text> : null}
        <PrimaryButton disabled={busy} title={busy ? 'Creating profile...' : 'Create Account'} onPress={submit} />
        <AuthFooter
          onPress={() => navigation.navigate('Login')}
          prompt="Already have a profile?"
          action="Sign in"
        />
      </View>
      <Text style={styles.note}>
        Your password is stored as a salted hash. Your local app data is not encrypted or synced, and there is no password reset.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingTop: 16, paddingBottom: 18 },
  logo: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center', backgroundColor: Theme.primary, marginBottom: 8 },
  logoCloud: { color: '#FFFFFF', fontSize: 36 },
  brand: { color: Theme.primaryDark, fontSize: 19, fontWeight: '800' },
  title: { color: Theme.text, fontSize: 26, lineHeight: 32, fontWeight: '800', textAlign: 'center', marginTop: 16 },
  description: { color: Theme.muted, textAlign: 'center', lineHeight: 21, marginTop: 6, maxWidth: 340 },
  card: { backgroundColor: Theme.surface, borderRadius: 22, borderWidth: 1, borderColor: Theme.border, padding: 18 },
  label: { color: Theme.primaryDark, fontWeight: '700', marginTop: 8, marginBottom: 6 },
  input: { backgroundColor: Theme.background, borderWidth: 1, borderColor: Theme.border, borderRadius: 13, paddingHorizontal: 13, paddingVertical: 12, color: Theme.text },
  error: { color: '#A94442', lineHeight: 20, marginTop: 10 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5, marginTop: 14 },
  footerPrompt: { color: Theme.muted },
  footerAction: { color: Theme.primaryDark, fontWeight: '800', paddingVertical: 6 },
  note: { color: Theme.muted, textAlign: 'center', lineHeight: 19, fontSize: 12, marginTop: 15, paddingHorizontal: 8 },
});
