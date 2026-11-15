import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Screen from '../components/Screen';
import CozyHero from '../components/CozyHero';
import { CozyText as Text } from '../components/CozyText';
import counsellors from '../data/counsellors.json';
import openContact from '../data/openContact';
import { Theme } from '../styles/theme';

const { languages, categories, findCounsellors } = require('../data/counselling');
export default function CounsellingScreen({ navigation }) {
  const [language, setLanguage] = useState(null);
  const [category, setCategory] = useState(null);
  const matches = findCounsellors(counsellors, language, category);

  function renderOption(value, selected, onSelect) {
    return (
      <Pressable
        key={value}
        accessibilityRole="button"
        accessibilityState={{ selected: selected === value }}
        onPress={() => onSelect(value)}
        style={[styles.chip, selected === value && styles.activeChip]}
      >
        <Text style={[styles.chipText, selected === value && styles.activeChipText]}>{value}</Text>
      </Pressable>
    );
  }

  function renderCard(service) {
    return (
      <View key={service.id} style={styles.card}>
        {service.demo ? (
          <View style={styles.demoBadge}>
            <Text style={styles.demoLabel}>FICTIONAL DEMO PROFILE</Text>
          </View>
        ) : null}
        <Text style={styles.name}>{service.name}</Text>
        {service.organization ? <Text style={styles.organization}>{service.organization}</Text> : null}
        {service.languages ? <Text style={styles.detail}>Languages: {service.languages.join(', ')}</Text> : null}
        {service.categories ? <Text style={styles.detail}>Categories: {service.categories.join(', ')}</Text> : null}
        <Text style={styles.description}>{service.description}</Text>
        {service.address ? <Text style={styles.detail}>Address: {service.address}</Text> : null}
        {service.hours ? <Text style={styles.detail}>Hours: {service.hours}</Text> : null}
        <Text style={styles.contactHeading}>Contact details</Text>
        {service.contacts.map((contact, index) => service.demo ? (
          <Text key={`${contact.value}-${index}`} style={styles.demoContact}>
            {contact.label}: {contact.value}
          </Text>
        ) : (
          <Pressable
            key={`${contact.value}-${index}`}
            accessibilityRole={contact.type === 'web' ? 'link' : 'button'}
            accessibilityLabel={`${contact.label} ${contact.value}`}
            onPress={() => openContact(contact)}
            style={styles.contactButton}
          >
            <Text style={styles.contactText}>{contact.label}: {contact.value}</Text>
          </Pressable>
        ))}
        <Text style={styles.verification}>
          {service.demo
            ? 'This person and these contact details are fictional. You cannot contact them.'
            : service.verifiedOn
              ? `Details checked against the listed source on ${service.verifiedOn}. Please confirm current information.`
              : 'Details have not been verified. Please confirm current information with the service.'}
        </Text>
        {!service.demo && service.sourceUrl ? (
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`Open source for ${service.name}`}
            onPress={() => openContact({ type: 'web', value: service.sourceUrl })}
            style={styles.sourceButton}
          >
            <Text style={styles.sourceText}>Check listed source</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <Screen>
      <CozyHero
        eyebrow="FIND THE RIGHT SUPPORT"
        title="Counselling"
        description="Explore example counselling profiles by language and category."
        art="🤝"
        colors={['#E6F0E7', '#E9E7F4']}
      />
      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>About these listings</Text>
        <Text style={styles.demoNotice}>
          Demo only: all example profiles and contact details are fictional. They cannot provide counselling.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Support Directory')}
          style={({ pressed }) => [styles.supportButton, pressed && styles.pressed]}
        >
          <Text style={styles.supportText}>Find real support contacts  ›</Text>
        </Pressable>
      </View>
      <View style={styles.filtersCard}>
        <Text style={styles.filtersEyebrow}>FIND WHAT FEELS RIGHT</Text>
        <Text style={styles.filtersTitle}>Explore by preference</Text>
        <Text style={styles.filtersHelper}>Select a language and a category to explore example profiles.</Text>
        <Text style={styles.label}>Which language would you like?</Text>
        <View style={styles.options}>
          {languages.map(value => renderOption(value, language, setLanguage))}
        </View>
        <Text style={styles.label}>Which category are you looking for?</Text>
        <View style={styles.options}>
          {categories.map(value => renderOption(value, category, setCategory))}
        </View>
      </View>
      {!language || !category ? (
        <Text style={styles.note}>Choose both a language and a category to see matching listings.</Text>
      ) : (
        <>
          <Text style={styles.heading}>Matching profiles</Text>
          {matches.length ? matches.map(renderCard) : (
            <Text style={styles.note}>
              No profiles are available for this language and category.
            </Text>
          )}
          <Text style={styles.note}>
            For immediate danger, contact local emergency services or go to the nearest emergency department.
          </Text>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  noticeCard: { backgroundColor: '#FDF5E8', borderRadius: 22, borderWidth: 1, borderColor: '#F1E5D2', padding: 18, marginBottom: 16 },
  noticeTitle: { color: Theme.text, fontSize: 15, fontWeight: '800', marginBottom: 5 },
  demoNotice: { color: Theme.text, lineHeight: 21, marginBottom: 8 },
  supportButton: { alignSelf: 'flex-start', paddingVertical: 10, paddingRight: 8 },
  supportText: { color: Theme.primaryDark, fontWeight: '800', textDecorationLine: 'underline' },
  pressed: { opacity: 0.7 },
  filtersCard: { backgroundColor: '#F7FAF6', borderRadius: 26, borderWidth: 1, borderColor: Theme.border, padding: 22, marginBottom: 18, shadowColor: '#78947F', shadowOpacity: 0.06, shadowRadius: 16, shadowOffset: { width: 0, height: 5 }, elevation: 1 },
  filtersEyebrow: { color: Theme.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.1, marginBottom: 6 },
  filtersTitle: { color: Theme.text, fontWeight: '800', fontSize: 20, marginBottom: 5 },
  filtersHelper: { color: Theme.muted, lineHeight: 20, marginBottom: 18 },
  label: { color: Theme.text, fontWeight: '700', marginBottom: 10 },
  options: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  chip: { borderWidth: 1, borderColor: Theme.border, borderRadius: 22, minHeight: 46, justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 10, marginRight: 8, marginBottom: 8, backgroundColor: '#FFFFFF' },
  activeChip: { backgroundColor: Theme.primary, borderColor: Theme.primary },
  chipText: { color: Theme.text, fontSize: 13 },
  activeChipText: { color: '#FFFFFF', fontWeight: '700' },
  heading: { color: Theme.text, fontWeight: '800', fontSize: 20, marginTop: 6, marginBottom: 12 },
  note: { color: Theme.muted, fontSize: 13, lineHeight: 20, marginBottom: 16, paddingHorizontal: 3 },
  card: { backgroundColor: Theme.surface, borderRadius: 22, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: Theme.border, shadowColor: '#78947F', shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  demoBadge: { alignSelf: 'flex-start', backgroundColor: '#F7EEDC', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 10 },
  demoLabel: { color: Theme.primaryDark, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  demoContact: { color: Theme.text, lineHeight: 20, marginTop: 6 },
  name: { color: Theme.text, fontSize: 17, fontWeight: '800' },
  organization: { color: Theme.primary, fontWeight: '600', marginTop: 3, marginBottom: 9 },
  description: { color: Theme.text, lineHeight: 21, marginTop: 5 },
  detail: { color: Theme.text, lineHeight: 20, marginTop: 8 },
  contactHeading: { color: Theme.primaryDark, fontWeight: '700', marginTop: 13, marginBottom: 5 },
  contactButton: { alignSelf: 'flex-start', backgroundColor: Theme.lavender, borderRadius: 9, paddingHorizontal: 11, paddingVertical: 9, marginTop: 6 },
  contactText: { color: Theme.primaryDark, fontWeight: '700' },
  verification: { color: Theme.muted, fontSize: 12, lineHeight: 18, marginTop: 10 },
  sourceButton: { alignSelf: 'flex-start', paddingVertical: 10 },
  sourceText: { color: Theme.primary, fontWeight: '700', textDecorationLine: 'underline' },
});
