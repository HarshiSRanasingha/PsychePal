import React from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import Screen from '../components/Screen';
import { CozyText as Text } from '../components/CozyText';
import { useAppSettings } from '../context/AppSettingsContext';
import { translate } from '../i18n/translations';
import { DarkPalette, Theme } from '../styles/theme';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'si', label: 'Sinhala' },
  { code: 'ta', label: 'Tamil' },
];

export default function SettingsScreen({ navigation }) {
  const { language, darkMode, emergencyMode, setLanguage, setDarkMode, setEmergencyMode } = useAppSettings();
  const t = text => translate(text, language);

  return (
    <Screen>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('Language')}</Text>
        <Text style={styles.description}>{t('Choose a language for Settings and Emergency Support.')}</Text>
        <View style={styles.optionRow}>
          {languages.map(option => (
            <Pressable
              key={option.code}
              accessibilityRole="button"
              accessibilityState={{ selected: language === option.code }}
              onPress={() => setLanguage(option.code)}
              style={[styles.option, language === option.code && styles.selectedOption]}
            >
              <Text style={[styles.optionText, language === option.code && styles.selectedOptionText]}>
                {t(option.label)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('Appearance')}</Text>
        <View style={styles.optionRow}>
          {[{ value: false, label: 'Light' }, { value: true, label: 'Dark' }].map(option => (
            <Pressable
              key={option.label}
              accessibilityRole="button"
              accessibilityState={{ selected: darkMode === option.value }}
              onPress={() => setDarkMode(option.value)}
              style={[styles.option, styles.appearanceOption, darkMode === option.value && styles.selectedOption]}
            >
              <Text style={[styles.optionText, darkMode === option.value && styles.selectedOptionText]}>
                {t(option.label)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.emergencyHeader}>
          <View style={styles.emergencyCopy}>
            <Text style={styles.sectionTitle}>{t('Emergency')}</Text>
            <Text style={styles.emergencyTitle}>{t('I need urgent support')}</Text>
          </View>
          <Switch
            accessibilityLabel={t('I need urgent support')}
            value={emergencyMode}
            onValueChange={setEmergencyMode}
            trackColor={{ false: darkMode ? DarkPalette.border : Theme.border, true: darkMode ? DarkPalette.button : '#A8C7B0' }}
            thumbColor={emergencyMode ? (darkMode ? DarkPalette.primary : '#9FC8AA') : '#F4F3F4'}
          />
        </View>
        <Text style={styles.description}>{t('Show a calmer screen with support options. This will not contact anyone for you.')}</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('Profile')}
        style={styles.profileButton}
      >
        <Text style={styles.profileButtonText}>{t('Your profile')}</Text>
        <Text style={styles.arrow}>›</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Theme.surface, borderRadius: 24, padding: 20, marginTop: 14, borderWidth: 1, borderColor: Theme.border, shadowColor: '#78947F', shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  sectionTitle: { color: Theme.primaryDark, fontSize: 18, fontWeight: '800', marginBottom: 6 },
  description: { color: Theme.muted, lineHeight: 20 },
  optionRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  option: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 16, borderWidth: 1, borderColor: Theme.border, backgroundColor: Theme.background, paddingHorizontal: 6 },
  appearanceOption: { flex: 1 },
  selectedOption: { backgroundColor: Theme.accent, borderColor: Theme.primary },
  optionText: { color: Theme.text, fontWeight: '700', textAlign: 'center' },
  selectedOptionText: { color: Theme.primaryDark },
  emergencyHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  emergencyCopy: { flex: 1, paddingRight: 10 },
  emergencyTitle: { color: Theme.text, fontWeight: '700' },
  profileButton: { backgroundColor: Theme.surface, borderColor: Theme.border, borderWidth: 1, borderRadius: 16, marginTop: 18, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profileButtonText: { color: Theme.primaryDark, fontWeight: '700' },
  arrow: { color: Theme.primary, fontSize: 22, lineHeight: 22 },
});
