import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Screen from '../components/Screen';
import CozyHero from '../components/CozyHero';
import { CozyText as Text } from '../components/CozyText';
import counsellors from '../data/counsellors.json';
import support from '../data/supportContacts.json';
import openContact from '../data/openContact';
import { Theme } from '../styles/theme';

const { languages, categories, findCounsellors } = require('../data/counselling');
const alternatives = support.filter(service =>
  ['nimh-helpline', 'nimh-hospital', 'sumithrayo-colombo'].includes(service.id));

export default function CounsellingScreen() {
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
        <Text style={styles.name}>{service.name}</Text>
        {service.organization ? <Text style={styles.organization}>{service.organization}</Text> : null}
        {service.languages ? <Text style={styles.detail}>Languages: {service.languages.join(', ')}</Text> : null}
        {service.categories ? <Text style={styles.detail}>Categories: {service.categories.join(', ')}</Text> : null}
        <Text style={styles.description}>{service.description}</Text>
        {service.address ? <Text style={styles.detail}>Address: {service.address}</Text> : null}
        {service.hours ? <Text style={styles.detail}>Hours: {service.hours}</Text> : null}
        <Text style={styles.contactHeading}>Contact details</Text>
        {service.contacts.map((contact, index) => (
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
          {service.verifiedOn
            ? `Details checked against the listed source on ${service.verifiedOn}. Please confirm current information.`
            : 'Details have not been verified. Please confirm current information with the service.'}
        </Text>
        {service.sourceUrl ? (
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
        description="Choose a language and a type of counselling to look for support in Sri Lanka."
        art="🤝"
        colors={['#E6F0E7', '#E9E7F4']}
      />
      <Text style={styles.label}>Which language would you like?</Text>
      <View style={styles.options}>
        {languages.map(value => renderOption(value, language, setLanguage))}
      </View>
      <Text style={styles.label}>Which category are you looking for?</Text>
      <View style={styles.options}>
        {categories.map(value => renderOption(value, category, setCategory))}
      </View>
      {!language || !category ? (
        <Text style={styles.note}>Choose both a language and a category to see matching listings.</Text>
      ) : (
        <>
          <Text style={styles.heading}>Matching counsellors and services</Text>
          {matches.length ? matches.map(renderCard) : (
            <Text style={styles.note}>
              No verified listings are available for this language and category yet.
              The services below may be able to help you find support.
            </Text>
          )}
          <Text style={styles.heading}>Other support contacts</Text>
          <Text style={styles.note}>
            These are existing support services, not matched counsellors. Their languages and counselling
            specialties have not been confirmed for your selection. Contact them to ask about availability,
            qualifications, fees, and referrals.
          </Text>
          {alternatives.map(renderCard)}
          <Text style={styles.note}>
            For immediate danger, contact local emergency services or go to the nearest emergency department.
            Contact details may change; confirm them before relying on them.
          </Text>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { color: Theme.text, fontWeight: '700', marginBottom: 8 },
  options: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  chip: { borderWidth: 1, borderColor: Theme.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 9, marginRight: 7, marginBottom: 7, backgroundColor: Theme.surface },
  activeChip: { backgroundColor: Theme.primary, borderColor: Theme.primary },
  chipText: { color: Theme.text, fontSize: 13 },
  activeChipText: { color: '#FFFFFF', fontWeight: '700' },
  heading: { color: Theme.text, fontWeight: '800', fontSize: 17, marginTop: 6, marginBottom: 9 },
  note: { color: Theme.muted, fontSize: 12, lineHeight: 19, marginBottom: 14 },
  card: { backgroundColor: Theme.surface, borderRadius: 21, padding: 17, marginBottom: 12, borderWidth: 1, borderColor: Theme.border },
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
