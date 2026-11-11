import React from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import Screen from '../components/Screen';
import { CozyText as Text } from '../components/CozyText';
import { useAppSettings } from '../context/AppSettingsContext';
import { translate } from '../i18n/translations';
import { Theme } from '../styles/theme';

export default function EmergencyScreen({ navigation }) {
  const { language, setEmergencyMode } = useAppSettings();
  const t = text => translate(text, language);

  async function callHelpline() {
    try {
      await Linking.openURL('tel:1926');
    } catch (error) {
      Alert.alert(
        t('Could not open phone app'),
        t('Please call 1926 manually or use your local emergency number.'),
      );
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{t('Support in Sri Lanka')}</Text>
        <Text style={styles.title}>{t('You are not alone right now.')}</Text>
        <Text style={styles.subtitle}>{t('Take this one moment at a time.')}</Text>
      </View>

      <View style={styles.contactCard}>
        <Text style={styles.contactTitle}>{t('National Mental Health Helpline')}</Text>
        <Text style={styles.contactNote}>{t('This is a mental-health support line. Availability may vary.')}</Text>
        <Pressable accessibilityRole="button" onPress={callHelpline} style={styles.callButton}>
          <Text style={styles.callButtonText}>{t('Call 1926')}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Support Directory')}
          style={styles.directoryButton}
        >
          <Text style={styles.directoryButtonText}>{t('Browse support contacts')}</Text>
        </Pressable>
      </View>

      <View style={styles.guidanceCard}>
        <Text style={styles.guidance}>{t('If you might hurt yourself or are in immediate danger, contact local emergency services or go to the nearest emergency department now. If possible, stay with someone you trust.')}</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => setEmergencyMode(false)}
        style={styles.returnButton}
      >
        <Text style={styles.returnButtonText}>{t('Return to PsychePal')}</Text>
      </Pressable>
      <Text style={styles.footer}>{t('You can come back to this screen from Settings.')}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 18, paddingTop: 8 },
  eyebrow: { color: Theme.primaryDark, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  title: { color: Theme.text, fontSize: 27, lineHeight: 34, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: Theme.muted, fontSize: 17, marginTop: 8, textAlign: 'center' },
  guidanceCard: { backgroundColor: '#F6E5D8', borderRadius: 18, padding: 16, marginBottom: 14 },
  guidance: { color: Theme.text, lineHeight: 23, fontSize: 16 },
  contactCard: { backgroundColor: Theme.surface, borderWidth: 1, borderColor: Theme.border, borderRadius: 18, padding: 16 },
  contactTitle: { color: Theme.primaryDark, fontSize: 18, fontWeight: '800' },
  contactNote: { color: Theme.muted, lineHeight: 20, marginTop: 6 },
  callButton: { backgroundColor: Theme.primary, borderRadius: 13, padding: 14, alignItems: 'center', marginTop: 15 },
  callButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  directoryButton: { borderWidth: 1, borderColor: Theme.primary, borderRadius: 13, padding: 13, alignItems: 'center', marginTop: 10 },
  directoryButtonText: { color: Theme.primaryDark, fontWeight: '700' },
  returnButton: { alignItems: 'center', padding: 14, marginTop: 12 },
  returnButtonText: { color: Theme.primaryDark, fontWeight: '800', fontSize: 16 },
  footer: { color: Theme.muted, textAlign: 'center', marginBottom: 8 },
});
