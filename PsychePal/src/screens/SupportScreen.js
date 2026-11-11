import React, { useMemo, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import Screen from '../components/Screen';
import CozyHero from '../components/CozyHero';
import { CozyText as Text } from '../components/CozyText';
import TextInput from '../components/CozyInput';
import support from '../data/supportContacts.json';
import { Theme } from '../styles/theme';

async function openContact(contact) {
  const url = contact.type === 'phone'
    ? `tel:${contact.value.replace(/[^\d+]/g, '')}`
    : contact.value;
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Unable to open contact', 'This device cannot open the selected phone or web link.');
      return;
    }
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert(
      'Unable to open contact',
      error.message || 'Please try again or use the contact details shown in the listing.',
    );
  }
}

export default function SupportScreen() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const categories = ['All', ...new Set(support.map(item => item.category).filter(Boolean))];
  const filtered = useMemo(() => support.filter(item => {
    const matchesCategory = category === 'All' || item.category === category;
    const searchable = [
      item.name,
      item.organization,
      item.category,
      item.description,
      item.address,
      item.hours,
      ...(item.contacts || []).map(contact => contact.value),
    ].filter(Boolean).join(' ').toLowerCase();
    return matchesCategory && searchable.includes(query.trim().toLowerCase());
  }), [category, query]);

  return (
    <Screen>
      <CozyHero
        eyebrow="YOU DON'T HAVE TO DO IT ALONE"
        title="Find support"
        description="Explore local mental-health services and ways to get in touch."
        art="🤝"
        colors={['#E6F0E7', '#E9E7F4']}
      />
      <Text style={styles.intro}>
        Find mental health services, emotional support, and contact details in Sri Lanka.
        For a licensed counselor or clinical assessment, contact NIMH or a local health service to ask about referrals.
      </Text>
      <Text style={styles.offlineNote}>
        Directory details are stored on this device. Calling or opening a source website needs a compatible app and may need internet access.
      </Text>

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Need urgent help?</Text>
        <Text style={styles.noticeText}>
          If you or someone else is in immediate danger, contact local emergency services or go to the nearest hospital.
          Call the National Mental Health Helpline at 1926 for mental health support.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => openContact({ type: 'phone', value: '1926' })}
          style={styles.urgentButton}
        >
          <Text style={styles.urgentButtonText}>Call 1926</Text>
        </Pressable>
      </View>

      <TextInput
        accessibilityLabel="Search support services"
        value={query}
        onChangeText={setQuery}
        placeholder="Search services, categories, or phone numbers"
        style={styles.input}
      />
      <Text style={styles.filterLabel}>Available support categories</Text>
      <View style={styles.filters}>
        {categories.map(option => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: category === option }}
            key={option}
            style={[styles.filter, category === option && styles.activeFilter]}
            onPress={() => setCategory(option)}
          >
            <Text style={[styles.filterText, category === option && styles.activeFilterText]}>{option}</Text>
          </Pressable>
        ))}
      </View>

      {filtered.map(item => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.serviceName}>{item.name}</Text>
          <Text style={styles.organization}>{item.organization}</Text>
          <Text style={styles.description}>{item.description}</Text>
          {item.address ? <Text style={styles.detail}><Text style={styles.detailLabel}>Address: </Text>{item.address}</Text> : null}
          {item.hours ? <Text style={styles.detail}><Text style={styles.detailLabel}>Hours: </Text>{item.hours}</Text> : null}
          <Text style={styles.contactHeading}>Contact details</Text>
          {(item.contacts || []).map((contact, index) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${contact.label} ${contact.value}`}
              key={`${contact.value}-${index}`}
              onPress={() => openContact(contact)}
              style={styles.contactButton}
            >
              <Text style={styles.contactButtonText}>{contact.label}: {contact.value}</Text>
            </Pressable>
          ))}
          <Text style={[styles.verification, item.verifiedOn ? styles.verified : styles.unverified]}>
            {item.verifiedOn
              ? `Details checked against the listed source on ${new Date(`${item.verifiedOn}T00:00:00`).toLocaleDateString()}. Confirm before relying on them.`
              : 'Details were not verified during this update. Contact the service to confirm current information.'}
          </Text>
          {item.sourceUrl ? (
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`Open source for ${item.name}`}
              onPress={() => openContact({ type: 'web', value: item.sourceUrl })}
              style={styles.websiteButton}
            >
              <Text style={styles.websiteText}>Check listed source</Text>
            </Pressable>
          ) : null}
          {item.website ? (
            <Pressable
              accessibilityRole="link"
              onPress={() => openContact({ type: 'web', value: item.contactPage || item.website })}
              style={styles.websiteButton}
            >
              <Text style={styles.websiteText}>Visit official website</Text>
            </Pressable>
          ) : null}
        </View>
      ))}
      {filtered.length ? (
        <Text style={styles.count}>{filtered.length} {filtered.length === 1 ? 'service' : 'services'} found</Text>
      ) : (
        <Text style={styles.empty}>No matching services found. Try another search or category.</Text>
      )}
      <Text style={styles.disclaimer}>
        Contact details and availability can change. Confirm information with the service before visiting.
        Directory information is not a diagnosis or a replacement for professional care.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { color: Theme.muted, lineHeight: 21, marginBottom: 14 },
  offlineNote: { color: Theme.muted, fontSize: 12, lineHeight: 18, marginBottom: 14 },
  notice: { backgroundColor: '#F3E9F0', borderRadius: 20, padding: 17, marginBottom: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)' },
  noticeTitle: { color: Theme.primaryDark, fontWeight: '800', fontSize: 16, marginBottom: 6 },
  noticeText: { color: Theme.text, lineHeight: 20 },
  urgentButton: { backgroundColor: Theme.primary, borderRadius: 18, paddingVertical: 12, paddingHorizontal: 17, alignSelf: 'flex-start', marginTop: 12 },
  urgentButtonText: { color: '#FFFFFF', fontWeight: '700' },
  input: { backgroundColor: 'rgba(255,255,255,0.84)', borderWidth: 1, borderColor: Theme.border, borderRadius: 18, padding: 14, marginBottom: 16, color: Theme.text },
  filterLabel: { color: Theme.text, fontWeight: '700', marginBottom: 8 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  filter: { minHeight: 36, justifyContent: 'center', paddingHorizontal: 11, borderWidth: 1, borderColor: Theme.border, borderRadius: 18, marginRight: 7, marginBottom: 7, backgroundColor: Theme.surface },
  activeFilter: { backgroundColor: Theme.primary, borderColor: Theme.primary },
  filterText: { color: Theme.text, fontSize: 13 },
  activeFilterText: { color: '#FFFFFF', fontWeight: '700' },
  card: { backgroundColor: 'rgba(255,255,255,0.84)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', borderRadius: 21, padding: 17, marginBottom: 12 },
  category: { alignSelf: 'flex-start', color: Theme.primaryDark, backgroundColor: Theme.lavender, borderRadius: 12, paddingHorizontal: 9, paddingVertical: 5, fontSize: 12, fontWeight: '700', overflow: 'hidden', marginBottom: 9 },
  serviceName: { color: Theme.text, fontSize: 17, fontWeight: '800' },
  organization: { color: Theme.primary, fontWeight: '600', marginTop: 3, marginBottom: 9 },
  description: { color: Theme.text, lineHeight: 21 },
  detail: { color: Theme.text, lineHeight: 20, marginTop: 8 },
  detailLabel: { color: Theme.primaryDark, fontWeight: '700' },
  contactHeading: { color: Theme.primaryDark, fontWeight: '700', marginTop: 13, marginBottom: 5 },
  contactButton: { alignSelf: 'flex-start', backgroundColor: Theme.lavender, borderRadius: 9, paddingHorizontal: 11, paddingVertical: 9, marginTop: 6 },
  contactButtonText: { color: Theme.primaryDark, fontWeight: '700' },
  verification: { lineHeight: 18, fontSize: 12, marginTop: 10 },
  verified: { color: Theme.success },
  unverified: { color: Theme.muted },
  websiteButton: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 2 },
  websiteText: { color: Theme.primary, fontWeight: '700', textDecorationLine: 'underline' },
  count: { color: Theme.muted, fontSize: 12, textAlign: 'center', marginTop: 4 },
  empty: { color: Theme.muted, textAlign: 'center', marginTop: 20 },
  disclaimer: { color: Theme.muted, fontSize: 12, lineHeight: 18, marginTop: 18 },
});
